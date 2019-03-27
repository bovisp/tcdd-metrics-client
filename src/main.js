import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import localforage from 'localforage'

Vue.config.productionTip = false

localforage.config({
  driver: localforage.LOCALSTORAGE,
  storeName: 'tcdd-metrics'
})

store.dispatch('auth/setToken').then(() => {
  store.dispatch('auth/fetchUser').catch(() => {
    store.dispatch('auth/clearAuth')
    router.replace({ name: 'login' })
  })
}).catch(() => {
  store.dispatch('auth/clearAuth')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
