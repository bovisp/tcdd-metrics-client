import axios from 'axios'
import { setHttpToken } from '../../../helpers'

axios.defaults.baseURL = 'http://localhost:8000'

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

export const setToken = async ({ commit, dispatch }, token) => {
  await commit('setToken', token)
  await setHttpToken(token)
}
