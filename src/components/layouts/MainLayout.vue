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
          {{ appSetting.showMenu}}
          <q-badge transparent align="middle" color="orange">v{{ version }}</q-badge>
        </q-toolbar-title>
        {{ userDetails.firstname }} {{ userDetails.surname }}
        <div style="width: 10px; "/>
        <q-btn v-if="!userDetails?.loggedIn" style="margin: 3px;" color="secondary" label="Registrovat"/>
        <q-btn v-if="!userDetails?.loggedIn" style="margin: 3px;" color="secondary" :label="$t('prihlasit')"
               @click="showLoginDialog = true"/>
        <q-btn v-else style="margin: 3px;" color="secondary" :label="$t('odhlasit')"
               @click="logOut()"/>
<!--        <div style="width: 25px;"/>-->

<!--        <div style="margin: 5px; font-size: 7pt; position: absolute; top: 0; right: 0">v{{ version }}</div>-->
      </q-toolbar>
    </q-header>

    <q-drawer v-if=userDetails.loggedIn v-model="appSetting.showMenu" show-if-above bordered
              :width="Number(appSetting.menuWidth)" :breakpoint="breakpoint">
      <q-list>
        <ItemOfMainMenu v-for="item in items" :key="item.title" v-bind="item"/>
      </q-list>
    </q-drawer>
    <login-dialog v-model="showLoginDialog"/>
    <q-page-container style="min-height: 100vh;">
      <router-view style="height: calc(100vh - 50px)"/>
    </q-page-container>
  </q-layout>

</template>

<script>
import {defineComponent, ref} from 'vue'
import ItemOfMainMenu from 'components/layouts/ItemOfMainMenu.vue'
import {user} from "stores/user";
import LoginDialog from "components/LoginDialog.vue";
import {appSetting} from "stores/appSetting";
import LockApp from "components/LockApp.vue";
import {items} from "components/layouts/menuItems";
import {game} from "stores/game";


export default defineComponent({
  name: 'MainLayout',

  components: {
    LoginDialog,
    ItemOfMainMenu,
    LockApp
  },

  data() {
    return {
      showLoginDialog: false,
      items,
      // showMenu: false
    }
  },

  computed: {
    version() {
      //TODO doplnit načítání verze
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
    }
  },

  methods: {
    game,
    toggleLeftDrawer() {
      appSetting().showMenu = !appSetting().showMenu
      // this.showMenu = !this.showMenu
    },
    logOut() {
      user().setJwt()
      this.$router.push({path: '/'})
    },

  }
})
</script>
