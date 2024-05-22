<template>
  <q-layout view="hHh Lpr lff" style="min-height: 100%">
    <lock-app v-if="appLock"/>
    <!--        <q-layout view="lHh Lpr lFf">-->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round :disable="!userDetails.loggedIn"
               icon="menu" aria-label="Menu"
               @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          Prší
          <q-badge transparent align="middle" color="orange">v{{ version }}</q-badge>

          <span style="margin-left: 100px; font-size: 14px;">Stav hry: {{ game.state }}</span>

        </q-toolbar-title>
        <template v-if="isDev">
          <span>Server</span>
          <q-toggle v-model="appSetting.local" color="white"/>
          <span>Local</span>
          <div style="width: 100px;"/>
        </template>
        <span class="cursor-pointer" style="font-size: 18pt;" @click="editUser">{{
            userDetails.firstname
          }} {{ userDetails.surname }}</span>
        <q-img v-if="userDetails.avatar" class="cursor-pointer" @click="editUser"
               :src="userDetails.avatar" style="margin-left: 10px; height: 35px; max-width: 35px; border-radius: 5px;"/>

        <div style="width: 10px; "/>
        <q-btn v-if="!userDetails?.loggedIn" style="margin: 3px;" color="secondary" label="Registrovat"
               @click="openRegister"/>
        <q-btn v-if="!userDetails?.loggedIn" style="margin: 3px;" color="secondary" :label="$t('prihlasit')"
               @click="openLogin"/>
        <q-btn v-else style="margin: 3px;" color="secondary" :label="$t('odhlasit')"
               @click="logOut()"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-if=userDetails.loggedIn v-model="appSetting.showMenu" show-if-above bordered
              :width="Number(appSetting.menuWidth)" :breakpoint="breakpoint">

      <left-menu/>
    </q-drawer>
    <login-dialog v-model="showLoginDialog"/>
    <register-dialog v-model="showRegisterDialog"/>
    <register-dialog v-model="showEditDialog" :edit-user="showEditDialog"/>
    <q-page-container style="min-height: 100vh;">
      <router-view style="height: calc(100vh - 50px)"/>
    </q-page-container>
  </q-layout>

</template>

<script>
import {defineComponent} from 'vue'
import {user} from "stores/user";
import LoginDialog from "components/LoginDialog.vue";
import {appSetting} from "stores/appSetting";
import LockApp from "components/LockApp.vue";
import {game} from "stores/game";
import LeftMenu from "components/LeftMenu.vue";
import RegisterDialog from "components/RegisterDialog.vue";


export default defineComponent({
  name: 'MainLayout',

  components: {
    RegisterDialog,
    LeftMenu,
    LoginDialog,
    LockApp
  },

  data() {
    return {
      anyWasOpened: false,
      showLoginDialog: false,
      showRegisterDialog: false,
      showEditDialog: false,
    }
  },

  computed: {
    isDev() {
      return process.env.DEV
    },
    version() {
      return process.env.version
    },
    userDetails() {
      return {...user().$state, loggedIn: !!user().$state.login}
    },
    appLock() {
      return appSetting().$state.locked
    },
    breakpoint() {
      return process.env.minimumViewPort + 16
    },
    appSetting() {
      return appSetting()
    },
    game() {
      return game()
    }
  },

  methods: {
    toggleLeftDrawer() {
      appSetting().showMenu = !appSetting().showMenu
    },
    logOut() {
      user().setUser()
      this.$router.push({path: '/'})
    },
    editUser() {
      console.log('edit')
      this.anyWasOpened = true
      this.showEditDialog = true
    },
    openLogin(){
      this.anyWasOpened = true
      this.showLoginDialog = true
    },
    openRegister(){
      this.anyWasOpened = true
      this.showRegisterDialog = true
    }
  },
  mounted() {
    this.anyWasOpened = false
    setTimeout(() => {
      if (!this.userDetails.loggedIn && !this.showRegisterDialog && !this.anyWasOpened)
        this.showLoginDialog = true
    }, 5000)
  }
})
</script>
