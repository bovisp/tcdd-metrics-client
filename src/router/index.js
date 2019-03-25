import Vue from 'vue'
import Router from 'vue-router'
import { routes } from '../app/index.js'

Vue.use(Router)

const router = new Router({
  routes,
  mode: 'history'
})

export default router
