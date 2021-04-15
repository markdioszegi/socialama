import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

/**
 * BaseEntity with extended columns.
 */
export abstract class ExtendedBaseEntity extends BaseEntity {
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
