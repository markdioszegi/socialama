import { UserController } from '../controller/UserController'
import { checkAuth } from '../middleware/CheckAuth'
import { checkRole } from '../middleware/CheckRole'

export default [
  {
    method: 'get',
    route: '/users',
    controller: UserController,
    action: 'all',
    //middleware: [checkAuth], // pass an array of middlewares
  },
  {
    method: 'get',
    route: '/users/:id',
    controller: UserController,
    action: 'one',
  },
  {
    method: 'get',
    route: '/hello',
    controller: UserController,
    action: 'hello',
    middleware: [checkAuth, checkRole], // pass an array of middlewares
  },
]
