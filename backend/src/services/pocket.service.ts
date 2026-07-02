import { EntityManager } from '@mikro-orm/core';
import { Pocket } from '../entities/Pocket.js';
import type { PocketIcon } from '../entities/Pocket.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

interface CreatePocketData {
  name: string;
  goal?: number;
  color?: string;
  icon?: PocketIcon;
}

interface UpdatePocketData {
  name?: string;
  goal?: number;
  color?: string;
  icon?: PocketIcon;
  balance?: number;
}

export class PocketService {
  constructor(private em: EntityManager) {}

  async findAll() {
    return this.em.find(Pocket, {}, { orderBy: { id: 'ASC' } });
  }

  async create(data: CreatePocketData) {
    const pocket = this.em.create(Pocket, {
      name: data.name,
      goal: data.goal ?? 0,
      color: data.color ?? '#3B82F6',
      icon: data.icon ?? 'Shield',
    } as never);
    await this.em.flush();
    return pocket;
  }

  async update(id: number, data: UpdatePocketData) {
    const pocket = await this.em.findOne(Pocket, id);
    if (!pocket) throw new NotFoundError('Pocket not found');
    this.em.assign(pocket, data);
    await this.em.flush();
    return pocket;
  }

  async delete(id: number) {
    const pocket = await this.em.findOne(Pocket, id);
    if (!pocket) throw new NotFoundError('Pocket not found');
    await this.em.remove(pocket).flush();
  }

  async transfer(id: number, amount: number) {
    const pocket = await this.em.findOne(Pocket, id);
    if (!pocket) throw new NotFoundError('Pocket not found');
    if (amount === 0) throw new BadRequestError('Amount must be non-zero');
    if (amount < 0 && pocket.balance + amount < 0) {
      throw new BadRequestError('Insufficient balance');
    }
    pocket.balance += amount;
    await this.em.flush();
    return pocket;
  }
}
