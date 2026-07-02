import { EntityManager } from '@mikro-orm/core';
import { MonthlyHistory } from '../entities/MonthlyHistory.js';

export class ChartService {
  constructor(private em: EntityManager) {}

  async getHistory() {
    return this.em.find(MonthlyHistory, {}, {
      orderBy: { monthOffset: 'ASC' },
    });
  }
}
