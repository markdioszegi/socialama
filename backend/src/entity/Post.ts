import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { MinLength, MaxLength } from 'class-validator'
import { ExtendedBaseEntity } from './ExtendedBaseEntity'
import { User } from './User'

@Entity({ name: 'posts' })
export class Post extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @MinLength(3, {
    message: 'Title is too short. Minimum length is $constraint1 characters.',
  })
  @MaxLength(128, {
    message: 'Title is too long. Maximum length is $constraint1 characters.',
  })
  title: string

  @MinLength(3, {
    message: 'Text is too short. Minimum length is $constraint1 characters.',
  })
  @MaxLength(1024, {
    message: 'Text is too long. Maximum length is $constraint1 characters.',
  })
  @Column({ type: 'mediumtext' })
  text: string

  @Column({ default: 0 })
  karma: number

  // Relations

  @ManyToOne((type) => User, (user) => user.posts)
  //@JoinColumn({ name: 'user_id' }) // Name in the database
  user: User

  @Column()
  user_id: number
}
