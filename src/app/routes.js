import auth from './auth/routes'
import home from './home/routes'
import timeline from './timeline/routes'
import errors from './errors/routes'
import index from './index/routes'
import store from './store/routes'

export default [...home, ...auth, ...index, ...store, ...timeline, ...errors]
