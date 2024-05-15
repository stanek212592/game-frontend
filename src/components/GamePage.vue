<template>
  <div class="height-100 width-100 fp-column game-page" ref="gamePage">
    <div v-if="loading" class="overlay">
      <span class="overlay-text">Načítání hry</span>
    </div>
    <div id="gameContainer" ref="gameContainer" class="game-container"/>
    <div v-if="showStausBar" class="game-statusbar non-selectable">
      hra: {{ isGameActive }}, hráčů: {{ players }}, W: {{ gameContainerWidth }} H: {{ gameContainerHeight }},
      ativní hráč: {{ activePlayer?.name }}, zakázané akce hráče: {{ actionIsDisabled }}
    </div>
    <div class="fp-column" style="position: absolute; right: 3px;">
      <q-btn style="margin: 3px;" icon="visibility" color="accent" title="Zobrazit pohled hráče"
             @click="changeCameraView(cameraView.PLAYER)"/>
      <q-btn style="margin: 3px;" icon="panorama" color="accent" title="Náhled na herní stůl"
             @click="changeCameraView(cameraView.TABLE)"/>
    </div>
    <div v-if="gameWarning" class="non-selectable width-100 page-warning">
      {{ gameWarning }}
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
import elementsEnum from "components/game/elementsEnum";
import imagesEnum from "src/imagesEnum";
import cardMoves from "components/game/cardMoves";
import utils from "components/game/utils";
import moveTypesEnum from "components/game/moveTypesEnum";

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
    drawPileObject: null,

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
    playerSelectObject: null,

    // Pomocné proměnné pro možnost zrušení probíhající hry
    timeouts: [],
    fetchPromises: [],
  }),

  computed: {
    showMenu() {
      return appSetting().showMenu
    },
    showStausBar() {
      return process.env.DEV
    },
    players() {
      return game().players.length
    },
    isGameActive() {
      return game().isGameActive
    },
    activePlayer() {
      return game().players.find(p => p.id === game().activePlayerId)
    },
    actionIsDisabled() {
      return game().userActionDisabled
    },
    gameWarning(){
      return game().warning
    },

  },

  methods: {

    // Spuštění hry
    async startGame() {
      // Resetování hry
      this.resetGame()
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

      // Načtení karet pro hru a výchozích parametrů hry
      game().gameCards = await this.getDrawCardPileFromServer(data.cardGroupId)
      const startParams = await this.getStartParamsFromServer(data)

      game().drawPileCardsIds = startParams.drawPile

      // Metoda pro určení celého jména hráče
      const playerName = (user) => {
        const name = user.firstname + `${user.firstname && user.surname ? ' ' : ''}` + user.surname
        return name ? name + ` (${user.login})` : user.login
      }

      // Nastavení hráčů
      // Hlavní hráč bude mít vždy index 0, řešeno na backu
      const players = startParams.players
      const countOfPlayers = players.length
      const angle = 2 * Math.PI / countOfPlayers
      game().setPlayers(countOfPlayers)
      game().players.forEach((p, i) => {
        const player = players[i]
        p.id = player.userId
        p.main = i === 0
        p.avatar = player.avatar
        p.name = playerName(player)
        p.cardInHandIds = player.cardIds
        p.virtual = player.virtual
        p.angle = angle * i + Math.PI / 2
        p.point = utils.vector(
          angle * i + Math.PI / 2,
          Scene.tableConfig.radius * (countOfPlayers === 2 || countOfPlayers === 4 ? 0.75 : (countOfPlayers === 5 ? 0.85 : 0.9))
        )
      })


      // this.changeCameraView()

      // Přidání balíčku karet
      this.createDrawPile(game().animate.drawPilePosition.x, game().animate.drawPilePosition.z)

      this.loading = false

      // Vykonání tahů dle backendu
      const executeMoves = async () => {
        const promises = startParams.movesList.map((move, index) => {
          return new Promise(resolve => {
            const timeout = setTimeout(async () => {
              await this.executeMove(move);
              resolve();
            }, index * 500); // Spustit každých 500 ms
            this.timeouts.push(timeout);
          });
        });
        await Promise.all(promises);
      };

      await executeMoves();
      game().userActionDisabled = false
    },

    async executeMove(move, card, disableUserActions) {
      if (disableUserActions) game().userActionDisabled = true
      switch (move.type) {

        // Vyložen výchozí barvy - voláno pouze backem
        case moveTypesEnum.DRAW_TO_DISCARD:
          card = await this.getDrawPileCard(null, true)
          await this.moveToDiscardPile(card)
          break

        // Braní karet z balíčku
        case moveTypesEnum.DRAW_TO_PLAYER:

          // Kartu lze vzít pouze pokud nejsou určeny linity pro balíčky nabo nám to limity dovolují
          const pilesRules = game().pilesRules

          // Kartu lze vzít pokud nejsou určeny nějaká omezují pravidla
          if (!pilesRules)
            await this.getDrawPileCard(this.getPlayer(move.to))

          // Pokud jsou pravidla:
          else {

            // Pokud je pravidlo, které určuje počet karet a je větší než nula, tak lze vzít kartu
            if (pilesRules.numberOfCardsToDraw > 0) {

              // snížíme počet karet, které lze ještě vzít
              pilesRules.numberOfCardsToDraw--

              // Pokud bereme kartu, tak již nebude možné na balíček odhazovat
              // Smažeme seznam povolených id, které lez dát na odhazovací balíček
              pilesRules.permittedCardIdsOnDiscardPile = []

              // Přesuneme kartu z dobíracího balíčku hráči do ruky
              await this.getDrawPileCard(this.getPlayer(move.to))

              // Pokud už nelze vzít karty z balíčku, tak tah konč a vrátíme další tah
              if (pilesRules.numberOfCardsToDraw === 0)
                return {type: moveTypesEnum.NEXT_PLAYER, to: game().players[1].id}
            }
          }
          break

        // Odhození karty - main hráč (řešit pravidla), ostatní => řeší se na backu, jen odhodit
        case moveTypesEnum.CARD_TO_DISCARD:
          console.log('vyhodit')
          const player = this.getPlayer(move.from)
          if (this.getMainPlayer() !== player) await this.moveToDiscardPile(card, player)
          else {
            const permitted = game().pilesRules ? game().pilesRules.permittedCardIdsOnDiscardPile : null
            if (permitted.includes(card.params.cardId)) console.log('lze odhodit')
            else {
              console.log('nelze odhodit')
              game().setWarning('Nepovolený tah')
            }


          }
          break
        // Toto slouží pro nastavení herních pravidel na konci tahu počítače
        // nebo na konci tahu hráče pro odeslání dat na server (čekání na další instrukce)
        case moveTypesEnum.NEXT_PLAYER:
          game().activePlayerId = move.to
          if (this.getMainPlayer()?.id === move.to) {
            if (move.pilesRules != null) game().pilesRules = move.pilesRules
          } else {
            console.log('hraje počítač, volat back')
            game().waitingForServer = true
            // volání backu
            // game().waitingForServer = false
          }
          break
      }
      if (disableUserActions) game().userActionDisabled = false
      return null
    },


    // Přidání balíčku karet
    createDrawPile() {
      const drawPileSize = game().drawPileCardsIds.length
      const drawPile = Cards.createCardFromMaterials(
        drawPileSize,
        elementsEnum.DROW_PILE,
        this.materials.cardFrame,
        this.materials.cardBack,
        this.materials.cardFrame,
        {selectable: true},
      )
      if (drawPile) {
        drawPile.position.y = Scene.tableConfig.height + (drawPileSize + 1) * Cards.config.depth
        drawPile.position.x = game().animate.drawPilePosition.x
        drawPile.position.z = game().animate.drawPilePosition.z
        this.scene.add(drawPile)
      }

      this.drawPileObject = drawPile
    },

    async handleMouseClickOnCard(card) {
      // Pokud main hráč není aktivní, tak návrat
      const player = game().players[0] // Hřáč u monitoru má vždy index 0
      if (player.id !== game().activePlayerId) return

      // Pokud nelze kartu vybrat
      if (!card?.params?.selectable) return


      // První kliknutí na kartu
      if (!this.playerSelectObject || (this.playerSelectObject && this.playerSelectObject !== card)) {
        this.clearPlayerSelect()
        card.select()
        this.playerSelectObject = card
        return
      }

      // Pokud klikneme podruhé na stejnou kartu, tak zřušit označení
      this.clearPlayerSelect()

      // Pokud tuto kartu drží v ruce hráč tak odhodit předat tah
      const cardId = card.params.cardId
      if (player.cardInHandIds.includes(cardId)) {
        await this.executeMove({type: moveTypesEnum.CARD_TO_DISCARD, from: player.id,}, card, true)
        // await this.executeMove({type: moveTypesEnum.NEXT_PLAYER, from: player.id, to: game().players[1].id}, null, true)
      }
    },

    async handleMouseClickOnDrawPile(object) {
      // Pokud main hráč není aktivní, tak návrat
      const player = game().players[0] // Hřáč u monitoru má vždy index 0
      if (player.id !== game().activePlayerId) return

      // Označení balíčku, pokud již není označený
      if (!this.playerSelectObject || (this.playerSelectObject !== object)) {
        this.clearPlayerSelect()
        object.select()
        this.playerSelectObject = object
        return
      }

      // Pro druhé kliknutí na balíček
      this.clearPlayerSelect()
      const newMove = await this.executeMove({
        type: moveTypesEnum.DRAW_TO_PLAYER,
        to: this.getMainPlayer()?.id
      })
      if (newMove)
        this.executeMove(newMove)

    },

    getPlayer(id) {
      return game().players.find(p => p.id === id)
    },
    getMainPlayer() {
      return game().players.find(p => p.main)
    },

    clearPlayerSelect() {
      const object = this.playerSelectObject
      if (!object) return
      if (object.select) object.select(false)
      this.playerSelectObject = null
    },

//<editor-fold desc="Metody pro pohyby karet">


    async addCardToHand(card, player, targetAngleX = game().animate.cardAngleView) {
      const steps = Math.abs(Math.ceil(targetAngleX / (game().animate.angleSize * game().speed)))
      let counter = 0
      let animationFrameId = null
      return new Promise((resolve) => {
        const animate = async () => {
          if (counter < steps) {
            card.rotateX(targetAngleX / steps)
            counter++
          } else {
            player.cardInHandIds.push(card.params.cardId)

            const maxCardsPerRow = game().animate.maxCardsPerRow
            let inlineCardCount = (player.cardInHandIds.length - 1) % maxCardsPerRow + 1
            let distanceCoef = Math.floor((player.cardInHandIds.length - 1) / maxCardsPerRow)

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


    // Přesunutí karty na odhazovací balíček
    async moveToDiscardPile(card, player) {
      card.params.selectable = false
      card.hidePicture(false)
      const cardId = card.params.cardId

      // Určení cílové polohy
      const targetHeight = Scene.tableConfig.height + game().discardPileCardsIds.length * Cards.config.depth * 4
      const destination = game().animate.discardPilePosition
      const originalPosition = {...card.position}


      // Vložení karty do odhazovacího balíčku
      game().discardPileCardsIds.push(cardId)

      // Odebrání karty ze seznamu hráčových karet, současně přesunutí karty z poslední pozice
      // na místo vyhozené pro jednodušší řazení karet
      let repositionedCard = null
      let notRepositioned = true
      if (player) {
        // ID karet, které má hráč v ruce
        const cardInHandIds = player.cardInHandIds
        // najít index karty, která se bude odebírat
        const discartdCardIndex = cardInHandIds.findIndex(id => id === cardId)
        // Pokud se nejedná o index posledního prvku, tak se na místo původní posune nová karta
        const lastIndex = cardInHandIds.length - 1
        if (discartdCardIndex !== lastIndex) {
          repositionedCard = game().gameCards.find(c => c.params.cardId === cardInHandIds[lastIndex])
          cardInHandIds.splice(discartdCardIndex, 1, repositionedCard.params.cardId);
          notRepositioned = false
        }
        cardInHandIds.pop()
      }


      const rearrangePlayersCard = async () => {
        await cardMoves.moveCardVertically(repositionedCard, undefined, originalPosition.y)
        await cardMoves.moveCardTo(repositionedCard, {x: originalPosition.x, z: originalPosition.z})
      }

      // Odhození karty
      return new Promise(async (resolve) => {
        await cardMoves.moveCardVertically(card)
        if (!notRepositioned) rearrangePlayersCard()
        await cardMoves.rotateCardBy(card, Math.PI / 2 + game().animate.cardAngleView);
        await cardMoves.moveCardTo(card, destination)

        const randZ = utils.round(Math.random() * 2 * Math.PI)
        await cardMoves.rotateCardTo(card, -Math.PI / 2, 0, randZ)

        await cardMoves.moveCardVertically(card, undefined, targetHeight)
        card.params.selectable = true
        resolve(true)
      })
    },

    // Přensun karty z balíčku hráči do ruky
    async getDrawPileCard(player, onlyPickup) {
      if (!game().isGameActive) return

      const drawPileCardsSize = game().drawPileCardsIds.length
      if (!drawPileCardsSize) return

      // Vzít první kartu a odebrat ji z balíčku
      const cardId = game().drawPileCardsIds[0]
      const newCard = game().gameCards.find(c => c.params.cardId === cardId)
      game().drawPileCardsIds = game().drawPileCardsIds.slice(1)
      newCard.params.selectable = false
      newCard.hidePicture(!player?.main)

      const drawPile = this.drawPileObject
      const pilePosition = {
        x: drawPile.position.x,
        z: drawPile.position.z,
      }

      newCard.position.y = Scene.tableConfig.height + drawPileCardsSize * 2 * Cards.config.depth // Výšková pozice karty
      newCard.position.x = pilePosition.x
      newCard.position.z = pilePosition.z
      this.scene.add(newCard)

      // Virtualizace odebrání karty z balíču
      this.scene.remove(drawPile)
      this.createDrawPile(pilePosition.x, pilePosition.z)

      // Zvednutí karty z balíčku
      if (!await cardMoves.moveCardVertically(newCard)) return

      if (onlyPickup) {
        newCard.params.selectable = true
        return newCard
      }

      // Posunutí kart směrem k hráči na vstupní bod hráče
      if (!await cardMoves.moveCardTo(newCard, player.point, -Math.PI / 2 + player.angle)) return

      // //Vložení karty do ruky
      await this.addCardToHand(newCard, player)
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
      const table = Scene.createTable(this.materials.table)
      if (table) this.scene.add(table)
    },

    resetGame() {
      this.resetScene()
      game().userActionDisabled = false
      game().pilesRules = null
      game().waitingForServer = false
      this.loading = false
      game().activePlayerId = null
      this.timeouts.forEach(clearTimeout);
      this.fetchPromises.forEach(p => {
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
      const renderer = new THREE.WebGLRenderer({antialias: true})
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
      const table = Scene.createTable(this.materials.table)
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
      const playerPoint = this.getMainPlayer()?.point || {x: 0, z: Scene.tableConfig.radius}
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
          camera.position.set(0, playerPoint.z * 1.3, 0);
          break;
      }
      game().cameraView = newView
    },

    handleChangePlayers() {
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
    },
    //</editor-fold>
    async getDrawCardPileFromServer(cardGroupId) {
      const gameCards = []
      // Načítání karet s možností zrušení požadavku
      let id = Date.now()
      const controls = {cancel: null, id: id}
      let fetchPromise = this.$get('prsi/all_cards', {groupId: cardGroupId}, false, controls)
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
            {cardId: c.id, selectable: true},
          )
        )
        delete c.face
      })
      return gameCards
    },
    async getStartParamsFromServer(data) {

      let id = Date.now()
      id = Date.now()
      const controls = {cancel: null, id: id}
      const fetchPromise = await this.$post('prsi', data, false, controls)
      this.fetchPromises.push(controls)
      const startParams = await fetchPromise
      this.fetchPromises = this.fetchPromises.filter(c => c.id !== id)
      return startParams
    }
  },

  mounted() {
    this.initWebGL()
    this.addListeners()
    game().setPlayers(2)
    game().isGameActive = false
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

.game-statusbar {
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

.page-warning{
  position: absolute;
  text-align: center;
  font-size: 24pt;
  font-weight: bold;
  color: red;
}


</style>
