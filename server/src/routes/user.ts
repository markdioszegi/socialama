import { application } from 'express'
import { UserController } from '../controller/UserController'
import { checkAuth } from '../middleware/CheckAuth'
import { checkRole } from '../middleware/CheckRole'

export default [
  /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User managing API
   */

  /**
   * @swagger
   * /users:
   *    get:
   *      tags: [Users]
   *      summary: Get users by properties
   *      responses:
   *        '200':    # status code
   *          description: A JSON array of user names
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   */
  {
    method: 'get',
    route: '/users',
    controller: UserController,
    action: 'all',
    //middleware: [checkAuth], // pass an array of middlewares
  },
  {
    method: 'get',
    route: '/users/:userId',
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
