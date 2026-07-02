import { type Router } from 'express';
import { itemsRouter } from './items.js';
import { pocketsRouter } from './pockets.js';
import { chartRouter } from './chart.js';
import { closeMonthRouter } from './close-month.js';

export function mountRoutes(router: Router, prefix = '/api') {
  router.use(`${prefix}/items`, itemsRouter);
  router.use(`${prefix}/pockets`, pocketsRouter);
  router.use(`${prefix}/chart`, chartRouter);
  router.use(`${prefix}/close-month`, closeMonthRouter);
}
