<template>
  <div class="height-100 width-100 fp-column game-page" ref="gamePage">
    <div v-if="loading" class="overlay">
      <span class="overlay-text">Načítání hry</span>
    </div>
    <div id="gameContainer" ref="gameContainer" class="game-container"/>
    <div v-if="showStausBar" class="game-statusbar non-selectable">
      hráčů: {{ players }},
      hráč: {{ activePlayer?.name }},
      existuje tah: {{ hasMoreMoves }},
      poslední tah: {{ lastMove }},
    </div>
    <div class="fp-column" style="position: absolute; right: 3px;">
      <q-btn style="margin: 3px; z-index: 10;" icon="panorama" color="accent" title="Zobrazit pohled hráče"
             @click="changeCameraView(cameraView.PLAYER)"/>
      <q-btn style="margin: 3px; z-index: 10;" icon="visibility" color="accent" title="Náhled na herní stůl"
             @click="changeCameraView(cameraView.TABLE)"/>
    </div>
    <div v-if="!gameWarning && gameInfo" class="non-selectable width-100 page-info">
      {{ gameInfo }}
    </div>
    <div v-if="gameWarning" class="non-selectable width-100 page-warning">
      {{ gameWarning }}
    </div>
    <div v-if="computerStopBtn"
         :style="`position: absolute; left: ${gameContainerWidth / 2 - 50}px; top: ${gameContainerHeight / 3 - 50}px`">
      <q-btn icon="front_hand" color="red" title="Stát"
             style="width: 100px; height: 100px;" class="page-warning"
             @click="handleNotPlay()"/>
    </div>
    <div v-if="showStopBtn" :style="`position: absolute; left: ${gameContainerWidth / 2 - 50}px; bottom: 100px`">
      <q-btn icon="front_hand" color="accent" title="Stát"
             style="margin: 3px;" class="page-warning"
             @click="handleNotPlay()"/>
    </div>
    <div v-else-if="showSuits.length"
         :style="`position: absolute; left: ${gameContainerWidth / 2 - (showSuits.length * 27)}px; bottom: 30px`">
      <q-img v-for="(item, index) in showSuits" :key="index" :src="item.image"
             style="width: 50px; margin: 4px;"/>
    </div>
    <suit-select-dialog v-model="showSelectSuit" :items="itemsSelectSuits" @select="handleSuitSelect"/>
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
import SuitSelectDialog from "components/SuitSelectDialog.vue";
import MoveTypesEnum from "components/game/moveTypesEnum";
import {user} from "stores/user";
import gameStatesEnum from "components/game/gameStatesEnum";
import appConfig from "app/appConfig";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
export default defineComponent({
  name: "GamePage",
  components: {SuitSelectDialog},

  data: () => ({
    suits: [],
    itemsSelectSuits: [],
    showSelectSuit: false,
    computerStopBtn: false,


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
    playerSelectObject: null,

    // Pomocné proměnné pro možnost zrušení probíhající hry
    timeouts: [],
    axiosCancelTokenStoreName: 'game',
    // fetchPromises: [],
  }),

  computed: {
    loading() {
      return game().state === gameStatesEnum.LOADING
    },
    showMenu() {
      return appSetting().showMenu
    },
    showStausBar() {
      return process.env.DEV
    },
    players() {
      return game().players.length
    },
    activePlayer() {
      return game().players.find(p => p.id === game().activePlayerId)
    },
    gameWarning() {
      return game().warning
    },
    gameInfo() {
      return game().info
    },
    hasMoreMoves() {
      if (!game().activePlayerId) return true
      if (game().lastPlayerMove === MoveTypesEnum.PLAYER_TO_DISCARD) return false
      if (game().lastPlayerMove === MoveTypesEnum.NOT_PLAY) return false
      if (game().lastPlayerMove === MoveTypesEnum.DRAW_TO_PLAYER
        && game().rules?.numberOfCardsToDraw === 0) return false
      return true
    },
    lastMove() {
      return game().lastPlayerMove
    },
    showStopBtn() {
      const discardPileCards = game().discardPileCardsIds
      const lastCardId = discardPileCards[discardPileCards.length - 1]
      const params = game()?.gameCards?.find(c => c.params.cardId === lastCardId)?.params
      const stopCardIsLastOnDiscard = params?.power === 'GET' && params?.powerValue === 0
      const canDraw = game().rules?.numberOfCardsToDraw > 0
      const playerTurn = gameStatesEnum.PLAYER_TURN === game().state
      return playerTurn && stopCardIsLastOnDiscard && !canDraw
    },
    showSuits() {
      if (!game().gameCards?.length) return []
      if (!game().discardPileCardsIds?.length) return []
      const discard = game().discardPileCardsIds
      const cardId = discard[discard.length - 1]
      const card = game().gameCards.find(c => c.params.cardId === cardId)
      if (card.params?.power !== 'SELECT_SUIT') return []
      if (!game().rules?.suit) return this.suits
      return this.suits.filter(s => s.name === game().rules.suit)
    },
    mainPlayer() {
      const player = game().players.find(p => p.id === user().id)
      return player ? player : {}
    },
    isGameActive() {
      return game().state !== gameStatesEnum.NO_GAME
    }
  },

  methods: {
    // Spuštění hry
    async startGame() {

      const data = game().settings

      // Resetování hry
      this.resetGame()

      game().setGameState(gameStatesEnum.LOADING)

      // Vytvoření materiálů pro karty a vytvoření karet
      this.materials.cardFrame.primary = Cards.createColoredMaterial('#000000')
      this.materials.cardFrame.secondary = Cards.createColoredMaterial('#fb8d3c')
      this.materials.cardBack = Cards.createFromUrlMaterial(imagesEnum.CARD_BACK.path)

      // Načtení karet pro hru a výchozích parametrů hry
      game().gameCards = await this.getDrawCardPileFromServer(data.cardGroupId)
      const newGameState = await this.getNewGameFromServer(data)
      if (!newGameState) {
        this.resetGame()
        return
      }
      game().setPiles(newGameState)
      game().setPlayers(newGameState.players)
      game().setGameState(gameStatesEnum.DEAL_CARDS)

      // Přidání balíčku karet a rozdání karet
      this.createDrawPile()
      await this.dealCards(newGameState.movesList)

      game().setFromState(newGameState)
      game().setActivePlayerById(newGameState.nextPLayerId)
    },

    // Provedení série tahů z backendu - typycky rozdávání karet
    async dealCards(movesList) {
      const promises = movesList.map((move, index) => {
        return new Promise(resolve => {
          const timeout = setTimeout(async () => {
            await this.executeMove(move);
            resolve();
          }, index * 500); // Spustit každých 500 ms
          this.timeouts.push(timeout);
        });
      });
      await Promise.all(promises);
    },

    // Vykonání jednotlivého tahu
    async executeMove(move, card) {
      switch (move.type) {
        case moveTypesEnum.DRAW_TO_DISCARD: // Vyložen výchozí karty
          card = await this.getDrawPileCard(null, true)
          const result = await this.moveToDiscardPile(card)
          if (!result) game().setGameState(gameStatesEnum.ERROR)
          return
        case moveTypesEnum.DRAW_TO_PLAYER: // Braní karet z balíčku
          const rules = game().rules
          // Kartu lze vzít pokud nejsou určeny nějaká omezují pravidla - situce při rozdávání
          if (!rules) {
            await this.getDrawPileCard(this.getPlayer(move.to))
            return
          }
          // Pokud jsou pravidla:
          if (rules.numberOfCardsToDraw === 0) {
            game().setWarning('Nepovolený tah')
            return
          } else {
            rules.numberOfCardsToDraw-- // snížíme počet karet, které lze ještě vzít
            rules.permittedCardIdsOnDiscardPile = [] // Pokud bereme kartu, tak již nebude možné na balíček odhazovat
            if (rules.numberOfCardsToDraw === 0)
              game().setGameState(
                this.activePlayer === this.mainPlayer ? gameStatesEnum.PLAYER_TURN_PROCESSING : gameStatesEnum.COMPUTER_TURN_PROCESSING,
                false
              )
            await this.getDrawPileCard(this.getPlayer(move.to)) // Přesuneme kartu z dobíracího balíčku hráči do ruky
            await this.shuffleIfNeeded()
            if (rules.numberOfCardsToDraw > 0) return
          }
          break
        case moveTypesEnum.PLAYER_TO_DISCARD: // Odhození karty - main hráč (řešit pravidla), ostatní => řeší se na backu, jen odhodit
          const player = this.getPlayer(move.from)
          // Tahy počítače
          if (this.mainPlayer !== player) {
            game().setGameState(gameStatesEnum.COMPUTER_TURN_PROCESSING, false)
            card = game().gameCards.find(c => c.params.cardId === move.cardId)
            if (move.newSuit) game().rules.suit = move.newSuit
            await this.moveToDiscardPile(card, player)
          }
          // Tahy hráče
          else {
            const permitted = game().rules?.permittedCardIdsOnDiscardPile || []
            // Pokud je karta mezi povolenými, tak se odhodí
            if (permitted.includes(card.params.cardId)) {
              game().setGameState(gameStatesEnum.PLAYER_TURN_PROCESSING)
              await this.moveToDiscardPile(card, player)
            } else {
              game().setWarning('Nepovolený tah')
              return
            }
          }
          break
        case moveTypesEnum.NOT_PLAY:
          if (this.activePlayer === this.mainPlayer) {
            game().setGameState(gameStatesEnum.PLAYER_TURN_PROCESSING)
          } else {
            this.computerStopBtn = true
            await this.sleep(2000)
            this.computerStopBtn = false
            game().setGameState(gameStatesEnum.COMPUTER_TURN_PROCESSING, false)
          }
          break
      }

      game().lastPlayerMove = move.type

      if (game().state === gameStatesEnum.COMPUTER_TURN_PROCESSING) {
        this.getNextPlayerActions()
      }
      if (game().state === gameStatesEnum.PLAYER_TURN_PROCESSING) {
        if (move.type === moveTypesEnum.PLAYER_TO_DISCARD && card?.params?.power === 'SELECT_SUIT')
          this.openSelectSuitDialog() // Pokud je  hráčem odhozena dáma, otevřít dialog pro změnu barvy
        else this.getNextPlayerActions()
      }
    },

    // Míchání karet
    async shuffleIfNeeded() {
      if (game().drawPileCardsIds.length === 0) {
        const cards = []

        const discard = game().discardPileCardsIds
        const lastCardId = discard[discard.length - 1]
        const shuffled = discard.slice(0, -1);
        for (const id of shuffled) {
          const card = game().gameCards.find(c => c.params.cardId === id)
          await cardMoves.moveCard(card, appConfig.card.height * 1.1)
          await cardMoves.moveCardVertically(card, undefined, Scene.tableConfig.height + 75 + cards.length)
          await cardMoves.rotateCardTo(card, Math.PI / 2, 0, 0)
          card.hidePicture(true)
          await cardMoves.moveCardVertically(card, undefined, Scene.tableConfig.height + 150 + cards.length)
          cards.push(card)
        }

        if (cards.length > 2)
          for (let i = 0; i < 50; i++) {
            const index = Math.floor(Math.random() * cards.length)
            const randCard = cards[index];
            await cardMoves.moveCard(randCard, 100, undefined, 15)
            await cardMoves.moveCardVertically(randCard, 15, Scene.tableConfig.height + 150 + cards.length + i)
            await cardMoves.moveCard(randCard, 100, 2 * Math.PI, 15)
            for (let j = 0; j < cards.length; j++){
              const randCard = cards[j];
              await cardMoves.moveCardVertically(randCard, 15, Scene.tableConfig.height + 150 + cards.length + j)
            }
          }

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i]
          await cardMoves.moveCardTo(card, appConfig.animate.drawPilePosition, undefined, 15)
          await cardMoves.moveCardVertically(card, 15, Scene.tableConfig.height + i * 0.5)
          game().drawPileCardsIds.push(card.params.cardId)
          this.scene.remove(card)
          this.scene.remove(this.drawPileObject)
          this.createDrawPile()
        }
        game().drawPileCardsIds = this.shuffleArray(shuffled)
        game().discardPileCardsIds = [lastCardId]
        const lastCard = game().gameCards.find(c => c.params.cardId === lastCardId)
        await cardMoves.moveCardVertically(lastCard, 15, Scene.tableConfig.height + appConfig.card.depth)

      }
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
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

    // Akce po kliknutí myší na kartu
    handleMouseClickOnCard(card) {
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

      // Pokud tuto kartu drží v ruce hráč tak odhodit
      const cardId = card.params.cardId
      if (player.cardInHandIds.includes(cardId))
        this.executeMove({type: moveTypesEnum.PLAYER_TO_DISCARD, from: player.id,}, card)

    },

    // Akce po kliknutí myší na dobírací balíček
    handleMouseClickOnDrawPile(object) {
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
      this.executeMove({type: moveTypesEnum.DRAW_TO_PLAYER, to: this.mainPlayer.id})
    },

    // Nalezení hráče dle ID
    getPlayer(id) {
      return game().players.find(p => p.id === id)
    },

    // Zrušení označení objektu, který uživatel dříve vybral (karta / balíček)
    clearPlayerSelect() {
      const object = this.playerSelectObject
      if (!object) return
      if (object.select) object.select(false)
      this.playerSelectObject = null
    },

    // Umístí kartu z hráčova vstupního bodu na pozici v ruce
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

          if (game().state === gameStatesEnum.NO_GAME) {
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
      if (!card) return false
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
        let result = await cardMoves.moveCardVertically(card)
        if (!notRepositioned) rearrangePlayersCard()
        if (result) result = await cardMoves.rotateCardBy(card, Math.PI / 2 + game().animate.cardAngleView);
        if (result) result = await cardMoves.moveCardTo(card, destination)
        const randZ = utils.round(Math.random() * 2 * Math.PI)
        if (result) result = await cardMoves.rotateCardTo(card, -Math.PI / 2, 0, randZ)
        if (result) result = await cardMoves.moveCardVertically(card, undefined, targetHeight)
        if (!result) {
          game().setGameState(gameStatesEnum.ERROR)
          resolve(false)
          return
        }
        card.params.selectable = true
        resolve(true)
      })
    },

    // Přensun karty z balíčku hráči do ruky
    async getDrawPileCard(player, onlyPickup) {
      const drawPileCardsSize = game().drawPileCardsIds.length
      if (!drawPileCardsSize) {
        game().setGameState(gameStatesEnum.ERROR)
        return false
      }

      // Vzít první kartu a odebrat ji z balíčku
      const cardId = game().drawPileCardsIds[0]
      const newCard = game().gameCards.find(c => c.params.cardId === cardId)
      game().drawPileCardsIds = game().drawPileCardsIds.slice(1)
      newCard.params.selectable = false

      // TODO přepnout - jen pro dev
      // newCard.hidePicture(!player?.main)
      newCard.hidePicture(false)


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
      if (!await cardMoves.moveCardVertically(newCard)) return false

      if (onlyPickup) {
        newCard.params.selectable = true
        return newCard
      }

      // Posunutí kart směrem k hráči na vstupní bod hráče
      if (!await cardMoves.moveCardTo(newCard, player.point, -Math.PI / 2 + player.angle)) return false

      // //Vložení karty do ruky
      await this.addCardToHand(newCard, player)
      newCard.params.selectable = true
    },

    showNextPlayerNameBeforeServerResponse() {
      let index = game().players.findIndex(p => p.id === game().activePlayerId) + 1
      const playersCount = game().players.length
      const newPlayer = game().players[index % playersCount]
      if (this.mainPlayer !== newPlayer)
        game().setInfo("Hraje " + newPlayer.name)
      return newPlayer.id
    },

    // Přidání Listenerů
    addListeners() {
      // Přidání listeneru pro resize
      window.addEventListener("resize", this.handleChangeWindowSize.bind(this))
      this.$refs.gameContainer.addEventListener("click", this.onMouseClick)
      this.$refs.gameContainer.addEventListener("dblclick", this.onMouseDoubleClick)
    },

    // Odebrání Listenerů
    removeListeners() {
      window.removeEventListener("resize", this.handleChangeWindowSize)
      this.$refs.gameContainer.removeEventListener("click", this.onMouseClick)
      this.$refs.gameContainer.removeEventListener("dblclick", this.onMouseDoubleClick)
    },

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

    // Zastavení probíhají hry a vymazání herních proměnných
    resetGame() {
      this.resetScene()
      game().reset()
      this.timeouts.forEach(clearTimeout);
      const store = appSetting().axiosRequests[this.axiosCancelTokenStoreName]
      if (store?.length)
        store.forEach(p => {
          if (p.cancel) p.cancel()
        })
      this.timeouts = []
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

    // Změna pohledu
    changeCameraView(newView) {
      if (!newView) newView = game().cameraView
      const camera = this.camera
      const cameraView = this.cameraView
      const playerPoint = this.mainPlayer.point || {x: 0, z: Scene.tableConfig.radius}
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

    // Akce pro změnu počtu hráčů
    handleChangePlayers() {
      this.resetScene()
    },

    // Akce pro změnu velikosti okna
    handleChangeWindowSize() {
      // Načtení aktuálních rozměrů
      const container = this.$refs.gameContainer
      const width = container.clientWidth
      const height = container.clientHeight

      this.fitGameContainerToSize(width, height)
    },

    // Akce pro výběr barvy
    handleSuitSelect(val) {
      game().rules.suit = val
      this.getNextPlayerActions()
    },

    // Akce na talčítko "stojím"
    handleNotPlay() {
      this.executeMove({type: MoveTypesEnum.NOT_PLAY})
    },

    // Otevřenní dialogu pro výběr barvy
    openSelectSuitDialog() {
      this.$get('prsi/suits', {groupId: game().settings.cardGroupId}).then(resp => {
        this.itemsSelectSuits = []
        resp.forEach(item => {
          if (!item.image.startsWith('data:image')) {
            item.image = 'data:' + item.imageType + ';base64,' + item.image
          }
        })
        this.itemsSelectSuits = resp
        this.showSelectSuit = true
      })
    },

    // Klinutí myši - určení objektu, na který se kliklo
    onMouseClick(event) {
      event.stopPropagation()

      if (
        game().state === gameStatesEnum.LOADING ||
        game().state === gameStatesEnum.DEAL_CARDS ||
        game().state === gameStatesEnum.WAITING_FOR_SERVER ||
        game().state === gameStatesEnum.PLAYER_TURN_PROCESSING
      ) {
        game().setWarning('Počkejte na dokončení akce')
        return
      }
      if (
        game().state === gameStatesEnum.COMPUTER_TURN ||
        game().state === gameStatesEnum.COMPUTER_TURN_PROCESSING
      ) {
        game().setWarning('Počkejte na tah protihráče')
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

    gameOver(move) {
      console.log('ukončit hru')
      console.log(move)
      game().activePlayerId = null
      game().setGameState(gameStatesEnum.GAME_OVER)
    },

    // Načtení všech karet, patříčných do příslušné skupiny karet, pro animace (včetně obrázků)
    async getDrawCardPileFromServer(cardGroupId) {

      this.$get('prsi/suits', {groupId: game().settings.cardGroupId}, false, this.axiosCancelTokenStoreName).then(resp => {
        if (resp) {
          resp.forEach(item => {
            if (!item.image.startsWith('data:image')) {
              item.image = 'data:' + item.imageType + ';base64,' + item.image
            }
          })
          this.suits = resp
        }
      })
      const gameCards = []
      // Načítání karet s možností zrušení požadavku

      const allCards = await this.$get('prsi/all_cards', {groupId: cardGroupId}, false, this.axiosCancelTokenStoreName)
      if (allCards === null) return
      allCards.forEach(c => {
        gameCards.push(
          Cards.createCardFromMaterials(
            1,
            elementsEnum.CARD,
            Cards.createTexturedMaterial(c.face),
            this.materials.cardBack,
            this.materials.cardFrame,
            {cardId: c.id, selectable: true, face: c.face, power: c.power, powerValue: c.powerValue},
          )
        )
        delete c.face
      })
      return gameCards
    },

    // Získání výchozích parametrů pro spuštění hry
    async getNewGameFromServer(data) {
      return await this.$post('prsi/start', data, false, this.axiosCancelTokenStoreName)
    },

    // Odeslání aktuálního stavu hry na server a příjem dalších tahů ze serveru
    async getNextPlayerActions() {
      // Kontrola, jeslti nedošel balíček

      if (game().state === gameStatesEnum.NO_GAME) return
      const data = {
        stateId: game().stateId,
        players: game().players.map(p => ({id: p.id, cardIds: p.cardInHandIds})),
        drawPile: game().drawPileCardsIds,
        discardPile: game().discardPileCardsIds,
        rules: game().rules,
        lastMove: game().lastPlayerMove,
        lastMoveBy: game().activePlayerId,
      }

      const nextPlayerId = this.showNextPlayerNameBeforeServerResponse()
      game().setGameState(gameStatesEnum.WAITING_FOR_SERVER)
      const nextState = await this.$post('prsi/next', data, false, this.axiosCancelTokenStoreName)
      game().activePlayerId = nextPlayerId
      game().setGameState(
        this.mainPlayer === this.activePlayer ? gameStatesEnum.PLAYER_TURN : gameStatesEnum.COMPUTER_TURN,
        this.mainPlayer === this.activePlayer
      )
      game().setFromState(nextState)

      for (const move of nextState.movesList) {
        if (move.type === MoveTypesEnum.GAME_OVER) {
          this.gameOver(move)
          return
        }
        await this.executeMove(move)
        await this.sleep(500)
      }
    },

    async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

  },

  mounted() {
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
      if (game().state === gameStatesEnum.START_GAME) this.startGame()
      if (game().state === gameStatesEnum.NO_GAME) this.resetGame()
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

.page-warning {
  position: absolute;
  text-align: center;
  font-size: 24pt;
  font-weight: bold;
  color: red;
}

.page-info {
  position: absolute;
  text-align: center;
  font-size: 24pt;
  font-weight: bold;
  color: gray;
}


</style>
