import { CreateWebinarAttendance, WebinarAttendance } from '../components'

export default [
  {
    path: '/webinar-attendance/create',
    component: CreateWebinarAttendance,
    name: 'createWebinarAttendance',
    meta: {
      needsAuth: false
    }
  },
  {
    path: '/webinar-attendance',
    component: WebinarAttendance,
    name: 'webinarAttendance',
    meta: {
      needsAuth: false
    }
  }
]
