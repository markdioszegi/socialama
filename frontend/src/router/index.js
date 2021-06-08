import { createRouter, createWebHashHistory } from 'vue-router'
import { reAuthentication } from '@/main'
import { routes } from '@/router/routes'
import store from '@/store/vuexStore'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Wait for store
router.beforeEach(async (to, from, next) => {
  await reAuthentication

  // Set the title according to the meta
  if (store.getters['user/user'].username && to.matched.some(r => r.name == "profile")) {
    document.title =
      store.getters['user/user'].username + ' - ' + to.meta.title ||
      process.env.VUE_APP_NAME
  } else {
    document.title = to.meta.title || process.env.VUE_APP_NAME
  }
  next()
})

export { router }
