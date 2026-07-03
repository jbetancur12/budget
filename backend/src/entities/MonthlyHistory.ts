import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { User } from './User.js';

@Entity()
export class MonthlyHistory {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  monthOffset!: number;

  @Property()
  monthLabel!: string;

  @Property({ default: 0 })
  totalIncome!: number;

  @Property({ default: 0 })
  totalExpenses!: number;

  @Property({ default: 0 })
  savings!: number;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
