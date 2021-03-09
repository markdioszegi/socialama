import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export abstract class ExtendedBaseEntity extends BaseEntity {
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
