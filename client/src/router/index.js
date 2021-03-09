import { createRouter, createWebHashHistory } from 'vue-router'
import { reAuthentication } from '../main'
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Wait for store
router.beforeEach(async (to, from, next) => {
  await reAuthentication
  next()
})

export { router }
