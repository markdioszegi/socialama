// my store
//import { store } from '../store/store'

// vuex
import store from '../store/vuexStore'

const guards = {
  requiresAuth: async (to, from, next) => {
    //console.log('Check user auth', await store.isAuthenticated())
    if (to.meta.requiresAuth && !store.getters['user/isAuthenticated']) {
      next({ name: 'login', params: { redirectMsg: 'This route requires authentication!' } })
    } else if (store.getters['user/isAuthenticated'] && (to.name === 'login' || to.name === 'register')) {
      next({ name: 'home' /* , params: { redirectMsg: 'hehe:D' } */ })
    } else {
      next()
    }
  },

  requiresGuest: (to, from, next) => {
    if (store.getters['user/isAuthenticated']) {
      next({ name: 'home' /* params: { redirectMsg: 'you are already logged in:D' } */ })
    } else {
      next()
    }
  },

  requiresSameUser: (to, from, next) => {
    if (store.getters['user/user'].username === to.params.username) {
      next()
    } else {
      next({ name: 'home', params: { redirectMsg: `Not logged in as ${to.params.username}` } })
    }
  },
}

// old Router beforeEach
/* requiresAuth: async (to, from, next) => {
  await reAuthentication
  //console.log('Check user auth', await store.isAuthenticated())
  if (to.meta.requiresAuth && !store.isAuthenticated()) {
    next({ name: 'login', params: { redirectMsg: 'This route requires authentication!' } })
  } else if (store.isAuthenticated() && (to.name === 'login' || to.name === 'register')) {
    next({ name: 'home', params: { redirectMsg: 'hehe:D' }  })
  } else {
    next()
  }
}, */

export { guards }
