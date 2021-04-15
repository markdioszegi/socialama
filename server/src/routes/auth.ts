import { AuthController } from '../controller/AuthController'

export default [
  {
    method: 'post',
    route: '/auth/register',
    controller: AuthController,
    action: 'register',
  },
  {
    method: 'post',
    route: '/auth/login',
    controller: AuthController,
    action: 'login',
  },
  {
    method: 'post',
    route: '/auth/refresh_token',
    controller: AuthController,
    action: 'refreshToken',
  },
  {
    method: 'post',
    route: '/auth/logout',
    controller: AuthController,
    action: 'logout',
  },
  {
    method: 'get',
    route: '/auth/payload',
    controller: AuthController,
    action: 'payload',
  },
  {
    method: 'post',
    route: '/auth/edit',
    controller: AuthController,
    action: 'edit',
  },
]
