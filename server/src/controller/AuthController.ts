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

  // Register a user
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
      await User.save(user)
      return { success: 'User successfully registered.' }
    }
  }

  // Login a user
  async login(request: Request, response: Response, next: NextFunction) {
    const errors: any = { error: { constraints: {} } }

    // Get user with password
    const user = await getUserWithPassword(request.body.email)

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

  // Edit profile creds
  async edit(request: Request, response: Response, next: NextFunction) {
    const token = (request.headers['authorization'] || '').split(' ')[1] || ''
    const errors: Array<Object> = []

    if (!token /*  || typeof token == undefined */) {
      response.status(401)
      return { error: 'No authorization header' }
    }

    // Get the payload / verify token
    let payload = null
    try {
      payload = verifyJWT(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    } catch (error) {
      return error
    }

    // Get current user with password
    const currentUser = await getUserWithPassword(payload.email)

    console.log(currentUser)

    //----- Check if user exist
    if (!currentUser) {
      return { error: 'User not found' }
    }

    const creds = request.body

    /* const user = new User()
    user.username = creds.username
    user.email = creds.email
    console.log(creds) */

    //----- Change username
    if (creds.username !== currentUser.username)
      if (validateUsername(creds.username)) {
        if (!(await User.findOne({ username: creds.username }))) {
          if (creds.username != currentUser.username) {
            // if OK change the username
            currentUser.username = creds.username
          } else {
            errors.push({ constraints: { username: 'Username is the same!' } })
          }
        } else {
          errors.push({ constraints: { username: 'Username is already in use!' } })
        }
      } else {
        errors.push({
          constraints: {
            username: 'Username is invalid! (must contain only letters and numbers and the length should be 3 to 32)',
          },
        })
      }

    //----- Change password
    // check if changes made
    if (creds.oldPassword != '' && creds.newPassword != '')
      if (await verify(currentUser.password, creds.oldPassword)) {
        if (creds.oldPassword !== creds.newPassword) {
          currentUser.password = await hash(creds.newPassword)
        } else {
          errors.push({ constraints: { passwordsMatch: "New password shouldn't match with the old one!" } })
        }
      } else {
        errors.push({ constraints: { password: 'Password does not match with the current one!' } })
      }

    //----- Save the user
    if (errors.length === 0) {
      await currentUser.save()
      return { success: 'Account details successfully updated' }
    } else {
      response.status(400)
      return { errors: errors }
    }
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

  // Access current payload
  async payload(request: Request, response: Response, next: NextFunction) {
    const token = (request.headers['authorization'] || '').split(' ')[1] || ''

    if (!token) {
      response.status(401)
      return { error: 'No authorization header' }
    }

    let payload = null
    try {
      payload = verifyJWT(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    } catch (error) {
      response.status(400)
      return error
    }

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
