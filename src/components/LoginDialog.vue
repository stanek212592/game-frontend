<template>
  <q-dialog :model-value="modelValue" @update:modelValue="closeDialog"
            @before-show="clearDialog"
            @keyup.esc="closeDialog(false)"
            persistent
  >
    <q-card style="min-width: 350px">

      <q-card-section>
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
        <q-btn flat color="secondary" :label="$t('zrusit')" v-close-popup/>
        <q-btn flat :label="$t('prihlasit')" @click="loginUser"
               :disable="!user.login || !user.password || !!user.warning"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import sha1 from 'crypto-js/sha1';
import {user as userStore} from "stores/user";
import {defineComponent} from 'vue'

export default defineComponent({
  name: "LoginDialog",
  props: {
    modelValue: {type: Boolean, default: false,}
  },
  data: () => ({
    user: {
      login: null,
      password: null,
      warning: null,
    },
  }),
  methods: {
    closeDialog(val) {
      this.$emit('update:modelValue', val)
    },
    clearDialog() {
      this.user = {
        login: null,
        password: null,
        warning: null,
      }
    },
    loginUser() {
      this.user.warning = null
      const user = this.user
      if (!user.login || !user.password) return
      const data = {
        login: user.login,
        password: user.password
      }
      this.$post('/user_auth', data, true)
        .then(resp => {
          if (!resp) return
          userStore().setJwt(resp)
          this.closeDialog()
        })
    }
  }
})

</script>


<style scoped>

</style>
