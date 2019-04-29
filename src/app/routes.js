import auth from './auth/routes'
import home from './home/routes'
import timeline from './timeline/routes'
import errors from './errors/routes'
import badgeLanguages from './badgeLanguages/routes'
import courseLanguages from './courseLanguages/routes'
import multilingualCourses from './multilingualCourses/routes'

export default [...home, ...auth, ...badgeLanguages, ...courseLanguages, ...multilingualCourses, ...timeline, ...errors]
