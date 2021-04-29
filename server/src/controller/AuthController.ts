import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import { validate } from 'class-validator'
import { hash, verify } from 'argon2'
import { JsonWebTokenError, verify as verifyJWT } from 'jsonwebtoken'
import { createAccessToken, createRefreshToken, getUserWithPassword, sendRefreshToken } from '../utils/authUtils'
import { getRepository } from 'typeorm'
import { validateUsername } from '../utils/customValidator'

export class AuthController {
  //private userRepository = getRepository(User)

  // Login a user
  async login(request: Request, response: Response, next: NextFunction) {
    const errors: any = { error: { constraints: {} } }

    // Get user with password
    const user = await getUserWithPassword(request.body.email)

    if (!user) {
      errors.error.constraints.email = 'Could not find user with that email or username!'
      response.status(404)
      return errors
    }

    const valid = await verify(user.password, request.body.password)

    if (!valid) {
      errors.error.constraints.password = 'Wrong password!'
      response.status(400)
      return errors
    }

    // Login
    //console.log('jwt secret is :' + process.env.JWT_ACCESS_TOKEN_SECRET)

    // Send refresh token
    sendRefreshToken(response, createRefreshToken(user))

    // Set access token
    return { message: 'Successfully logged in!', accessToken: createAccessToken(user) }
  }

  // Refresh token
  async refreshToken(request: Request, response: Response, next: NextFunction) {
    const token = request.cookies.jid

    if (!token) {
      response.status(401)
      return { error: 'jwt token is missing', accestoken: '' }
    }

    let payload = null
    try {
      payload = verifyJWT(token, process.env.JWT_REFRESH_TOKEN_SECRET)
    } catch (err) {
      response.status(401)
      return { error: err.message, accessToken: '' }
    }

    //console.log(payload)

    /* type JWTPayload = {
      userId: number
    } */

    // Token is valid
    const user = await User.findOne({ id: payload.userId })

    if (!user) {
      response.status(404)
      return { error: 'User not found!', accessToken: '' }
    }

    // Check token version
    if (user.tokenVersion !== payload.tokenVersion) {
      response.status(400)
      return { error: 'Token version is invalid!', accessToken: '' }
    }

    // Generate & send a new refresh token
    sendRefreshToken(response, createRefreshToken(user))

    // Return new access token
    return {
      ok: true,
      accessToken: createAccessToken(user),
    }
  }

  // Access current payload
  async payload(request: Request, response: Response, next: NextFunction) {
    const payload = response.locals.payload

    // Return current user
    return await User.findOne({ email: payload.email })
  }

  // Logout the user
  async logout(request: Request, response: Response, next: NextFunction) {
    sendRefreshToken(response, '')

    return { ok: true }
  }

  // Manually revoke refresh token
  async revokeRefreshToken(userId: number) {
    await getRepository(User).increment({ id: userId }, 'tokenVersion', 1)

    return true
  }
}
