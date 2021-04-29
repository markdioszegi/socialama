import { AuthController } from '../controller/AuthController'
import { checkAuth } from '../middleware/CheckAuth'

export default [
  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication managing API
   */

  /**
   * @swagger
   * /auth/login:
   *    post:
   *      tags: [Auth]
   *      security: []
   *      summary: Attempt to login as a user
   *      requestBody:
   *        required: true
   *        description: Email and password
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *      responses:
   *        '200':
   *          description: Generated access token and a set the cookie with the refresh token in it
   *        '404':
   *          description: User not found
   *        '400':
   *          description: Wrong password
   */
  {
    method: 'post',
    route: '/auth/login',
    controller: AuthController,
    action: 'login',
  },

  /**
   * @swagger
   * /auth/refreshToken:
   *    post:
   *      tags: [Auth]
   *      summary: Refresh tokens for a user
   *      responses:
   *        '200':
   *          description: Generated access token and a set the cookie with the refresh token in it
   */
  {
    method: 'post',
    route: '/auth/refreshToken',
    controller: AuthController,
    action: 'refreshToken',
  },

  /**
   * @swagger
   * /auth/logout:
   *    post:
   *      tags: [Auth]
   *      summary: Log out the user and remove tokens
   *      responses:
   *        '200':
   *          description: User successfully logged out
   *        '404':
   *          description: User not found
   *        '400':
   *          description: Wrong password
   */
  {
    method: 'post',
    route: '/auth/logout',
    controller: AuthController,
    action: 'logout',
  },

  /**
   * @swagger
   * /auth/payload:
   *    get:
   *      tags: [Auth]
   *      summary: Get the user's payload
   *      responses:
   *        '200':
   *          description: The user's JWT payload
   *        '400':
   *          description: JWT malformed
   */
  {
    method: 'get',
    route: '/auth/payload',
    controller: AuthController,
    action: 'payload',
    middleware: [checkAuth],
  },
]
