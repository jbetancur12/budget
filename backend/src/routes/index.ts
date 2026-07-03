import { type Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authRouter } from './auth.js';
import { itemsRouter } from './items.js';
import { pocketsRouter } from './pockets.js';
import { chartRouter } from './chart.js';
import { closeMonthRouter } from './close-month.js';
import { categoriesRouter } from './categories.js';
import { settingsRouter } from './settings.js';

export function mountRoutes(router: Router, prefix = '/api') {
  router.use(`${prefix}/auth`, authRouter);
  router.use(`${prefix}/items`, authenticate, itemsRouter);
  router.use(`${prefix}/pockets`, authenticate, pocketsRouter);
  router.use(`${prefix}/chart`, authenticate, chartRouter);
  router.use(`${prefix}/close-month`, authenticate, closeMonthRouter);
  router.use(`${prefix}/categories`, authenticate, categoriesRouter);
  router.use(`${prefix}/settings`, authenticate, settingsRouter);
}
