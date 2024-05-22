<template>
  <q-dialog :model-value="modelValue" @update:modelValue="closeDialog"
            @before-show="clearDialog"
            @keyup.esc="closeDialog(false)"
            persistent
  >
    <q-card style="min-width: 420px; overflow-y: hidden;" >
        <q-card-section v-if="avatars.length" style="max-height: 300px; overflow-y: auto;">
          <div v-for="(subArray, i) in avatarsComp" :key="'row_' + i" class="fp-row"
               style="height: 140px; margin:10px;">
            <div class="fp-column" v-for="item in subArray" :key="item.login" @click="handleClickAvatar(item)"
                 :style="`text-align: center; margin:10px; ${item.select ? 'border: 4px solid red;' : ''}`">
              <q-img :src="item.avatar" style="width: 100px; height: 100px; border-radius: 5px;"/>
              <span>{{ item.login }}</span>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h6">{{ $t('uzivatelske_jmeno') }}</div>
          <q-input dense v-model="user.login" @update:modelValue="user.warning = null"
                   autofocus @keyup.enter="loginUser"/>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ $t('heslo') }}</div>
          <q-input dense v-model="user.password" @update:modelValue="user.warning = null"
                   autofocus type="password" @keyup.enter="loginUser"/>
        </q-card-section>
        <div v-if="user.warning" style="position: absolute; width: 100%; text-align: center;  bottom: 50px;
                background-color: white; z-index: 100; color: #C10015">
          {{ user.warning }}
        </div>
      <!--            <hr>-->
      <q-card-actions align="right" class="text-primary">
        <q-btn v-if="!noStornoBtn" flat color="secondary" :label="$t('zrusit')" v-close-popup/>
        <q-btn flat :label="$t('prihlasit')" @click="loginUser"
               :disable="!user.login || !user.password || !!user.warning"/>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>

import {user as userStore} from "stores/user";
import {defineComponent} from 'vue'

export default defineComponent({
  name: "LoginDialog",
  props: {
    modelValue: {type: Boolean, default: false,},
    noStornoBtn: {type: Boolean, default: false,},
  },
  data: () => ({
    user: {
      login: null,
      password: null,
      warning: null,
    },
    avatars: []
  }),

  computed: {
    avatarsComp() {
      const length = this.avatars.length
      const array = []
      for (let i = 0; i < Math.ceil(length / 3); i++) {
        const subArray = []
        for (let j = 0; j < 3; j++) {
          if (i * 3 + j < length) subArray.push(this.avatars[i * 3 + j])
        }
        array.push(subArray)
      }
      return array;
    }
  },

  methods: {
    closeDialog(val) {
      this.avatars = []
      this.$emit('update:modelValue', val)
    },
    clearDialog() {
      this.$get('/user_auth/avatars').then(resp => {
        this.avatars = resp.map(a => ({
          avatar: !a.avatar ? null : a.avatar.startsWith('data') ? a.avatar : 'data:' + a.avatarImgType + ';base64,' + a.avatar,
          login: a.login,
          select: false,
        }))
      })
      this.user = {
        login: null,
        password: null,
        warning: null,
      }
    },
    handleClickAvatar(item) {
      if (item.select && this.user.password) {
        this.loginUser()
        return
      }
      this.avatars.forEach(a => a.select = false)
      item.select = true
      this.user.login = item.login
    },
    loginUser() {
      this.user.warning = null
      const user = this.user
      if (!user.login || !user.password) return
      const data = {
        login: user.login,
        password: user.password
      }
      this.$post('/user_auth/login', data, true)
        .then(resp => {
          if (!resp) return
          userStore().setUser(resp, resp.token)
          this.$router.push({path: '/game'})
          this.closeDialog()
        })
    }
  }
})

</script>


<style scoped>

</style>
