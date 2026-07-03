import { EntityManager } from '@mikro-orm/core';
import { Item } from '../entities/Item.js';
import { Pocket } from '../entities/Pocket.js';
import { MonthlyHistory } from '../entities/MonthlyHistory.js';

const SHORT_MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function shortMonth(offset: number): string {
  const rawIdx = 6 + offset;
  const idx = ((rawIdx % 12) + 12) % 12;
  return SHORT_MONTHS[idx];
}

interface CloseMonthInput {
  closeOption: string;
  pocketAmounts?: Record<string, number>;
  currentMonthOffset?: number;
}

export class CloseMonthService {
  constructor(private em: EntityManager) {}

  async execute(userId: number, data: CloseMonthInput) {
    const { closeOption, pocketAmounts, currentMonthOffset = 0 } = data;
    const nextOffset = currentMonthOffset + 1;

    const items = await this.em.find(Item, { monthOffset: currentMonthOffset, user: userId });
    const pockets = await this.em.find(Pocket, { user: userId });

    const totalIncome = items
      .filter((i) => i.category === 'income')
      .reduce((s, i) => s + i.amount, 0);
    const totalExpenses = items
      .filter((i) => i.category !== 'income')
      .reduce((s, i) => s + i.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savings = Math.round(balance * 0.5);

    this.em.create(MonthlyHistory, {
      monthOffset: currentMonthOffset,
      monthLabel: shortMonth(currentMonthOffset),
      totalIncome,
      totalExpenses,
      savings,
      user: userId,
    } as never);

    if (closeOption === 'distribute' && pocketAmounts) {
      for (const p of pockets) {
        const amount = pocketAmounts[String(p.id)];
        if (amount && amount > 0) {
          p.balance += amount;
        }
      }
      const distributed = Object.values(pocketAmounts).reduce((s, v) => s + v, 0);
      const leftover = savings - distributed;
      if (leftover > 0) {
        await this.upsertSaldoAnterior(userId, nextOffset, leftover);
      }
    } else {
      await this.upsertSaldoAnterior(userId, nextOffset, savings);
    }

    await this.copyItemsToNextMonth(userId, items, nextOffset);
    await this.em.flush();

    return { nextOffset };
  }

  private async upsertSaldoAnterior(userId: number, monthOffset: number, amount: number) {
    const existing = await this.em.findOne(Item, { name: 'Saldo Anterior', monthOffset, user: userId } as never);
    if (existing) {
      existing.amount += amount;
    } else {
      this.em.create(Item, {
        name: 'Saldo Anterior',
        amount,
        type: 'Fijo' as const,
        category: 'income' as const,
        monthOffset,
        user: userId,
      } as never);
    }
  }

  private async copyItemsToNextMonth(userId: number, items: Item[], nextOffset: number) {
    const nextMonthItems = await this.em.find(Item, { monthOffset: nextOffset, user: userId });
    const hasRealItems = nextMonthItems.some((i) => i.name !== 'Saldo Anterior');
    if (!hasRealItems) {
      for (const item of items) {
        if (item.name !== 'Saldo Anterior') {
          this.em.create(Item, {
            name: item.name,
            amount: item.amount,
            type: item.type,
            category: item.category,
            monthOffset: nextOffset,
            user: userId,
          } as never);
        }
      }
    }
  }
}
