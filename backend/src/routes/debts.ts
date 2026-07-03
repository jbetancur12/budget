import { Router } from 'express';
import { z } from 'zod';
import { DebtService } from '../services/debt.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import { ApiResponse } from '../utils/api-response.js';

const createDebtSchema = z.object({
  body: z.object({
    person: z.string().min(1, 'Person name is required'),
    type: z.enum(['lent', 'borrowed']),
    originalAmount: z.number().int().positive(),
    notes: z.string().optional(),
  }),
});

const paymentSchema = z.object({
  body: z.object({
    amount: z.number().int().positive(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
});

export const debtsRouter = Router();

debtsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const service = new DebtService(req.orm.em.fork());
    const debts = await service.findAll(req.user!.userId);
    ApiResponse.success(res, debts);
  }),
);

debtsRouter.post(
  '/',
  validate(createDebtSchema),
  asyncHandler(async (req, res) => {
    const service = new DebtService(req.orm.em.fork());
    const debt = await service.create(req.user!.userId, req.body);
    ApiResponse.created(res, debt);
  }),
);

debtsRouter.post(
  '/:id/payment',
  validate(paymentSchema),
  asyncHandler(async (req, res) => {
    const service = new DebtService(req.orm.em.fork());
    const debt = await service.recordPayment(
      req.user!.userId,
      parseInt(req.params.id),
      req.body.amount,
    );
    ApiResponse.success(res, debt);
  }),
);

debtsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const service = new DebtService(req.orm.em.fork());
    await service.delete(req.user!.userId, parseInt(req.params.id));
    ApiResponse.noContent(res);
  }),
);
