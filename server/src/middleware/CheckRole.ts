import { Request, Response, NextFunction } from 'express'

export const checkRole = (req: Request, res: Response, next: NextFunction) => {
  console.log(res.locals.hello)

  next()
}
