import { Request, Response, NextFunction } from 'express'

import { verify } from 'jsonwebtoken'

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization']

  if (!authorization) {
    return res.status(400).json({ error: 'No authorization header!' })
  }

  try {
    const token = authorization.split(' ')[1]
    const payload = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    res.locals.payload = payload
  } catch (err) {
    return res.status(400).json({ error: 'Token expired!' })
  }

  next()
}
