import { internet, random, lorem } from 'faker'
import { User } from '../entity/User'
import { Post } from '../entity/Post'
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

export const createPosts = async (count: number) => {
  for (const _ of Array.from({ length: count })) {
    const post = new Post()
    post.title = lorem.words(3)
    post.text = lorem.text(25)
    post.karma = random.number({ min: 0, max: 743 })
    post.user = (await User.find())[random.number({ min: 0, max: await User.count() })]
    await post.save()
  }
}
