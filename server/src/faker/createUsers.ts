import { internet, random } from 'faker'
import { User } from '../entity/User'
import { hash } from 'argon2'

export const createUsers = async (count: number) => {
  for (const _ of Array.from({ length: count })) {
    const user = new User()
    user.username = internet.userName()
    user.email = internet.email()
    user.password = await hash(internet.password())
    user.isActive = random.arrayElement([true, false])
    await user.save()
  }
}
