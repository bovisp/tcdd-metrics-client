import axios from 'axios'
import { isEmpty } from 'lodash'

export const setHttpToken = (token) => {
  console.log(token)
  if (isEmpty(token)) {
    // can access axios here?
    axios.defaults.headers.common['Authorization'] = null
  } else {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  }
}
