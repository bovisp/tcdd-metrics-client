import axios from 'axios'
import { setHttpToken } from '../../../helpers'
import { isEmpty } from 'lodash'
import localforage from 'localforage'
import env from '../../../../env'

if(process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:8000'
} else {
  axios.defaults.baseURL = 'http://msc-educ-smc.cmc.ec.gc.ca/tcdd-metrics'
}

export const register = async ({ dispatch }, { payload, context }) => {
  try {
    let response = await axios.post('/api/register', payload)

    await dispatch('setToken', response.data.meta.token)

    await dispatch('fetchUser')

    return response
  } catch (e) {
    context.errors = e.response.data.errors

    return e.response
  }
}

export const login = async ({ dispatch }, { payload, context }) => {
  try {
    let response = await axios.post('/api/login', payload)

    await dispatch('setToken', response.data.meta.token)

    await dispatch('fetchUser')

    return response
  } catch (e) {
    context.errors = e.response.data.errors

    return e.response
  }
}

export const fetchUser = async ({ commit }) => {
  let response = await axios.get('/api/me')

  await commit('setAuthenticated', true)
  await commit('setUserData', response.data.data)
}

export const logout = async ({ dispatch }) => {
  return axios.post('/api/logout').then(response => {
    dispatch('clearAuth')
  })
}

export const setToken = async ({ commit, dispatch }, token) => {
  if (isEmpty(token)) {
    return dispatch('checkTokenExists').then(token => {
      setHttpToken(token)
    })
  }
  await commit('setToken', token)
  await setHttpToken(token)
}

export const checkTokenExists = ({ commit, dispatch }, token) => {
  return localforage.getItem('authtoken').then(token => {
    if (isEmpty(token)) {
      return Promise.reject(new Error('NO_STORAGE_TOKEN'))
    }
    return Promise.resolve(token)
  })
}

export const clearAuth = async ({ commit }, token) => {
  commit('setAuthenticated', false)
  commit('setUserData', null)
  commit('setToken', null)
  setHttpToken(null)
}
