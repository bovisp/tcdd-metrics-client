import { Create, BadgeLanguages } from '../components'

export default [
  {
    path: '/badge-languages/create',
    component: Create,
    name: 'create',
    meta: {
      needsAuth: true
    }
  },
  {
    path: '/badge-languages',
    component: BadgeLanguages,
    name: 'badgeLanguages',
    meta: {
      needsAuth: true
    }
  }
]
