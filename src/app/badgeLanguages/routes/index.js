import { CreateBadgeLanguage, BadgeLanguages } from '../components'

export default [
  {
    path: '/badge-languages/create',
    component: CreateBadgeLanguage,
    name: 'createBadgeLanguage',
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
