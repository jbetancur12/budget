import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { User } from './User.js';

@Entity()
export class Debt {
  @PrimaryKey()
  id!: number;

  @Property()
  person!: string;

  @Property({ type: 'string' })
  type!: 'lent' | 'borrowed';

  @Property()
  originalAmount!: number;

  @Property()
  remainingBalance!: number;

  @Property({ nullable: true })
  notes?: string;

  @ManyToOne(() => User)
  user!: User;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt!: Date;
}
