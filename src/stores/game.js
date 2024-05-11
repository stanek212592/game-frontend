import {defineStore} from 'pinia';
import Scene from "components/game/scene";
import appConfig from "app/appConfig";

export const game = defineStore('game', {
  state: () => ({
    // Dva hráče jsou výchozí stav
    players: [
      {id: null, name: '', cardInHand: [], main: false, angle: null, point: {x: 0, z: 0},},
      {id: null, name: '', cardInHand: [], main: false, angle: null, point: {x: 0, z: 0},},
    ],
    // drawPileCards: 0,
    drawPileCards: [{id: null, picture: null, params: {}}],
    discardPileCards: [],
    isGameActive: false,
    userActionDisabled: false,
    speed: appConfig.animate.speed,
    animate: appConfig.animate,
    //   {
    //   stepSize: 8,
    //   angleSize: Math.PI / 20,
    //   maxCardsPerRow: 13,
    //   cardOverlap: 1.3,
    //   cardAngleView: -Math.PI / 2 - 0.8
    //
    // },
    cameraView: null,
    initialSettings: Object.freeze({
      cardCount: 32,
      cardsPerPlayer: 5,
      drawPilePosition: {x: 100, z: 0},
      discardPilePosition: {x: -100, z: 0},
    })

  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    setPlayers(count = 2) {
      const list = []
      for (let i = 0; i < count; i++) list.push({id: null, name: '', cardInHand: [],})
      this.players = list
    },
  },
});
