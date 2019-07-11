import auth from './auth/routes'
import home from './home/routes'
import timeline from './timeline/routes'
import errors from './errors/routes'
import badgeLanguages from './badgeLanguages/routes'
import courseLanguages from './courseLanguages/routes'
import multilingualCourses from './multilingualCourses/routes'
import reports from './reports/routes'
import catalogs from './catalogs/routes'
import courseMetadata from './courseMetadata/routes'
import charts from './charts/routes'
import webinars from './webinars/routes'
import catalogBlacklist from './catalogBlacklist/routes'
import cometUpload from './cometUpload/routes'
import catalogMSCFunded from './catalogMSCFunded/routes'

export default [
  ...home,
  ...auth,
  ...badgeLanguages,
  ...courseLanguages,
  ...multilingualCourses,
  ...reports,
  ...catalogs,
  ...courseMetadata,
  ...charts,
  ...webinars,
  ...catalogBlacklist,
  ...cometUpload,
  ...catalogMSCFunded,
  ...timeline,
  ...errors
]
