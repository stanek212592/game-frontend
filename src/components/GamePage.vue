<template>
  <div class="height-100 width-100 fp-column game-page" ref="gamePage">
    <div v-if="loading" class="overlay">
      <span class="overlay-text">Načítání hry</span>
    </div>
    <div id="gameContainer" ref="gameContainer" class="game-container"/>
    <div class="game-toolbar">
      hra: {{ isGameActive }}, hráčů: {{ players }}, W: {{ gameContainerWidth }} H: {{ gameContainerHeight }}
    </div>
    <div class="fp-column" style="position: absolute; right: 3px;">
      <q-btn style="margin: 3px;" icon="visibility" color="accent" title="Zobrazit pohled hráče"
             @click="changeCameraView(cameraView.PLAYER)"/>
      <q-btn style="margin: 3px;" icon="panorama" color="accent" title="Náhled na herní stůl"
             @click="changeCameraView(cameraView.TABLE)"/>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import {appSetting} from "stores/appSetting";

import {defineComponent} from 'vue'

import Scene from "components/game/scene"
import Cards from "components/game/cards"
import Controls from "components/game/controls"
import {game} from "stores/game";
import {user} from "stores/user";
import elementsEnum from "components/game/elementsEnum";
import imagesEnum from "src/imagesEnum";
import cardMoves from "components/game/cardMoves";
import utils from "components/game/utils";


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
export default defineComponent({
  name: "GamePage",

  data: () => ({
    // Parametry herního kontejneru
    gameContainerWidth: 0,
    gameContainerHeight: 0,

    // Proměnné pro webGL
    camera: null,
    renderer: null,
    scene: null,
    tableEdges: 4,
    materials: {
      cardFrame: {
        primary: null,
        secondary: null,
      },
      cardBack: null,
      table: null,
      sky: null,
      grass: null,
    },
    cameraView: {
      PLAYER: 'player',
      TABLE: 'table'
    },

    // Proměnné pro hru
    loading: false,
    gameCards: [],
    drawPileObject: null,
    discardPileObject: null,
    playerSelectObject: null,
    timeouts: [],
    fetchPromises: [],
  }),

  computed: {
    showMenu() {
      return appSetting().showMenu
    },
    players() {
      return game().players.length
    },
    isGameActive() {
      return game().isGameActive
    }

  },

  methods: {

    // Spuštění hry
    async startGame() {
      this.loading = true
      // Během přípravy hry nemůže hráč hrát
      game().userActionDisabled = true

      // TODO dát možnost zmněy nastavení aplikace na frontu
      const data = {
        settingsId: 1,
        userIds: [1, 2],
        cardGroupId: 1
      }

      // Vytvoření materiálů pro karty a vytvoření karet
      this.materials.cardFrame.primary = Cards.createColoredMaterial('#000000')
      this.materials.cardFrame.secondary = Cards.createColoredMaterial('#fb8d3c')
      this.materials.cardBack = Cards.createFromUrlMaterial(imagesEnum.CARD_BACK.path)

      const gameCards = []

      // Načítání karet s možností zrušení požadavku
      let id = Date.now()
      let controls = {cancel: null, id: id}
      let fetchPromise = this.$get('prsi/all_cards', {groupId: 1}, false, controls)
      this.fetchPromises.push(controls)
      const allCards = await fetchPromise
      this.fetchPromises = this.fetchPromises.filter(c => c.id !== id)

      if (allCards === null) return
      allCards.forEach(c => {
        gameCards.push(
          Cards.createCardFromMaterials(
            1,
            elementsEnum.CARD,
            Cards.createTexturedMaterial(c.face),
            this.materials.cardBack,
            this.materials.cardFrame,
            {cardId: c.id}
          )
        )
        delete c.face
      })

      id = Date.now()
      controls = {cancel: null, id: id}
      fetchPromise = await this.$post('prsi', data, false, controls)
      this.fetchPromises.push(controls)
      const startParams = await fetchPromise
      this.fetchPromises = this.fetchPromises.filter(c => c.id !== id)



      // sařazení karet dle toho jak bylo určeno na serveru
      const orderIndex = new Map(startParams.drawPile.map((value, index) => [value, index]));
      gameCards.sort((a, b) => orderIndex.get(a.params.cardId) - orderIndex.get(b.params.cardId));
      this.gameCards = gameCards


      // TODO zrušit?
      // Metoda pro určeníé celého jména hráče
      const playerName = (user) => {
        const name = user.firstname + `${user.firstname && user.surname ? ' ' : ''}` + user.surname
        return name ? name + ` (${user.login})` : user.login
      }


      //TODO upraviot na načítnání ze serveru
      const playersList = game().players
      const countOfPlayers = game().players.length
      const angel = 2 * Math.PI / countOfPlayers
      playersList.forEach((player, index) => {
        player.id = index
        player.name = index === 0 ? playerName(user()) : 'počítač ' + index
        player.main = index === 0
        player.angle = angel * index + Math.PI / 2
        player.point = utils.vector(
          angel * index + Math.PI / 2,
          Scene.tableConfig.radius * (countOfPlayers === 2 || countOfPlayers === 4 ? 0.75 : (countOfPlayers === 5 ? 0.85 : 0.9))
        )
        player.cardInHand = []
      })


      // TODO musí chodit z backendu
      // Generátor karet
      game().drawPileCards = []
      this.discardPileObject = null
      const cardsCount = game().initialSettings.cardCount
      game().drawPileCards = Array.from({length: cardsCount}, (_, i) => ({
        id: i,
        picture: imagesEnum.CARDS[Math.floor(Math.random() * 6) + 1],
        params: {selectable: true},
      }));

      return

      // Přidání balíčku karet
      this.createDrawPile(game().initialSettings.drawPilePosition.x, game().initialSettings.drawPilePosition.z)

      this.loading = false

      console.log('před rozdáním')
      // Rozdání karet
      this.dealCards(game().players, game().initialSettings.cardsPerPlayer)
        .then(() => {
          game().userActionDisabled = false
          console.log('rozdáno')
        })
    },


    // Rozdávání karet z balíčku jednotlivým hráčů
    async dealCards(players, cardsPerPlayer) {
      const promises = []
      players.forEach((player, j) => {
        for (let i = 0; i < cardsPerPlayer; i++) {

          // Vytvoření Promise pro každé volání setTimeout
          const promise = new Promise(resolve => {
            const timeout = setTimeout(() => {
              this.getDrawPileCard(player).then(() => resolve())
            }, 750 * i + j * 400)
            this.timeouts.push(timeout)
          })
          promises.push(promise)
        }
      });
      return Promise.all(promises)
    },

    // Přidání balíčku karet
    createDrawPile(x = 0, z = 0) {
      const drawPileSize = game().drawPileCards.length
      const drawPile = Cards.createCard(drawPileSize)
      if (drawPile) {
        drawPile.position.y = Scene.tableConfig.height + (drawPileSize + 1) * Cards.config.depth
        drawPile.position.x = x
        drawPile.position.z = z
        this.scene.add(drawPile)
      }
      this.drawPileObject = drawPile
    },

    handleMouseClickOnCard(card) {
      // Pokud nelze kartu vybrat
      if (!card?.params?.selectable) return

      // První kliknutí na kartu
      if (!this.playerSelectObject || (this.playerSelectObject && this.playerSelectObject !== card)) {
        this.clearPlayerSelect()
        card.select()
        this.playerSelectObject = card
        return
      }

      // Pokud klikneme podruhé na stejnou kartu
      this.clearPlayerSelect()
      if (card.params.playerId != null) this.moveToDiscardPile(card)
    },

    handleMouseClickOnDrawPile(object) {
      // Označení balíčku, pokud již není označený
      if (!this.playerSelectObject || (this.playerSelectObject !== object)) {
        this.clearPlayerSelect()
        object.select()
        this.playerSelectObject = object
        return
      }

      // Pro druhé kliknutí na balíček
      this.clearPlayerSelect()
      const player = game().players.find(p => p.main)
      this.getDrawPileCard(player)

    },

    clearPlayerSelect() {
      const object = this.playerSelectObject
      if (!object) return
      if (object.select) object.select(false)
      this.playerSelectObject = null
    },

//<editor-fold desc="Metody pro pohyby karet">


    async addCardToHand(card, targetAngleX = game().animate.cardAngleView) {
      const steps = Math.abs(Math.ceil(targetAngleX / (game().animate.angleSize * game().speed)))
      let counter = 0
      let animationFrameId = null
      return new Promise((resolve) => {
        const animate = async () => {
          if (counter < steps) {
            card.rotateX(targetAngleX / steps)
            counter++
          } else {
            const player = game().players.find(p => p.id === card.params.playerId)
            player.cardInHand.push(card)

            const maxCardsPerRow = game().animate.maxCardsPerRow
            let inlineCardCount = (player.cardInHand.length - 1) % maxCardsPerRow + 1
            let distanceCoef = Math.floor((player.cardInHand.length - 1) / maxCardsPerRow)

            switch (distanceCoef) {
              case 0:
                distanceCoef = 1
                break
              case 1:
                distanceCoef = 0
                break
              case 2:
                break
              default:
                distanceCoef = -distanceCoef + 2
            }

            distanceCoef *= game().animate.cardOverlap
            distanceCoef -= 1
            // await this.pickCard(card, null, Scene.tableConfig.height - distanceCoef * Cards.config.height)


            // Srovnání karet pro druhou a každou další
            if (inlineCardCount - 1) {
              // Pozice první karty
              const position = player.point

              // Směr
              const direction = inlineCardCount % 2 === 0 ? player.angle - Math.PI / 2 : player.angle + Math.PI / 2
              const vector = utils.vector(direction, (Cards.config.width * 2 + 10) * Math.floor(inlineCardCount / 2))
              vector.x += position.x
              vector.z += position.z
              if (!await cardMoves.moveCardTo(card, vector)) {
                resolve(false)
                return
              }
            }
            if (!await cardMoves.moveCardVertically(card, null, Scene.tableConfig.height - distanceCoef * Cards.config.height)) {
              resolve(false)
              return
            }

            if (!await cardMoves.moveCard(card, Cards.config.height * Math.abs(distanceCoef), Math.sign(distanceCoef) * player.angle)) {
              resolve(false)
              return
            }

            resolve(true)
            return
          }


          if (!game().isGameActive) {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            resolve(false);
            return;
          }
          animationFrameId = requestAnimationFrame(animate)
        }
        animate()
      })

    },

    async moveToDiscardPile(card) {
      game().userActionDisabled = true
      card.params.selectable = false
      card.hidePicture(false)
      // Pokud by náhodou nebyl odhazovací balíček jako pole
      if (!game().discardPileCards) game().discardPileCards = []

      // Určení cílové polohy
      const targetHeight = Scene.tableConfig.height + game().discardPileCards.length * Cards.config.depth * 4
      const destination = game().initialSettings.discardPilePosition
      const originalPosition = {...card.position}

      // Vložení karty do odhazovacího balíčku
      game().discardPileCards.push(card)

      // Odebrání karty ze seznamu hráčových karet, současně přesunutí karty z poslední pozice
      // na místo vyhozené pro jednodušší řazení karet
      const player = game().players.find(p => p.id === card.params.playerId)
      const cardsInHand = player.cardInHand
      const index = cardsInHand.findIndex(c => c === card)
      const repositionedCard = cardsInHand[cardsInHand.length - 1]
      const isLast = index === cardsInHand.length - 1
      if (!isLast) cardsInHand.splice(index, 1, repositionedCard);
      cardsInHand.pop()
      card.params.playerId = null

      const rearrangePlayersCard = async () => {
        await cardMoves.moveCardVertically(repositionedCard, undefined, originalPosition.y)
        await cardMoves.moveCardTo(repositionedCard, {x: originalPosition.x, z: originalPosition.z})
      }

      // // Zobrazení obrázku na kartě
      // const newCard = Cards.createCard(1,)

      // Odhození karty
      return new Promise(async (resolve) => {
        await cardMoves.moveCardVertically(card)
        if (!isLast) rearrangePlayersCard().then(() => game().userActionDisabled = false)
        else game().userActionDisabled = false
        await cardMoves.rotateCardBy(card, Math.PI / 2 + game().animate.cardAngleView);
        await cardMoves.moveCardTo(card, destination)

        // await cardMoves.rotateCardTo(card, -Math.PI / 2, 0, 1)
        const randZ = utils.round(Math.random() * 2 * Math.PI)
        await cardMoves.rotateCardTo(card, -Math.PI / 2, 0, randZ)

        await cardMoves.moveCardVertically(card, undefined, targetHeight)
        card.params.selectable = true
        resolve(true)
      })
    },

    // Přensun karty z balíčku hráči do ruky
    async getDrawPileCard(player) {
      if (!game().isGameActive) return
      // const picture = null // TODO vzít poslední z balíčku
      const drawPileCardsSize = game().drawPileCards.length
      if (!drawPileCardsSize) return

      // Vzít první kartu a odebrat ji z balíčku
      const card = game().drawPileCards[0]

      card.params.selectable = false
      game().drawPileCards = game().drawPileCards.slice(1)


      const drawPile = this.drawPileObject
      const pilePosition = {
        x: drawPile.position.x,
        z: drawPile.position.z,
      }
      // Vytvoření nové karty na horní straně balíčku, která se bude posouvat k hráči
      const newCard = Cards.createCard(1, elementsEnum.CARD, card.picture,
        {playerId: player.id, cardId: card.id, label: card.picture.label, ...card.params}
      )
      if (!player.main) newCard.hidePicture()
      newCard.position.y = Scene.tableConfig.height + drawPileCardsSize * 2 * Cards.config.depth // Výšková pozice karty
      newCard.position.x = pilePosition.x
      newCard.position.z = pilePosition.z
      this.scene.add(newCard)

      // Virtualizace odebrání karty z balíču
      // game().drawPileCards--
      this.scene.remove(drawPile)
      this.createDrawPile(pilePosition.x, pilePosition.z)

      // Zvednutí karty z balíčku
      if (!await cardMoves.moveCardVertically(newCard)) return

      // Posunutí kart směrem k hráči na vstupní bod hráče
      if (!await cardMoves.moveCardTo(newCard, player.point, -Math.PI / 2 + player.angle)) return

      //Vložení karty do ruky
      await this.addCardToHand(newCard)
      newCard.params.selectable = true
    },
    //</editor-fold>

//<editor-fold desc="Výpočty">

    //</editor-fold>

//<editor-fold desc="Listenery">
    // Listenery
    addListeners() {
      // Přidání listeneru pro resize
      window.addEventListener("resize", this.handleChangeWindowSize.bind(this))
      this.$refs.gameContainer.addEventListener("click", this.onMouseClick)
      this.$refs.gameContainer.addEventListener("dblclick", this.onMouseDoubleClick)
    },

    removeListeners() {
      window.removeEventListener("resize", this.handleChangeWindowSize)
      this.$refs.gameContainer.removeEventListener("click", this.onMouseClick)
      this.$refs.gameContainer.removeEventListener("dblclick", this.onMouseDoubleClick)
    },
    //</editor-fold>

//<editor-fold desc="Prostředí">

    // Obnovení scény
    resetScene() {
      // Odebrání prvků
      const removedTypes = [
        elementsEnum.CARD,
        elementsEnum.DROW_PILE,
        elementsEnum.DISCARD_PILE,
        elementsEnum.TABLE
      ]
      const scene = this.scene
      const removedElements = scene.children.filter(a => removedTypes.includes(a.name))
      removedElements.forEach(a => {
        scene.remove(a)
      })
      const table = Scene.createTable(this.tableEdges, this.materials.table)
      if (table) this.scene.add(table)
    },

    resetGame() {
      this.resetScene()
      game().userActionDisabled = false
      this.loading = false
      this.timeouts.forEach(clearTimeout);
      this.fetchPromises.forEach(p => {
        console.log(p)
        console.log(p && p.cancel)
        if (p.cancel) p.cancel()
      })

    },

    // Inicializace herního světa
    initWebGL() {

      // Načtení materiálů pro scénu
      this.materials.table = Scene.createTableMaterial()

      // Parametry kontejneru a renderer
      const container = this.$refs.gameContainer
      const width = container.clientWidth
      const height = container.clientHeight
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(width, height)
      container.appendChild(renderer.domElement)

      // Přidání kamery
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000)
      camera.lookAt(0, Scene.tableConfig.height + Cards.config.height * 3, 0)

      // Přidání možnosti hýbat kamerou
      const controls = Controls.add(camera, renderer)

      // Vytvoření scény
      const scene = Scene.create()

      // Přidání stolu
      const table = Scene.createTable(this.tableEdges, this.materials.table)
      if (table) scene.add(table)


      // Animační smyčka
      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }


      // Uložení do proměnných komponenty
      this.scene = scene
      this.renderer = renderer
      this.camera = camera
      this.gameContainerWidth = width
      this.gameContainerHeight = height

      this.changeCameraView(this.cameraView.PLAYER)

      animate()

    },

    changeCameraView(newView) {
      if (!newView) newView = game().cameraView
      const camera = this.camera
      const cameraView = this.cameraView
      const playerPoint = game().players.find(p => p.main)?.point || {x: 0, z: Scene.tableConfig.radius}
      switch (newView) {
        case null:
        case cameraView.PLAYER:
          camera.position.set(
            0,
            Scene.tableConfig.height * 2 + Cards.config.height * 2,
            playerPoint.z * 1.4 + Cards.config.height * 2,
          );
          break;
        case cameraView.TABLE:
          camera.position.set(0, playerPoint.z * 2.5, 0);
          break;
      }
      game().cameraView = newView
    },

    setTableEdges() {
      this.tableEdges = this.players < 4 ? Math.max(this.players * 2, 4) : this.players
    },

    handleChangePlayers() {
      this.setTableEdges()
      this.resetScene()
    },


    handleChangeWindowSize() {
      // Načtení aktuálních rozměrů
      const container = this.$refs.gameContainer
      const width = container.clientWidth
      const height = container.clientHeight

      this.fitGameContainerToSize(width, height)
    },

    // Klinutí myši - určení objektu, na který se kliklo
    onMouseClick(event) {
      event.stopPropagation()

      if (game().userActionDisabled) {
        console.log('zákaz klikání')
        return
      }
      const gameContainer = this.$refs.gameContainer
      const rect = gameContainer.getBoundingClientRect()

      // Přepočet pozice myši na normalizované hodnoty v rozsahu [-1, 1] vzhledem k hernímu kontejneru
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Nastavení raycasteru pomocí pozice myši
      raycaster.setFromCamera(mouse, this.camera);

      // Výpočet objektů, které byly proraženy raycasterem
      const intersects = raycaster.intersectObjects(this.scene.children);

      // Kliknutí na na objekt, které má vyvolat nějakou akci
      switch (intersects[0].object?.parent?.name) {
        case elementsEnum.CARD:
          this.handleMouseClickOnCard(intersects[0].object.parent)
          return
        case elementsEnum.DROW_PILE:
          this.handleMouseClickOnDrawPile(intersects[0].object.parent)
          return
      }

      // Zrušit předchozí výběr
      if (this.playerSelectObject) this.clearPlayerSelect()
    },

    onMouseDoubleClick(event) {
      event.preventDefault()
    },

    // Rakce na zobrazení/skrytí menu
    handleSwitchMenu() {
      const windowWidth = window.innerWidth
      // Pokud je aktuální šířka menší než hranice pro zobrazení menu, tak návrat
      if (windowWidth < appSetting().minimumViewPort) return

      // Pokud je menu skrýváno, tak rozšíříme ihne,
      if (!appSetting().showMenu)
        this.fitGameContainerToSize(this.gameContainerWidth + appSetting().menuWidth)
      // v opačním případě dáme timeout, aby nebyl vidět bílý pruh na pravé straně obrazovky během skrývání
      else {
        setTimeout(() => {
          this.fitGameContainerToSize(this.gameContainerWidth - appSetting().menuWidth)
        }, 200)
      }
    },

    // Nastavení specifické velikosti herního kontejneru
    fitGameContainerToSize(width, height) {
      if (height === null || height === undefined) height = this.gameContainerHeight
      if (width === null || width === undefined) width = this.gameContainerWidth

      // Změna velikosti pohledu
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height)

      // Uložení do proměnných komponenty
      this.gameContainerWidth = width
      this.gameContainerHeight = height
    },


    // TODO doplnit potřebné
    // Vyčištení
    clearAll() {
      this.resetScene()
      this.scene = null
      this.renderer = null
      this.camera = null
      this.gameContainerWidth = null
      this.gameContainerHeight = null
    }
    //</editor-fold>
  },

  mounted() {
    this.setTableEdges()
    this.initWebGL()
    this.addListeners()
  },

  beforeUnmount() {
    this.removeListeners()
    this.clearAll()
  },

  watch: {
    showMenu() {
      this.handleSwitchMenu()
    },
    players() {
      this.handleChangePlayers()
    },
    isGameActive() {
      if (this.isGameActive) this.startGame()
      else {
        this.resetGame()
      }
    },
  }
})

</script>

<style scoped>
.game-page {
  border: 4px solid red;
  overflow: hidden;
  position: relative;
}

.game-container {
  width: 100%;
  height: 100vh;
}

.game-toolbar {
  border: 3px solid blue;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Poloprůhledné černé pozadí */
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-text {
  color: white;
  font-size: 20px;
}

</style>
