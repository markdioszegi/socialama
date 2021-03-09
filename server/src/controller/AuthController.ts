import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import { validate } from 'class-validator'
import { hash, verify } from 'argon2'
import { JsonWebTokenError, verify as verifyJWT } from 'jsonwebtoken'
import { createAccessToken, createRefreshToken, sendRefreshToken } from '../utils/authUtils'
import { getRepository } from 'typeorm'

export class AuthController {
  //private userRepository = getRepository(User)

  async register(request: Request, response: Response, next: NextFunction) {
    // Create a temp user
    const user = new User()
    user.username = request.body.username
    user.email = request.body.email
    user.password = request.body.password

    // Debug
    //console.log(user)

    // Validate
    const errors = await validate(user)

    if (errors.length > 0) {
      // Check for any errors first
      response.status(400)
      return errors
    } else {
      user.password = await hash(request.body.password, {}) // hash the password
      User.save(user)
      return { success: 'User successfully registered.' }
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    const errors: any = { error: { constraints: {} } }

    const user = await User.createQueryBuilder()
      .addSelect('User.password AS User_password')
      .where('email = :email', { email: request.body.email })
      .getOne()

    if (!user) {
      errors.error.constraints.email = 'Could not find user with that email or username!'
      response.status(400)
      return errors
    }

    const valid = await verify(user.password, request.body.password)

    if (!valid) {
      errors.error.constraints.password = 'Wrong password!'
      response.status(400)
      return errors
    }

    // Login
    console.log('jwt secret is :' + process.env.JWT_ACCESS_TOKEN_SECRET)

    // Send refresh token
    sendRefreshToken(response, createRefreshToken(user))

    // Set access token
    return { message: 'Successfully logged in!', accessToken: createAccessToken(user) }
  }

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

    console.log(payload)

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

  async payload(request: Request, response: Response, next: NextFunction) {
    const token = (request.headers['authorization'] || '').split(' ')[1] || ''

    if (!token) {
      return { error: 'no authorization header' }
    }

    try {
      // If there's no error, token info is returned in 'decoded'
      return verifyJWT(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    } catch (err) {
      // Catch errors
      response.status(400)
      return { error: err.message }
    }
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    sendRefreshToken(response, '')

    return { ok: true }
  }

  async revokeRefreshToken(userId: number) {
    await getRepository(User).increment({ id: userId }, 'tokenVersion', 1)

    return true
  }
}
