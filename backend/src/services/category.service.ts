import { EntityManager } from '@mikro-orm/core';
import { Category } from '../entities/Category.js';
import { Item } from '../entities/Item.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class CategoryService {
  constructor(private em: EntityManager) {}

  async findAll(userId: number) {
    return this.em.find(Category, { user: userId }, { orderBy: { id: 'ASC' } });
  }

  async create(
    userId: number,
    data: { name: string; type: 'income' | 'expense'; budget?: number | null },
  ) {
    const category = this.em.create(Category, {
      name: data.name,
      type: data.type,
      budget: data.budget ?? null,
      user: userId,
    } as never);
    await this.em.flush();
    return category;
  }

  async update(userId: number, id: number, data: { name?: string; budget?: number | null }) {
    const category = await this.em.findOne(Category, { id, user: userId });
    if (!category) throw new NotFoundError('Category not found');
    this.em.assign(category, data);
    await this.em.flush();
    return category;
  }

  async delete(userId: number, id: number) {
    const category = await this.em.findOne(Category, { id, user: userId });
    if (!category) throw new NotFoundError('Category not found');

    const itemCount = await this.em.count(Item, { category: id, user: userId });
    if (itemCount > 0) {
      throw new BadRequestError(`No se puede eliminar: ${itemCount} item(s) usan esta categoría`);
    }

    await this.em.remove(category).flush();
  }
}
