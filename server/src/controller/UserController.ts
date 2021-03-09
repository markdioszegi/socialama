import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'

export class UserController {
  //private userRepository = getRepository(User)

  async all(request: Request, response: Response, next: NextFunction) {
    return paginate(request, response, User)
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return { status: 'not implemented' }
  }

  async hello(request: Request, response: Response, next: NextFunction) {
    return { msg: 'You are authenticated and role checked! 😉' }
  }
}

async function paginate(request: Request, response: Response, model) {
  let { page, limit, ...q } = request.query

  // Limitations
  if (+page < 1 || +limit < 1 || +limit > 20) return {}

  const startIndex = (+page - 1) * +limit
  const endIndex = +page * +limit
  const count = await model.count()
  const results: any = {}

  const findOptions = {
    take: +limit || 20,
    skip: startIndex,
    where: { ...q },
  }
  if (!q) delete findOptions.where

  // Check for specific queries and join them
  const getQuery = () =>
    Object.keys(q)
      .map((key: string) => `${key}=${q[key]}`)
      .join('&')

  if (endIndex < count) {
    results.next = `http://${process.env.HOST}:${process.env.PORT}/api/users?page=${
      +page + 1
    }&limit=${limit}&${getQuery()}`
  } else {
    // Next query by default
    results.next = `http://${process.env.HOST}:${process.env.PORT}/api/users?page=${1}&limit=${20}&${getQuery()}`
  }

  if (startIndex > 0) {
    results.previous = `http://${process.env.HOST}:${process.env.PORT}/api/users?page=${
      +page - 1
    }&limit=${limit}&${getQuery()}`
  }

  results.users = await model.find(findOptions)

  return results
}
