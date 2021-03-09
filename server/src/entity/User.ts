import { Entity, PrimaryGeneratedColumn, Column, Not, BeforeInsert } from 'typeorm'
import { IsEmail, MinLength, MaxLength, IsAlphanumeric } from 'class-validator'
import { ExtendedBaseEntity } from './ExtendedBaseEntity'
import { IsUnique } from '../validators/IsUnique'
import { Request } from 'express'

@Entity({ name: 'users' })
export class User extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  @MinLength(3, {
    message: 'Name is too short. Minimum length is $constraint1 characters, but actual value is $value.',
  })
  @MaxLength(32, {
    message: 'Name is too long. Maximum length is $constraint1 characters, but actual value is $value.',
  })
  @IsAlphanumeric(undefined, { message: 'Username must contain only letters and numbers.' })
  @IsUnique(User)
  username: string

  @Column({ unique: true })
  @IsEmail({}, { message: 'Email must be a valid email!' })
  @IsUnique(User)
  email: string

  @Column({ select: false })
  password: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean

  @Column({ default: 0 })
  tokenVersion: number
}
