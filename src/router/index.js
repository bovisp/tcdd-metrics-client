import Vue from 'vue'
import Router from 'vue-router'
import { routes } from '../app/index.js'
import beforeEach from './beforeEach'

Vue.use(Router)

let routerBase = ''
if(process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  routerBase = ''
} else {
  routerBase = '/metrics/'
}

const router = new Router({
  routes,
  mode: 'history',
  base: routerBase
})

router.beforeEach(beforeEach)

export default router
