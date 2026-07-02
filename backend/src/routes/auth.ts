import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, changePasswordSchema, refreshSchema } from '../schemas/auth.schema.js';
import { ApiResponse } from '../utils/api-response.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many attempts. Try again later.' },
});

export const authRouter = Router();

authRouter.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const service = new AuthService(req.orm.em.fork());
    const result = await service.login(req.body.email, req.body.password);
    ApiResponse.success(res, result);
  }),
);

authRouter.post(
  '/refresh',
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const service = new AuthService(req.orm.em.fork());
    const tokens = await service.refresh(req.body.refreshToken);
    ApiResponse.success(res, tokens);
  }),
);

authRouter.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const service = new AuthService(req.orm.em.fork());
    await service.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
    ApiResponse.success(res, { ok: true });
  }),
);

authRouter.post(
  '/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    const service = new AuthService(req.orm.em.fork());
    await service.logout(req.user!.userId);
    ApiResponse.success(res, { ok: true });
  }),
);
