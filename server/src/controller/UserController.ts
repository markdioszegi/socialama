import { hash, verify } from 'argon2'
import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import { getUserWithPassword } from '../utils/authUtils'
import { paginate } from '../utils/controllerUtils'
import { validateUsername } from '../utils/customValidator'
import { verify as verifyJWT } from 'jsonwebtoken'

export class UserController {
  //private userRepository = getRepository(User)

  // Register a user
  async create(request: Request, response: Response, next: NextFunction) {
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

  async all(request: Request, response: Response, next: NextFunction) {
    return paginate(request, response, { model: User })
  }

  // Get one by ID
  async one(request: Request, response: Response, next: NextFunction) {
    //console.log(request.params.userId)

    const user = await User.findOne(request.params.userId)
    if (!user) {
      response.status(404)
      return { error: 'User not found' }
    }
    return user
  }

  // Update profile creds
  async update(request: Request, response: Response, next: NextFunction) {
    const payload = response.locals.payload
    const errors: Array<Object> = []

    // Get current user with password
    const currentUser = await getUserWithPassword(payload.email)

    //console.log(currentUser)

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

  async hello(request: Request, response: Response, next: NextFunction) {
    return { msg: 'You are authenticated and role checked! 😉' }
  }
}
