import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class MonthlyHistory {
  @PrimaryKey()
  id!: number;

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
