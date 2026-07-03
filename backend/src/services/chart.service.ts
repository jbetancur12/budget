import { EntityManager } from '@mikro-orm/core';
import { MonthlyHistory } from '../entities/MonthlyHistory.js';

export class ChartService {
  constructor(private em: EntityManager) {}

  async getHistory(userId: number) {
    return this.em.find(MonthlyHistory, { user: userId }, {
      orderBy: { monthOffset: 'ASC' },
    });
  }
}
