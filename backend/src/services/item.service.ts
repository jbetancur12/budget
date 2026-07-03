import { EntityManager } from '@mikro-orm/core';
import { Item } from '../entities/Item.js';
import { Category } from '../entities/Category.js';
import { NotFoundError } from '../utils/errors.js';

interface ItemQuery {
  categoryId?: number;
  monthOffset?: number;
  search?: string;
}

interface CreateItemData {
  name: string;
  amount?: number;
  type?: Item['type'];
  categoryId: number;
  monthOffset?: number;
  date?: string;
  recurring?: boolean;
}

interface UpdateItemData {
  name?: string;
  amount?: number;
  type?: Item['type'];
  recurring?: boolean;
  categoryId?: number;
  date?: string;
}

export class ItemService {
  constructor(private em: EntityManager) {}

  async findAll(userId: number, query: ItemQuery) {
    const where: Record<string, unknown> = { user: userId };
    if (query.categoryId !== undefined) where.category = query.categoryId;
    if (query.monthOffset !== undefined) where.monthOffset = query.monthOffset;
    if (query.search) where.name = { $ilike: `%${query.search}%` };

    const items = await this.em.find(Item, where, { orderBy: { date: 'DESC' }, populate: ['category'] });

    // Auto-populate recurring items when navigating to an empty month
    if (items.length === 0 && query.monthOffset !== undefined && !query.search) {
      const recurring = await this.em.find(Item, { user: userId, recurring: true }, { populate: ['category'] });
      const existingNames = new Set<string>();
      let created = false;

      for (const r of recurring) {
        if (!existingNames.has(r.name)) {
          existingNames.add(r.name);
          this.em.create(Item, {
            name: r.name,
            amount: r.amount,
            type: r.type,
            category: r.category.id,
            monthOffset: query.monthOffset,
            user: userId,
            date: new Date().toISOString().slice(0, 10),
            recurring: true,
          } as never);
          created = true;
        }
      }

      if (created) {
        await this.em.flush();
        return this.em.find(Item, where, { orderBy: { date: 'DESC' }, populate: ['category'] });
      }
    }

    return items;
  }

  async create(userId: number, data: CreateItemData) {
    const category = await this.em.findOne(Category, { id: data.categoryId, user: userId });
    if (!category) throw new NotFoundError('Category not found');

    const item = this.em.create(Item, {
      name: data.name,
      amount: data.amount ?? 0,
      type: data.type ?? ('Variable' as const),
      category: category.id,
      monthOffset: data.monthOffset ?? 0,
      date: data.date ?? new Date().toISOString().slice(0, 10),
      recurring: data.recurring ?? false,
      user: userId,
    } as never);
    await this.em.flush();
    return item;
  }

  async update(userId: number, id: number, data: UpdateItemData) {
    const item = await this.em.findOne(Item, { id, user: userId }, { populate: ['category'] });
    if (!item) throw new NotFoundError('Item not found');

    if (data.categoryId) {
      const category = await this.em.findOne(Category, { id: data.categoryId, user: userId });
      if (!category) throw new NotFoundError('Category not found');
      item.category = category;
    }

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
