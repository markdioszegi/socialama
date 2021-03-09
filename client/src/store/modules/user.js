import decodeJWT from 'jwt-decode'

// initial state
const state = () => ({
  accessToken: null,
  user: {},
})

// getters
const getters = {
  isAuthenticated(state) {
    return Object.keys(state.user).length === 0 && state.user.constructor === Object ? false : true
  },

  user(state) {
    return state.user
  },

  accessToken(state) {
    return state.accessToken
  },
}

// actions
const actions = {
  async login({ commit /* dispatch */ }, credentials) {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/login', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          commit('setAccessToken', data.accessToken)
          commit('setUser', decodeJWT(data.accessToken))
        }
        return data
      })
      .catch(() => console.log('error in login'))
  },

  // Reauthenticate the user
  async reAuth({ commit, state }) {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/refresh_token', {
      method: 'post',
      credentials: 'include',
      headers: {
        Authorization: `bearer ${state.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) {
          commit('setAccessToken', data.accessToken)
          commit('setUser', decodeJWT(data.accessToken))
          return Promise.resolve()
        } else {
          return Promise.reject('Looks like reauthentication is failed.')
        }
      })
  },

  async logout({ commit }) {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/logout', {
      method: 'post',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(() => {
        commit('setAccessToken', null)
        commit('setUser', {})
        return Promise.resolve()
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  },
}

// mutations
const mutations = {
  setAccessToken(state, s) {
    state.accessToken = s
  },

  setUser(state, user) {
    state.user = user
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
