import { CreateCourseLanguage, CourseLanguages } from '../components'

export default [
  {
    path: '/course-languages/create',
    component: CreateCourseLanguage,
    name: 'createCourseLanguage',
    meta: {
      needsAuth: true
    }
  },
  {
    path: '/course-languages',
    component: CourseLanguages,
    name: 'courseLanguages',
    meta: {
      needsAuth: true
    }
  }
]
