<template>
  <q-list>
    <div class="fp-column item">
      <q-item clickable tag="a" target="_blank" @click="handleClickTitle(titleList[0])">
        <div style="width: 35px; max-width: 35px !important; padding: 5px;">
          <q-icon name="style" size="25px" style="rotate: 180deg;"/>
        </div>
        <q-item-section>
          <q-item-label>{{ titleList[0] }}</q-item-label>
          <q-item-label caption>nová hra</q-item-label>
        </q-item-section>
      </q-item>
      <template v-if="appSetting().menuSelectedItem === titleList[0]">
        <div class="fp-column" style="padding-left: 10px; padding-right: 10px;">
          <div class="width-100" style="text-align: center;">Hráčů</div>
          <q-btn-toggle push glossy toggle-color="primary" :options="playersOptions" spread
                        :disable="gameIsActive"
                        :model-value="players" @update:model-value="handleChangePlayers"/>
        </div>
        <div class="width-100 fp-column" style="padding-top: 10px;">
          <q-btn v-if="!gameIsActive" style="margin: auto;" color="secondary" :label="$t('hra_nova')"
                 @click="startGame"/>
          <template v-else>
            <q-btn style="margin: auto;" color="secondary" size="sm" :label="$t('zmenit_nastaveni')"
                   @click="stopGame"/>
            <div style="height: 5px;"/>
            <q-btn style="margin: auto;" color="orange" :label="$t('hra_restart')"
                   @click="restartGame"/>
          </template>
        </div>
      </template>
    </div>
    <q-item class="fp-column">
      <div class="width-100" style="margin-left: 5px; font-weight: bold;">
        Poslední karta:
      </div>
      <q-img
        :style="`border: solid 2px black; border-radius: ${lastCardOnDiscard.width / 10}px;
             width: ${lastCardOnDiscard.width}px; height: ${lastCardOnDiscard.height}px`"
        :src="lastCardOnDiscard.image"
        :title="lastCardOnDiscard.title"/>
    </q-item>
    <q-item class="fp-column">
      <span>Z balíčku vzít: {{ game.cardsToDraw }}</span>
      <span>Lze vyhodit: {{ game.rules?.permittedCardIdsOnDiscardPile.length ? 'ANO' : 'NE' }}</span>
      <span>( {{ game.rules?.permittedCardIdsOnDiscardPile.length }} )</span>
      <span>active: {{ game.active }} </span>

    </q-item>

  </q-list>
</template>


<script>


import {game} from "stores/game";
import {appSetting} from "stores/appSetting";
import appConfig from "app/appConfig";
import {user} from "stores/user";
import gameStatesEnum from "components/game/gameStatesEnum";

export default {
  name: "LeftMenu",

  data: () => ({
    playersOptions: [
      {label: '2', value: 2},
      {label: '3', value: 3},
      {label: '4', value: 4},
      {label: '5', value: 5},
    ],
    titleList: ['Hra'],
  }),

  computed: {
    players() {
      return game().players.length || 2
    },
    gameIsActive(){
        return game().state !== gameStatesEnum.NO_GAME
    },
    game() {
      return {
        rules: game()?.rules,
        active: game()?.activePlayerId,
        drawPileCards: game()?.drawPileCardsIds,
        discardPileCards: game()?.discardPileCardsIds,
        cardsToDraw: game()?.rules?.numberOfCardsToDraw,
      }
    },
    lastCardOnDiscard() {
      const discardPileCards = game().discardPileCardsIds
      const lastCardId = discardPileCards[discardPileCards.length - 1]
      const x = game()?.gameCards?.find(c => c.params.cardId === lastCardId)
      const baseWidth = process.env.leftMenuWidth - 40
      const baseHeight = baseWidth / appConfig.card.width * appConfig.card.height
      const obj = {
        // image: null,
        title: 'Není odhozena karta',
        width: baseWidth + 4,
        height: baseHeight + 4,
      }
      if (!x) return obj
      const img = x.params?.face
      obj.image = img ? 'data:image/jpeg;base64,' + img : null
      obj.title = 'Poslední karta odhazovacího balíčku'
      return obj
    }
  },

  methods: {
    appSetting,
    handleClickTitle(val) {
      this.$router.push({path: '/game'})
      appSetting().menuSelectedItem = val
    },
    handleChangePlayers(val) {
      const playerArray = []
      playerArray.push(
        {userId: user().id, cardInHandIds: [], virtual: false,}
      )
      for (let i = 1; i < val; i++)
        playerArray.push(
          {userId: i, cardInHandIds: [], virtual: true,}
        )

      game().setPlayers(playerArray)
    },
    startGame(){
      this.handleChangePlayers(this.players)
      game().setGameState(gameStatesEnum.START_GAME)
    },
    stopGame(){
      game().setGameState(gameStatesEnum.NO_GAME)
    },
    restartGame() {
      this.stopGame()
      this.$nextTick(() => this.startGame())
    }
  },

}
</script>

<style scoped>
.item {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: solid 1px rgba(128, 128, 128, 0.4)
}
</style>
