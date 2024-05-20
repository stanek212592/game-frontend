import {defineStore} from 'pinia';
import appConfig from "app/appConfig";
import utils from "components/game/utils";
import Scene from "components/game/scene";
import gameStatesEnum from "components/game/gameStatesEnum";
import {user} from "stores/user";

export const game = defineStore('game', {
  state: () => ({
    // Aktuální stav hry
    stateId: null,
    state: gameStatesEnum.NO_GAME,

    players: [],
    gameCards: [],
    drawPileCardsIds: [],
    discardPileCardsIds: [],
    rules: null,

    activePlayerId: null,

    warning: '',
    info: '',
    lastPlayerMove: null,
    selectedSuit: null,


    // Parametry ovlivňující hru
    cameraView: null,
    speed: appConfig.animate.speed,
    animate: appConfig.animate,

    // Nastevní hry
    settings: {
      settingsId: 1,
      userIds: [],
      cardGroupId: 1
    },

    // Ke smazání
    userActionDisabled: false,
    waitingForServer: false,
    isGameActive: false,

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    setPlayers(players = 2) {
      const list = []
      if (typeof players === 'number') // změna číslem je pro vizualizaci stolu
        for (let i = 0; i < players; i++)
          list.push(
            {id: null, name: '', cardInHandIds: [], main: false, angle: null, point: {x: 0, z: 0}, avatar: null,},
          )
      else {
        // Nastavení hráčů
        const countOfPlayers = players.length
        const angle = 2 * Math.PI / countOfPlayers
        players.forEach((p, i) => {
          const newPlayer = {
            id: p.userId,
            main: i === 0, // Hlavní hráč bude mít vždy index 0, řešeno na backu
            avatar: p.avatar,
            name: playerName(p),
            cardInHandIds: p.cardIds,
            virtual: p.virtual,
            angle: angle * i + Math.PI / 2,
            point: utils.vector(
              angle * i + Math.PI / 2,
              Scene.tableConfig.radius * (countOfPlayers === 2 || countOfPlayers === 4 ? 0.75 : (countOfPlayers === 5 ? 0.85 : 0.9))
            ),
          }
          list.push(newPlayer)
          this.settings.userIds = list.map(a => a.id)
        })
      }
      this.players = list
    },
    setWarning(text, time = 2000) {
      this.warning = text
      if (time != null)
        setTimeout(() => {
          this.warning = ''
        }, time)
    },
    setFromState(state) {
      this.stateId = state.stateId
      this.rules = state.rules
      this.lastPlayerMove = null
    },
    setActivePlayerById(playerId) {
      this.activePlayerId = playerId
      if (playerId === user().id) {
        this.setInfo(null)
        this.setGameState(gameStatesEnum.PLAYER_TURN)
      } else {
        this.setGameState(gameStatesEnum.COMPUTER_TURN)
        const player = this.players.find(p => p.id === playerId)
        console.log(player)
        console.log(playerId)
        this.setInfo("Hraje " + player.name)
      }
    },

    setInfo(text) {
      this.info = text ? text : ''
    },
    reset() {
      this.id = null
      this.userActionDisabled = false
      this.rules = null
      this.waitingForServer = false
      this.activePlayerId = null
      // this.players = []
      this.gameCards = []
      this.drawPileCardsIds = []
      this.discardPileCardsIds = []
      this.warning = ''
      this.lastPlayerMove = null
      this.selectedSuit = null
      this.state = gameStatesEnum.NO_GAME
    },
    setGameState(val, resetInfo = true) {
      this.state = val
      switch (val) {
        case gameStatesEnum.WAITING_FOR_SERVER:
          // this.setInfo("Pracuji")
          break
        case gameStatesEnum.DEAL_CARDS:
          this.setInfo("Rozdávám karty")
          break
        default:
          if (resetInfo) this.setInfo(null)
      }
    },
    setPiles(data) {
      this.drawPileCardsIds = data.drawPile
      this.discardPileCardsIds = data.discardPile
    }
  },
});

// Metoda pro určení celého jména hráče
const playerName = (user) => {
  const name = user.firstname + `${user.firstname && user.surname ? ' ' : ''}` + user.surname
  return name ? name + ` (${user.login})` : user.login
}
