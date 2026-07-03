import { EntityManager } from '@mikro-orm/core';
import { Item } from '../entities/Item.js';
import { NotFoundError } from '../utils/errors.js';

interface ItemQuery {
  category?: string;
  monthOffset?: number;
  search?: string;
}

interface CreateItemData {
  name: string;
  amount?: number;
  type?: Item['type'];
  category: Item['category'];
  monthOffset?: number;
  date?: string;
  recurring?: boolean;
}

interface UpdateItemData {
  name?: string;
  amount?: number;
  type?: Item['type'];
  recurring?: boolean;
}

export class ItemService {
  constructor(private em: EntityManager) {}

  async findAll(userId: number, query: ItemQuery) {
    const where: Record<string, unknown> = { user: userId };
    if (query.category) where.category = query.category;
    if (query.monthOffset !== undefined) where.monthOffset = query.monthOffset;
    if (query.search) where.name = { $ilike: `%${query.search}%` };
    return this.em.find(Item, where, { orderBy: { date: 'DESC' } });
  }

  async create(userId: number, data: CreateItemData) {
    const item = this.em.create(Item, {
      name: data.name,
      amount: data.amount ?? 0,
      type: data.type ?? 'Variable' as const,
      category: data.category,
      monthOffset: data.monthOffset ?? 0,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      recurring: data.recurring ?? false,
      user: userId,
    } as never);
    await this.em.flush();
    return item;
  }

  async update(userId: number, id: number, data: UpdateItemData) {
    const item = await this.em.findOne(Item, { id, user: userId });
    if (!item) throw new NotFoundError('Item not found');
    this.em.assign(item, data);
    await this.em.flush();
    return item;
  }

  async delete(userId: number, id: number) {
    const item = await this.em.findOne(Item, { id, user: userId });
    if (!item) throw new NotFoundError('Item not found');
    await this.em.remove(item).flush();
  }
}
