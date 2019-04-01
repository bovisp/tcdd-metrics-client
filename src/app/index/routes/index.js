import { Index } from '../components'

export default [
  {
    path: '/index',
    component: Index,
    name: 'index',
    meta: {
      guest: false,
      needsAuth: true
    }
  }
]
