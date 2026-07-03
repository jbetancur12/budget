import { EntityManager } from '@mikro-orm/core';
import { Debt } from '../entities/Debt.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class DebtService {
  constructor(private em: EntityManager) {}

  async findAll(userId: number) {
    return this.em.find(Debt, { user: userId }, { orderBy: { createdAt: 'DESC' } });
  }

  async create(
    userId: number,
    data: { person: string; type: 'lent' | 'borrowed'; originalAmount: number; notes?: string },
  ) {
    const debt = this.em.create(Debt, {
      person: data.person,
      type: data.type,
      originalAmount: data.originalAmount,
      remainingBalance: data.originalAmount,
      notes: data.notes,
      user: userId,
    } as never);
    await this.em.flush();
    return debt;
  }

  async recordPayment(userId: number, id: number, amount: number) {
    const debt = await this.em.findOne(Debt, { id, user: userId });
    if (!debt) throw new NotFoundError('Debt not found');
    if (amount <= 0) throw new BadRequestError('Amount must be positive');
    if (amount > debt.remainingBalance)
      throw new BadRequestError('Amount exceeds remaining balance');

    debt.remainingBalance -= amount;
    await this.em.flush();
    return debt;
  }

  async delete(userId: number, id: number) {
    const debt = await this.em.findOne(Debt, { id, user: userId });
    if (!debt) throw new NotFoundError('Debt not found');
    await this.em.remove(debt).flush();
  }
}
