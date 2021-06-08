import { Request, Response } from 'express'

export const paginate = async (request: Request, response: Response, { model, relations }: any) => {
  let { page, limit, ...q } = request.query

  const modelName = (model.name + 's').toLowerCase()

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
    relations: relations,
  }
  if (!q) delete findOptions.where

  // Check for specific queries and join them
  const getQuery = () =>
    Object.keys(q)
      .map((key: string) => `${key}=${q[key]}`)
      .join('&')

  /* if (endIndex < count) {
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
  } */

  results[modelName] = await model.find(findOptions)
  const whereObj = {}

  /* results.users = await model
    .createQueryBuilder(modelName)
    .where(`${modelName}_username LIKE :username`, { username: request.query.username })
    .getQueryAndParameters() */

  results.totalResults = (await model.find({ where: findOptions.where })).length
  results.totalPages = Math.ceil(results.totalResults / findOptions.take) //Math.ceil(results.totalResults / +limit)

  return results
}
