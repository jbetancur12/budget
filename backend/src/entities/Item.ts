import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { User } from './User.js';
import { Category } from './Category.js';

@Entity()
export class Item {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Category)
  category!: Category;

  @Property()
  name!: string;

  @Property()
  amount!: number;

  @Property({ type: 'string' })
  type!: 'Fijo' | 'Variable';

  @Property({ default: 0 })
  monthOffset!: number;

  @Property({ columnType: 'date', defaultRaw: 'CURRENT_DATE' })
  date!: string;

  @Property({ default: false })
  recurring!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt!: Date;
}
