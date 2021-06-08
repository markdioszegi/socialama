import { Post } from "@/entity/Post";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export default class CreatePosts implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Post)().createMany(50)
  }
}