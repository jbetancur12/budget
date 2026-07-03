import { Router } from 'express';
import { asyncHandler } from '../middleware/error-handler.js';
import { ApiResponse } from '../utils/api-response.js';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/User.js';
import { NotFoundError } from '../utils/errors.js';

export const settingsRouter = Router();

settingsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const em: EntityManager = req.orm.em.fork();
    const user = await em.findOne(User, req.user!.userId);
    if (!user) throw new NotFoundError('User not found');
    ApiResponse.success(res, { savingsRate: user.savingsRate });
  }),
);

settingsRouter.put(
  '/',
  asyncHandler(async (req, res) => {
    const em: EntityManager = req.orm.em.fork();
    const user = await em.findOne(User, req.user!.userId);
    if (!user) throw new NotFoundError('User not found');
    const { savingsRate } = req.body;
    if (typeof savingsRate === 'number' && savingsRate >= 0 && savingsRate <= 100) {
      user.savingsRate = savingsRate;
      await em.flush();
    }
    ApiResponse.success(res, { savingsRate: user.savingsRate });
  }),
);
