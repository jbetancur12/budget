import { Router } from 'express';
import { PocketService } from '../services/pocket.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import {
  createPocketSchema,
  updatePocketSchema,
  transferSchema,
} from '../schemas/pocket.schema.js';
import { ApiResponse } from '../utils/api-response.js';

export const pocketsRouter = Router();

pocketsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const service = new PocketService(req.orm.em.fork());
    const pockets = await service.findAll(req.user!.userId);
    ApiResponse.success(res, pockets);
  }),
);

pocketsRouter.post(
  '/',
  validate(createPocketSchema),
  asyncHandler(async (req, res) => {
    const service = new PocketService(req.orm.em.fork());
    const pocket = await service.create(req.user!.userId, req.body);
    ApiResponse.created(res, pocket);
  }),
);

pocketsRouter.put(
  '/:id',
  validate(updatePocketSchema),
  asyncHandler(async (req, res) => {
    const service = new PocketService(req.orm.em.fork());
    const pocket = await service.update(req.user!.userId, parseInt(req.params.id), req.body);
    ApiResponse.success(res, pocket);
  }),
);

pocketsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const service = new PocketService(req.orm.em.fork());
    await service.delete(req.user!.userId, parseInt(req.params.id));
    ApiResponse.noContent(res);
  }),
);

pocketsRouter.post(
  '/:id/transfer',
  validate(transferSchema),
  asyncHandler(async (req, res) => {
    const service = new PocketService(req.orm.em.fork());
    const pocket = await service.transfer(req.user!.userId, parseInt(req.params.id), req.body.amount, req.body.monthOffset);
    ApiResponse.success(res, pocket);
  }),
);
