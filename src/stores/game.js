import {defineStore} from 'pinia';
import appConfig from "app/appConfig";

export const game = defineStore('game', {
  state: () => ({
    // Aktuální stav hry
    players: [],
    gameCards: [],
    drawPileCardsIds: [],
    discardPileCardsIds: [],
    pilesRules: null,
    isGameActive: false,
    activePlayerId: null,
    userActionDisabled: false,
    waitingForServer: false,
    warning: '',


    // Parametry ovlivňující hru
    cameraView: null,
    speed: appConfig.animate.speed,
    animate: appConfig.animate,

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    setPlayers(count = 2) {
      const list = []
      for (let i = 0; i < count; i++)
        list.push(
          {id: null, name: '', cardInHandIds: [], main: false, angle: null, point: {x: 0, z: 0}, avatar: null,},
        )
      this.players = list
    },
    resetPlayers() {
      this.setPlayers(2)
    },
    setWarning(text, time = 2000) {
      this.warning = text
      if (time != null)
        setTimeout(() => {
          this.warning = ''
        }, time)
    }
  },
});
