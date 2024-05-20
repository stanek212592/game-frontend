import {defineStore} from 'pinia';
import {appSetting} from "stores/appSetting";

export const user = defineStore('user', {
  state: () => ({
    id: null,
    login: '',
    firstname: '',
    surname: '',
    token: '',
    jwtDt: null,
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    setUser(user = null) {
      if (user === null) appSetting().menuSelectedItem = ''
      this.id = user?.id || null
      this.login = user?.login || null
      this.firstname = user?.firstname || null
      this.surname = user?.surname || null
      this.token = user?.token || null
    },
  },
});