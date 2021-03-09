import { reactive } from 'vue'
import decodeJWT from 'jwt-decode'

const debug = process.env.NODE_ENV !== 'production'

export const store = {
  debug: debug ? true : false,

  state: reactive({
    accessToken: null,
    user: null,
    counter: 0,
  }),

  getUser() {
    return this.state.user
  },

  async login(credentials) {
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
          this.setAccessToken(data.accessToken)
          this.setUser(decodeJWT(data.accessToken))
          //await this.getUser()
        }
        return data
      })
      .catch(() => console.log('error in login'))
  },

  // Let the server decode the JWT
  /* async getUser() {
    if (this.debug) console.log("Getting the user's payload...'")

    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/payload', {
      headers: {
        Authorization: `bearer ${this.state.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        //await this.stall()
        if (data.error) throw data.error
        this.setUser(data)
        //return true
      })
      .catch((err) => console.log(err)) // It should have an auth header
  }, */

  // refresh the access token and get a new refresh token
  async reAuth() {
    return fetch(process.env.VUE_APP_API_BASE_URL + '/auth/refresh_token', {
      method: 'post',
      credentials: 'include',
      headers: {
        Authorization: `bearer ${this.state.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accessToken) this.setAccessToken(data.accessToken)
        this.setUser(decodeJWT(data.accessToken))
        //await this.getUser()
        return Promise.resolve()
      })
      .catch(() => {
        return Promise.reject('Looks like reauthentication is failed.')
      })
  },

  async stall(stallTime = 3000) {
    // Imitate slow API
    await new Promise((resolve) => setTimeout(resolve, stallTime))
  },

  isAuthenticated() {
    return this.state.user ? true : false
  },

  setAccessToken(s) {
    if (this.debug) console.log('access token set!')

    this.state.accessToken = s
    //console.log('returning job')
  },

  setUser(user) {
    if (this.debug) console.log('user set!')

    this.state.user = user
  },

  increment() {
    if (this.debug) {
      console.log('counter is incremented')
    }

    this.state.counter++
  },
}
