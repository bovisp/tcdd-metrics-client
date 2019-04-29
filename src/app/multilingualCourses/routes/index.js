import { CreateMultilingualCourse, MultilingualCourses } from '../components'

export default [
  {
    path: '/multilingual-courses/create',
    component: CreateMultilingualCourse,
    name: 'createMultilingualCourse',
    meta: {
      needsAuth: true
    }
  },
  {
    path: '/multilingual-courses',
    component: MultilingualCourses,
    name: 'multilingualCourses',
    meta: {
      needsAuth: true
    }
  }
]
