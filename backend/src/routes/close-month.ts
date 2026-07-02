import { Router } from 'express';
import { CloseMonthService } from '../services/close-month.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import { closeMonthSchema } from '../schemas/close-month.schema.js';
import { ApiResponse } from '../utils/api-response.js';

export const closeMonthRouter = Router();

closeMonthRouter.post(
  '/',
  validate(closeMonthSchema),
  asyncHandler(async (req, res) => {
    const service = new CloseMonthService(req.orm.em.fork());
    const result = await service.execute(req.body);
    ApiResponse.success(res, result);
  }),
);
