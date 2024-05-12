import {boot} from 'quasar/wrappers'
import axios from 'axios'
import {appSetting} from "stores/appSetting";
import {user} from "stores/user";


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

api.interceptors.request.use((config) => {

 // Přepínání adresa pro vývoj
  if (process.env.DEV) {
    config.baseURL = appSetting().local ? process.env.backendLocal : process.env.backendServer
    // console.log(config.baseURL)
  }

  const token = user().token
  if (token && isTokenExpired(token)) {
    console.log('expirovaný token')
  }
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


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
const get = async (url, data, lock = false, controls) => {
  if (lock) appSetting().lock()

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();


  const promise =  new Promise((resolve, reject) => {
    api.get(requestUrl(url), {params: data, cancelToken: source.token})
      .then(resp => {
        resolve(resp.data)
      })
      .catch(e => {
        handleExceptions(e)
        resolve(null)
      })
      .finally(() => {
        if (lock) appSetting().unlock()
      })
  })

  if (controls) {
    controls.cancel = () => source.cancel()
  }
  return promise
}


// Post dle požadavků aplikace
const post = async (url, data, lock = false, controls) => {
  if (lock) appSetting().lock()

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise =  new Promise((resolve, reject) => {
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
  if (controls) {
    controls.cancel = () => source.cancel()
  }
  return promise
}

export default boot(({app}) => {
  // // for use inside Vue files (Options API) through this.$axios and this.$api
  //
  // app.config.globalProperties.$axios = axios
  // // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  // //       so you won't necessarily have to import axios in each vue file
  //
  // app.config.globalProperties.$api = api
  // // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  // //       so you can easily perform requests against your app's API

  app.config.globalProperties.$get = get
  app.config.globalProperties.$post = post
})


// export {axios, api, get, post}
function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
