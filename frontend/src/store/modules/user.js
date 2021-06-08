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
      method: 'POST',
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
  // TODO: only reauthenticates after page refresh -> should loop it
  async reAuth({ commit, getters }) {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/refreshToken', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `bearer ${getters.accessToken}`,
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
    // TODO: Should check if JWT is valid
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/logout', {
      method: 'POST',
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

  // Get and set the current user via JWT
  async payload({ commit, getters }) {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/payload', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${getters.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        commit('setUser', data)
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },

  async update({ getters, dispatch }, creds) {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/users/update', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${getters.accessToken}`,
      },
      body: JSON.stringify(creds),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (!data.errors) await dispatch('reAuth')
        return Promise.resolve(data)
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
