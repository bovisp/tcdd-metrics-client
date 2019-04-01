import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import store from './vuex'
import localforage from 'localforage'
import './style/navbar.js'
import vSelect from './components/Select.vue'

Vue.config.productionTip = false

Vue.use(Buefy)

Vue.component('v-select', vSelect)

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
