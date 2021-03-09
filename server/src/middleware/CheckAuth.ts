import { Request, Response, NextFunction } from 'express'

import { verify } from 'jsonwebtoken'

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers['authorization']

  console.log('Checking auth')

  if (!authorization) {
    return res.status(400).json({ error: 'no authorization header' })
  }

  try {
    const token = authorization.split(' ')[1]
    const payload = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    res.locals.hello = payload
  } catch (err) {
    return res.status(400).json({ error: 'Token expired' })
  }

  //res.json('lófasz jóska')

  next()
}
