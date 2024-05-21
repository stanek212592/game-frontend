<template>
  <q-dialog :model-value="modelValue" @update:modelValue="closeDialog"
            @before-show="clearDialog"
            @keyup.esc="closeDialog(false)"
            persistent
  >

    <q-card>
      <div v-if="avatar" class="close-button" style="position: absolute; top:82px; right: 22px; z-index: 20;"
           @click="resetFile"></div>
      <q-card-section>
        <span style="font-size: 14pt; font-weight: bold;">Registrace hráče:</span>
      </q-card-section>
      <q-card-section>
        <div class="fp-row">
          <div class="fp-column" style="width: 200px;">
            <div class="text-h6" :style="loginIsAllreadyRegistered ? 'color: red;' : ''">{{
                $t('uzivatelske_jmeno')
              }}
            </div>
            <div v-if="loginIsAllreadyRegistered"
                 style="margin-left: 10px; font-size: 10pt; margin-top: -10px; color: red;">
              (Login se již používá)
            </div>
            <q-input dense v-model="user.login" @blur="verifyLogin"
                     autofocus @keyup.enter="registerUser"/>
            <div class="text-h6">{{ $t('krestni_jmeno') }}</div>
            <q-input dense v-model="user.firstname"
                     autofocus @keyup.enter="registerUser"/>
            <div class="text-h6">{{ $t('prijmeni') }}</div>
            <q-input dense v-model="user.surname"
                     autofocus @keyup.enter="registerUser"/>
          </div>

          <div style="width: 180px; background-color: gray; border-radius: 10px; margin-left: 10px; text-align: center;"
               @click="openFileInput">
            <q-img v-if="avatar" :src="avatar" style="width: 180px; height: 180px; border-radius: 10px;"/>
            <div v-else style="margin-top: 100px;">Vyberte obrázek</div>
            <q-uploader ref="uploader" accept="image/*" :auto-upload="false"
                        @added="onFileAdded" style="display: none;"/>
            <div v-if="avatar" class="fp-row" style="width: 100%; align-content: center;">

              <q-space/>
              <q-btn flat :label="$t('zmenit')" @click="openFileInput"/>
              <q-space/>
            </div>
          </div>
        </div>
        <div class="text-h6" :style="differentPasswords ? 'color: red;' : ''">{{ $t('heslo') }}
          <span v-if="differentPasswords" style="margin-left: 10px; font-size: 10pt;">(Hesla se neshodují)</span></div>
        <q-input dense v-model="user.password"
                 autofocus :type="showPassword ? '' : 'password'" @keyup.enter="registerUser">
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              @click="showPassword = !showPassword"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <div class="text-h6" :style="differentPasswords ? 'color: red;' : ''">{{ $t('heslo_kontrola') }}
          <span v-if="differentPasswords" style="margin-left: 10px; font-size: 10pt;">(Hesla se neshodují)</span></div>
        <q-input dense v-model="user.password2"
                 :disable="!user.password"
                 autofocus :type="showPassword2 ? '' : 'password'" @keyup.enter="registerUser">
          <template v-slot:append>
            <q-icon
              :name="showPassword2 ? 'visibility' : 'visibility_off'"
              @click="showPassword2 = !showPassword2"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat color="secondary" :label="$t('zrusit')" @click="closeDialog(false)"/>
        <q-btn flat :label="$t('registrovat')" @click="registerUser"
               :disable="!user.login || !user.password || !user.password2"/>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>

import {user as userStore} from "stores/user";
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RegisterDialog",
  props: {
    modelValue: {type: Boolean, default: false,},
  },
  data: () => ({
    user: {
      login: null,
      firstname: null,
      surname: null,
      password: null,
      password2: null,
    },
    avatar: null,
    file: null,
    showPassword: false,
    showPassword2: false,
    loginIsAllreadyRegistered: false,
  }),

  computed: {
    differentPasswords() {
      if (!this.user.password || !this.user.password2) return false
      return this.user.password !== this.user.password2
    }
  },

  methods: {
    async verifyLogin() {
      this.loginIsAllreadyRegistered = false
      const resp = await this.$get('/user_auth/verify_login', {login: this.user.login})
      this.loginIsAllreadyRegistered = resp
      return !resp
    },
    closeDialog(val) {
      if (this.avatar) {
        URL.revokeObjectURL(this.avatar);
        this.avatar = null;
      }
      this.$emit('update:modelValue', val)
    },
    clearDialog() {
      this.user = {
        login: null,
        firstname: null,
        surname: null,
        password: null,
        password2: null,
        warning: null,
      }
      this.avatar = null
      this.file = null
      this.showPassword = false
    },
    openFileInput(event) {
      event.stopPropagation()
      this.$refs.uploader.reset()
      this.$nextTick(() => this.$refs.uploader.pickFiles())

    },
    resetFile(event) {
      event.stopPropagation();
      this.avatar = null
      this.user.avatar = null
      this.$refs.uploader.reset();
    },
    onFileAdded(files) {
      if (files.length > 0) {
        const file = files[0];

        // Zobrazení obrázku
        this.avatar = URL.createObjectURL(file);
        this.file = file
      }
    },

    async registerUser() {
      const user = this.user
      if (!user.login || !user.password || !user.password2) return

      const data = {
        user: {
          login: user.login,
          firstname: user.firstname,
          surname: user.surname,
          password: user.password,
        }
      }
      const loginNotExist = await this.verifyLogin()
      console.log(loginNotExist)
      if (loginNotExist)
        this.$upload('/user_auth', this.file, data, true).then(resp => {
          if (!resp) return
          userStore().setUser(resp)
          this.$router.push({path: '/game'})
          this.closeDialog()
        })
    }
  }
})

</script>


<style scoped>
/* styles.css */
.close-button {
  width: 28px;
  height: 28px;
  position: absolute;
  cursor: pointer;
}

.close-button::before,
.close-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 2px;
  background-color: black;
}

.close-button::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-button::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

</style>
