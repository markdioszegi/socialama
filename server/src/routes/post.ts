import { PostController } from '../controller/PostController'
import { checkAuth } from '../middleware/CheckAuth'

export default [
  /**
   * @swagger
   * tags:
   *   name: Post
   *   description: Posts managing API
   */

  /**
   * @swagger
   * /posts:
   *    post:
   *      tags: [Post]
   *      summary: Create a post
   *      responses:
   *        '200':
   *          description: The user's JWT payload
   *        '400':
   *          description: JWT malformed
   */
  {
    method: 'post',
    route: '/posts',
    controller: PostController,
    action: 'create',
    middleware: [checkAuth],
  },

  /**
   * @swagger
   * /posts:
   *    get:
   *      tags: [Post]
   *      summary: Get posts by query
   *      security: []
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
   *          type: integer
   *          description: The id of the post
   *        - in: query
   *          name: title
   *          type: string
   *          description: The title of the post
   *        - in: query
   *          name: text
   *          type: string
   *          description: The text (content) of the post
   *        - in: query
   *          name: karma
   *          type: integer
   *          description: The karma of the post
   *        - in: query
   *          name: userId
   *          type: integer
   *          description: The id of the user who owns the post
   *      responses:
   *        '200':
   *          description: A JSON array of posts
   */
  {
    method: 'get',
    route: '/posts',
    controller: PostController,
    action: 'all',
  },
  {
    method: 'put',
    route: '/posts/:postId',
    controller: PostController,
    action: 'update',
    middleware: [checkAuth],
  },
  /**
   * @swagger
   * /posts/{postId}:
   *    delete:
   *      tags: [Post]
   *      summary: Delete a post
   *      parameters:
   *        - in: path
   *          name: postId
   *          type: integer
   *          description: The id of the post
   *      responses:
   *        '200':
   *          description: Post deleted
   *        '400':
   *          description: Bad request
   */
  {
    method: 'delete',
    route: '/posts/:postId',
    controller: PostController,
    action: 'delete',
    middleware: [checkAuth],
  },
]
