import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import router from './router'
import store from './vuex'
import localforage from 'localforage'
import './style/navbar.js'
import Vuelidate from 'vuelidate'
import moment from 'moment'
import Clipboard from 'v-clipboard'

Vue.prototype.moment = moment
Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(Vuelidate)
Vue.use(Clipboard)

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
