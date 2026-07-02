import { Router } from 'express';
import { ChartService } from '../services/chart.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { ApiResponse } from '../utils/api-response.js';

export const chartRouter = Router();

chartRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const service = new ChartService(req.orm.em.fork());
    const history = await service.getHistory();
    ApiResponse.success(res, history);
  }),
);
