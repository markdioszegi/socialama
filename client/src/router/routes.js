//import App from './App'
import Home from '../views/Home'
import NotFound from '../views/NotFound'
import Register from '../views/Register'
import Login from '../views/Login'

//import GetUsers from '../views/GetUsers'
import Profile from '../views/profile/Profile'
import Settings from '../views/profile/Settings'
import Feed from '../views/profile/Feed'

// Guards
import { guards } from './guards'

export const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    props: true,
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    props: true,
    beforeEnter: [guards.requiresGuest],
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
    props: true,
    beforeEnter: [guards.requiresGuest],
  },
  {
    name: 'profile',
    path: '/:username',
    component: Profile,
    meta: {},
    children: [
      {
        path: 'settings',
        component: Settings,
        beforeEnter: [guards.requiresSameUser],
      },
      {
        name: 'feed',
        path: '',
        component: Feed,
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
    component: NotFound,
  },
]
