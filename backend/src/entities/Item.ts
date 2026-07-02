import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class Item {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  amount!: number;

  @Property({ type: 'string' })
  type!: 'Fijo' | 'Variable';

  @Property()
  category!: 'income' | 'services' | 'loans' | 'variable';

  @Property({ default: 0 })
  monthOffset!: number;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt!: Date;
}
