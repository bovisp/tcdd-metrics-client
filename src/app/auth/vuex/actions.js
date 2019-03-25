export const register = ({ dispatch }, { payload, context }) => {
  return axios.post('/api/register').then(response => {
    console.log(response)
  }).catch(error => {
    context.errors = error.response.data.errors
  })
}

export const login = ({ dispatch }, { payload, context }) => {
  return axios.post('/api/login').then(response => {
    console.log(response)
  }).catch(error => {
    context.errors = error.response.data.errors
  })
}
