import { application } from 'express'
import { UserController } from '../controller/UserController'
import { checkAuth } from '../middleware/CheckAuth'
import { checkRole } from '../middleware/CheckRole'

export default [
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User managing API
   */

  /**
   * @swagger
   * /users/create:
   *    post:
   *      tags: [User]
   *      summary: Register a fresh user
   *      security: []
   *      consumes:
   *        - application/json
   *      requestBody:
   *        required: true
   *        description: The user to create
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              required:
   *                - username
   *                - email
   *                - password
   *              properties:
   *                username:
   *                  type: string
   *                email:
   *                  type: string
   *                password:
   *                  type: string
   *      responses:
   *        200:
   *          description: A message that the registration was successful
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *        400:
   *          description: Bad request
   */

  {
    method: 'post',
    route: '/users/create',
    controller: UserController,
    action: 'create',
  },

  /**
   * @swagger
   * /users:
   *    get:
   *      tags: [User]
   *      summary: Get users by query
   *      security: []
   *      responses:
   *        '200':    # status code
   *          description: A JSON array of user names
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *        '400':
   *          description: Bad request
   *      parameters:
   *        - in: query
   *          name: page
   *          schema:
   *            type: integer
   *          description: The page number
   *        - in: query
   *          name: limit
   *          schema:
   *            type: integer
   *            minimum: 1
   *          description: The limit of the result set (default is 20)
   *        - in: query
   *          name: id
   *          schema:
   *            type: integer
   *          description: The id of the user
   *        - in: query
   *          name: username
   *          schema:
   *            type: string
   *          description: The username of the user
   *        - in: query
   *          name: email
   *          schema:
   *            type: string
   *          description: The email of the user
   *        - in: query
   *          name: isActive
   *          schema:
   *            type: boolean
   *          description: The status of the user
   *        - in: query
   *          name: tokenVersion
   *          schema:
   *            type: integer
   *          description: The version of the user's token
   */
  {
    method: 'get',
    route: '/users',
    controller: UserController,
    action: 'all',
    //middleware: [checkAuth], // pass an array of middlewares
  },
  /**
   * @swagger
   * /users/update:
   *    put:
   *      tags: [User]
   *      summary: Update an existing user
   *      requestBody:
   *        required: true
   *        description: The user to create
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                username:
   *                  type: string
   *                oldPassword:
   *                  type: string
   *                newPassword:
   *                  type: string
   *      responses:
   *        '200':
   *          description: User updated successfully
   *        '400':
   *          description: Bad Request
   *        '401':
   *          description: Unauthorized
   */
  {
    method: 'put',
    route: '/users/update',
    controller: UserController,
    action: 'update',
    middleware: [checkAuth],
  },
  // Delete here

  /**
   * @swagger
   * /users/{userId}:
   *    get:
   *      tags: [User]
   *      summary: Get a user by its ID
   *      security: []
   *      parameters:
   *        - in: path
   *          name: userId
   *          schema:
   *            type: integer
   *          description: The id of the user
   *      responses:
   *        '200':
   *          description: A user object
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *        '400':
   *          description: Bad request
   */
  {
    method: 'get',
    route: '/users/:userId',
    controller: UserController,
    action: 'one',
  },
  // Need documentation
  {
    method: 'get',
    route: '/hello',
    controller: UserController,
    action: 'hello',
    middleware: [checkAuth, checkRole], // pass an array of middlewares
  },
]
