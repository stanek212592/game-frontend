import {defineStore} from 'pinia';
import {appSetting} from "stores/appSetting";

export const user = defineStore('user', {
  state: () => ({
    login: '',
    firstname: '',
    surname: '',
    jwt: '',
    jwtDt: null,
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    setJwt(user = null) {
      if (user === null) appSetting().menuSelectedItem = ''
      this.login = user?.login || null
      this.firstname = user?.firstname || null
      this.surname = user?.surname || null
      this.jwt = user?.token || null
      this.jwtDt = null
      // this.jwtDt = user ? new Date() : null
    },
  },
});
