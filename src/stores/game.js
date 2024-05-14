import {defineStore} from 'pinia';
import Scene from "components/game/scene";
import appConfig from "app/appConfig";

export const game = defineStore('game', {
  state: () => ({
    // Aktuální stav hry
    players: [],
    gameCards: [],
    drawPileCardsIds: [],
    discardPileCardsIds: [],
    discardPileParams: {},
    isGameActive: false,
    activePlayerId: null,
    userActionDisabled: false,


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
    }
  },
});
