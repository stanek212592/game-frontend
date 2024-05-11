import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {appSetting} from "stores/appSetting";



// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  // baseURL: '/api',
  baseURL: process.env.backendServer,
  timeout: 5000 // Timeout 5000 milisekund (5 sekund)
})

const requestUrl = (url) => {
  if (!url.toString().startsWith('/')) url = '/' + url
  // speciální případy - přihlašování
  if (url.toString().startsWith('/user_auth')) return url
  // v ostatních případech doplníme API
  return '/api' + url
}

const handleExceptions = e => {
  if (e.response) console.log('ERROR Server: ' + e.response.status + ' - ' + e.response.data)
  else console.log('ERROR Axios: ' + e.message)
}

// Get dle požadavků aplikace
const get = async (url) => {
  const resp = await api.get(url)
  console.log(resp)
  return resp
}


// Post dle požadavků aplikace
const post = async (url, data, lock = false) => {
  if (lock) appSetting().lock()
  return new Promise((resolve, reject) => {
    api.post(requestUrl(url), data)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(e => {
        handleExceptions(e)
        resolve(null)
        // reject(e?.response?.status || null)

      })
      .finally(() => {
        if (lock) appSetting().unlock()
      })
  })
}

export default boot(({app}) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$get = get
  app.config.globalProperties.$post = post
})


// export {axios, api, get, post}
