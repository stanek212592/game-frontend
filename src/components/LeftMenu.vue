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
                 @click="gameIsActive = true"/>
          <template v-else>
            <!--            <q-btn style="margin: auto;" color="secondary" :label="$t('hra_stop')"-->
            <!--                   @click="gameIsActive = false"/>-->
            <!--            <div style="height: 5px;"/>-->
            <q-btn style="margin: auto;" color="secondary" :label="$t('hra_stop')"
                   @click="gameIsActive = false"/>
          </template>
        </div>
      </template>
      {{ game }}


      <!--            <template v-if="selected">-->
      <!--              <div v-for="(item, n) in params" :key="n">-->
      <!--                <div v-if="item.type === itemTypesEnum.TOGGLE" class="fp-column"-->
      <!--                     style="padding-left: 10px; padding-right: 10px;">-->
      <!--                  <div class="width-100" style="text-align: center;">{{ item.label }}</div>-->
      <!--                  <q-btn-toggle push glossy toggle-color="primary" :options="item.options" spread-->
      <!--                                v-model="item.value" @update:model-value="val=>handleToggle(val, item)"/>-->
      <!--                </div>-->
      <!--                <div v-if="item.type === itemTypesEnum.BUTTON" class="width-100 fp-row" style="padding-top: 10px;">-->
      <!--                  <q-btn style="margin: auto;" color="secondary" :label="item.label"-->
      <!--                         @click="store[item.store][item.name] = item.click"-->
      <!--                  />-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </template>-->
    </div>
  </q-list>
</template>


<script>


import {game} from "stores/game";
import {appSetting} from "stores/appSetting";

export default {
  name: "LeftMenu",

  data: () => ({
    playersOptions: [
      {label: '2', value: 2},
      {label: '3', value: 3},
      {label: '4', value: 4},
      {label: '5', value: 5},
      // {label: '6', value: 6},
    ],
    titleList: ['Hra'],
  }),

  computed: {
    players() {
      return game().players.length || 2
    },
    gameIsActive: {
      get() {
        return game().isGameActive
      },
      set(val) {
        game().isGameActive = val
      }
    },
    game() {
      return {
        players: game().players.length,
        drawPileCards: game().drawPileCards.map(a=>a.params.cardId),
        discardPileCards: game().discardPileCards
      }
    }
  },

  methods: {
    appSetting,
    handleClickTitle(val) {
      this.$router.push({path: '/game'})
      appSetting().menuSelectedItem = val
    },
    handleChangePlayers(val) {
      game().setPlayers(val)
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
