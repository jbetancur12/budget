import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { User } from './User.js';

@Entity()
export class Category {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'string' })
  type!: 'income' | 'expense';

  @ManyToOne(() => User)
  user!: User;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt!: Date;
}
