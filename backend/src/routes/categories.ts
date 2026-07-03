import { Router } from 'express';
import { CategoryService } from '../services/category.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../schemas/item.schema.js';
import { ApiResponse } from '../utils/api-response.js';

export const categoriesRouter = Router();

categoriesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const service = new CategoryService(req.orm.em.fork());
    const categories = await service.findAll(req.user!.userId);
    ApiResponse.success(res, categories);
  }),
);

categoriesRouter.post(
  '/',
  validate(createCategorySchema),
  asyncHandler(async (req, res) => {
    const service = new CategoryService(req.orm.em.fork());
    const category = await service.create(req.user!.userId, req.body);
    ApiResponse.created(res, category);
  }),
);

categoriesRouter.put(
  '/:id',
  validate(updateCategorySchema),
  asyncHandler(async (req, res) => {
    const service = new CategoryService(req.orm.em.fork());
    const category = await service.update(req.user!.userId, parseInt(req.params.id), req.body);
    ApiResponse.success(res, category);
  }),
);

categoriesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const service = new CategoryService(req.orm.em.fork());
    await service.delete(req.user!.userId, parseInt(req.params.id));
    ApiResponse.noContent(res);
  }),
);
