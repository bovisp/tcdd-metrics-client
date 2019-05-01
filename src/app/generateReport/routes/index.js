import { GenerateReport } from '../components'

export default [
  {
    path: '/generate-report',
    component: GenerateReport,
    name: 'generateReport',
    meta: {
      needsAuth: true
    }
  }
]
