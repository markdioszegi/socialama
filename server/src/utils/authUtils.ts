import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { User } from '../entity/User'

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id, username: user.username, email: user.email }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
  })
}

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, username: user.username, email: user.email, tokenVersion: user.tokenVersion },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    }
  )
}

export const sendRefreshToken = (res: Response, token: String) => {
  res.cookie('jid', token, { httpOnly: true })
}

/**
 * Get a user with password by email
 * @param email The user's email
 * @returns {User} A user with password
 */
export const getUserWithPassword = async (email) => {
  return await User.createQueryBuilder()
    .addSelect('User.password AS User_password')
    .where('email = :email', { email: email })
    .getOne()
}
