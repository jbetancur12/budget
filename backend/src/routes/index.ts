import { type Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authRouter } from './auth.js';
import { itemsRouter } from './items.js';
import { pocketsRouter } from './pockets.js';
import { chartRouter } from './chart.js';
import { closeMonthRouter } from './close-month.js';

export function mountRoutes(router: Router, prefix = '/api') {
  // Auth routes are public
  router.use(`${prefix}/auth`, authRouter);

  // All other API routes require authentication
  router.use(`${prefix}/items`, authenticate, itemsRouter);
  router.use(`${prefix}/pockets`, authenticate, pocketsRouter);
  router.use(`${prefix}/chart`, authenticate, chartRouter);
  router.use(`${prefix}/close-month`, authenticate, closeMonthRouter);
}
