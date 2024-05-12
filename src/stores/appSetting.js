import {defineStore} from 'pinia';

export const appSetting = defineStore('appSetting', {
  state: () => ({
    locked: false,
    menuWidth: process.env.leftMenuWidth,
    minimumViewPort: process.env.minimumViewPort,
    showMenu: true,
    menuSelectedItem: '',
    local: false,
  }),
  getters: {
    getLocked(state) {
      return state.locked
    }
  },
  actions: {
    lock() {
      this.locked = true
    },
    unlock() {
      this.locked = false
    }
  },
});
