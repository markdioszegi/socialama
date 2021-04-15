import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from './router/index'
import './scss/main.scss'

// import global components
import Modal from './components/Modal'
import Error from './components/Error'
import Pagination from './components/Pagination'

// my store
//import { store } from './store/store'

// vuex
import store from './store/vuexStore'
import jwtDecode from 'jwt-decode'

const app = createApp(App)
  .directive('click-outside', {
    //beforeMount
    beforeMount: function(el, binding) {
      // Define ourClickEventHandler
      const ourClickEventHandler = (event) => {
        if (!el.contains(event.target) && el !== event.target) {
          // as we are attaching an click event listern to the document (below)
          // ensure the events target is outside the element or a child of it
          binding.value(event) // before binding it
        }
      }
      // attached the handler to the element so we can remove it later easily
      el.__vueClickEventHandler__ = ourClickEventHandler

      // attaching ourClickEventHandler to a listener on the document here
      document.addEventListener('click', ourClickEventHandler)
    },
    unmounted: function(el) {
      // Remove Event Listener
      document.removeEventListener('click', el.__vueClickEventHandler__)
    },
  })
  .use(store)
  .use(router)

//global components
app.component('Modal', Modal)
app.component('Error', Error)
app.component('Pagination', Pagination)

//app.config.globalProperties.$store = store

// Reauth
export const reAuthentication = store.dispatch('user/reAuth').catch((err) => console.log(err))
handleAuthState()

// Set interval to reauthenticate after the access token is expired
async function handleAuthState() {
  await reAuthentication
  const delay = 10000 // delay in ms
  const expirationTime = new Date(jwtDecode(store.getters['user/accessToken']).exp * 1000 - delay) - Date.now()
  console.log('Expiration is: ' + expirationTime)

  setInterval(() => {
    console.log('Token expired! Renewing...')
  }, expirationTime)
}

app.mount('#app')
