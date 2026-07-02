import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

export type PocketIcon = 'Shield' | 'Plane' | 'TrendingUp' | 'BookOpen';

@Entity()
export class Pocket {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ default: 0 })
  balance!: number;

  @Property({ default: 0 })
  goal!: number;

  @Property({ default: '#3B82F6' })
  color!: string;

  @Property({ type: 'string', default: 'Shield' })
  icon!: PocketIcon;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt!: Date;
}
