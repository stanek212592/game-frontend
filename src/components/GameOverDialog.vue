<template>
  <q-dialog v-model="valueComp" persistent>
    <q-card>
      <q-card-section>
        <span style="font-size: 14pt; font-weight: bold;">Vyhrál:</span>
      </q-card-section>
      <q-card-section>
<!--        <span style="font-size: 14pt; font-weight: bold;">Vítěz je:</span>-->
        <span style="font-size: 28pt; font-weight: bold; color: #0d47a1">{{ player?.name }}</span><br>
        <q-img v-if="player?.avatar"
               :src="player.avatar" style="margin-left: 10px; width: 350px; border-radius: 5px;"/>
        <!--        <span style="font-size: 14pt; font-weight: bold;">Vítěz je:</span>-->
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn style="margin: auto;" color="orange" :label="$t('zavrit')"
               @click="close"/>
        <q-btn style="margin: auto;" color="secondary" :label="$t('hra_restart')"
               @click="restartGame"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {game} from "stores/game";
import gameStatesEnum from "components/game/gameStatesEnum";

export default {
  name: "GameOverDialog",

  props: {
    modelValue: {type: Boolean, default: false,},
    playerId: {type: Number, default: null},
  },

  data: () => ({}),

  computed: {
    valueComp:{
      get(){
        return this.modelValue
      },
      set(val){
        this.$emit('update:modelValue', val)
      }
    },
    player(){
      if (!this.playerId) return {}
      return game().players.find(p=>p.id === this.playerId)
    }
  },

  methods: {
    startGame() {
      game().setGameState(gameStatesEnum.START_GAME)
    },
    stopGame() {
      game().setGameState(gameStatesEnum.NO_GAME)
    },
    restartGame() {
      this.stopGame()
      this.$nextTick(() => this.startGame())
      this.close()
    },
    close(){
      this.$emit('update:modelValue', false)
    }
  }
}
</script>


<style scoped>

</style>
