import { query } from 'express'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class createUsersTable1610110812662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //await queryRunner.createTable()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
