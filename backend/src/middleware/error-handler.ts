import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { logger } from './logger.js';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    const body: Record<string, unknown> = {
      status: 'error',
      message: err.message,
    };
    if (err instanceof ValidationError && err.errors) {
      body.errors = err.errors;
    }
    return res.status(err.statusCode).json(body);
  }

  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(500).json({ status: 'error', message });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
