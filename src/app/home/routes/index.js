import { Home } from '../components'

export default [
  {
    path: '/login',
    component: Home,
    name: 'home',
    meta: {
      guest: false,
      needsAuth: false
    }
  }
]