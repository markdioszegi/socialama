import logger from '@/utils/logger'
import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { Post } from '../entity/Post'
import { paginate } from '../utils/controllerUtils'

export class PostController {
  //private userRepository = getRepository(User)

  async all(request: Request, response: Response, next: NextFunction) {
    logger.info(`Pagination sent`)
    return paginate(request, response, { model: Post /* , relations: ['user'] */ })
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const post = new Post()
    post.title = request.body.title
    post.text = request.body.text
    post.user_id = response.locals.payload.userId

    const errors = await validate(post)

    if (errors.length > 0) {
      response.status(400)
      logger.error(`Post creation failed`)
      return { errors: errors }
    } else {
      await Post.save(post)
      logger.info(`Post created`)
      return { success: 'Post created' }
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const payload = response.locals.payload

    let post = await Post.findOne({ where: { user_id: payload.userId, id: request.params.postId } })

    if (!post) {
      logger.error(`Post updation failed`)
      return { error: 'No post!' }
    }

    post.title = request.body.title
    post.text = request.body.text

    const errors = await validate(post)

    if (errors.length > 0) {
      response.status(400)
      logger.error(`Post updation failed`)
      return { errors: errors }
    } else {
      await Post.save(post)
      logger.info(`Post updated`)
      return { success: 'Post updated' }
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    const payload = response.locals.payload

    const post = await Post.findOne({ where: { user_id: payload.userId, id: request.params.postId } })

    if (post) {
      await post.remove()

      logger.info(`Post deleted`)
      return { success: 'deleted' }
    }

    response.status(401)
    logger.info(`Post deletion failed`)
    return {}
  }
}
