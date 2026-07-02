import { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import { config } from '../config/index.js';

export const logger = pino({
  level: config.logLevel,
  ...(config.isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });
  });

  next();
};
