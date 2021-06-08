// Guards
import { guards } from '@/router/guards'

export const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: "public-routes" */ '@/views/Home'),
    props: true,
    meta: {
      title: "Home"
    }
  },
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "public-routes" */ '@/views/Login'),
    props: true,
    meta: {
      title: "Login"
    },
    beforeEnter: [guards.requiresGuest],
  },
  {
    name: 'register',
    path: '/register',
    component: () => import(/* webpackChunkName: "public-routes" */ '@/views/Register'),
    props: true,
    meta: {
      title: "Register"
    },
    beforeEnter: [guards.requiresGuest],
  },
  {
    name: 'profile',
    path: '/:username',
    component: () => import(/* webpackChunkName: "profile-routes" */ '@/views/profile/Profile'),
    children: [
      {
        name: 'feed',
        path: '',
        component: () => import(/* webpackChunkName: "profile-routes" */ '@/views/profile/Feed'),
        meta: {
          title: "Feed"
        },
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import(/* webpackChunkName: "profile-routes" */ '@/views/profile/Settings'),
        meta: {
          title: "Settings"
        },
        beforeEnter: [guards.requiresSameUser],
      },
    ],
  },
  {
    name: 'getUsers',
    path: '/users',
    component: () => import('../views/GetUsers' /* webpackChunkName: "user" */), // Lazy load
    meta: {
      requiresAuth: true,
    },
    beforeEnter: [guards.requiresAuth],
  },
  {
    name: '404',
    path: '/:pathMatch(.*)*', // 404 route
    component: () => import(/* webpackChunkName: "public-routes" */ '@/views/NotFound'),
  },
]
