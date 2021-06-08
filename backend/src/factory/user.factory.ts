import { User } from '@/entity/User'
import { hash } from 'argon2'
import { internet, random } from 'faker'
import { define } from 'typeorm-seeding'

define(User, () => {
  const user = new User()
  user.username = internet.userName()
  user.email = internet.email()
  user.password = internet.password()
  user.isActive = random.arrayElement([true, false])
  return user
})
