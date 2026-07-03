import { Router } from 'express';
import { ItemService } from '../services/item.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import { createItemSchema, updateItemSchema, getItemsSchema } from '../schemas/item.schema.js';
import { ApiResponse } from '../utils/api-response.js';

export const itemsRouter = Router();

itemsRouter.get('/', validate(getItemsSchema), asyncHandler(async (req, res) => {
  const service = new ItemService(req.orm.em.fork());
  const query: { category?: string; monthOffset?: number } = {};
  if (typeof req.query.category === 'string') query.category = req.query.category;
  if (typeof req.query.monthOffset === 'string') query.monthOffset = parseInt(req.query.monthOffset);
  const items = await service.findAll(req.user!.userId, query);
  ApiResponse.success(res, items);
}));

itemsRouter.post('/', validate(createItemSchema), asyncHandler(async (req, res) => {
  const service = new ItemService(req.orm.em.fork());
  const item = await service.create(req.user!.userId, req.body);
  ApiResponse.created(res, item);
}));

itemsRouter.put('/:id', validate(updateItemSchema), asyncHandler(async (req, res) => {
  const service = new ItemService(req.orm.em.fork());
  const item = await service.update(req.user!.userId, parseInt(req.params.id), req.body);
  ApiResponse.success(res, item);
}));

itemsRouter.delete('/:id', asyncHandler(async (req, res) => {
  const service = new ItemService(req.orm.em.fork());
  await service.delete(req.user!.userId, parseInt(req.params.id));
  ApiResponse.noContent(res);
}));
