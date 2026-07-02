import { EntityManager } from '@mikro-orm/core';
import { Item } from '../entities/Item.js';
import { NotFoundError } from '../utils/errors.js';

interface ItemQuery {
  category?: string;
  monthOffset?: number;
}

interface CreateItemData {
  name: string;
  amount?: number;
  type?: Item['type'];
  category: Item['category'];
  monthOffset?: number;
}

interface UpdateItemData {
  name?: string;
  amount?: number;
  type?: Item['type'];
}

export class ItemService {
  constructor(private em: EntityManager) {}

  async findAll(query: ItemQuery) {
    const where: Record<string, string | number> = {};
    if (query.category) where.category = query.category;
    if (query.monthOffset !== undefined) where.monthOffset = query.monthOffset;
    return this.em.find(Item, where, { orderBy: { id: 'ASC' } });
  }

  async create(data: CreateItemData) {
    const item = this.em.create(Item, {
      name: data.name,
      amount: data.amount ?? 0,
      type: data.type ?? 'Variable' as const,
      category: data.category,
      monthOffset: data.monthOffset ?? 0,
    } as never);
    await this.em.flush();
    return item;
  }

  async update(id: number, data: UpdateItemData) {
    const item = await this.em.findOne(Item, id);
    if (!item) throw new NotFoundError('Item not found');
    this.em.assign(item, data);
    await this.em.flush();
    return item;
  }

  async delete(id: number) {
    const item = await this.em.findOne(Item, id);
    if (!item) throw new NotFoundError('Item not found');
    await this.em.remove(item).flush();
  }
}
