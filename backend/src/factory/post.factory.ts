import { Post } from '@/entity/Post'
import { User } from '@/entity/User'
import { datatype, lorem } from 'faker'
import { define, factory } from 'typeorm-seeding'

define(Post, () => {
  const post = new Post()
  post.title = lorem.words(3)
  post.text = lorem.text(25)
  post.karma = datatype.number({ min: 0, max: 743 })
  post.user = factory(User)() as any
  return post
})
