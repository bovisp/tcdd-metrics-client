import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import axios from 'axios'

Vue.prototype.$http = axios

console.log(router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
