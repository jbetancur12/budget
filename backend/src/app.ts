import 'reflect-metadata';
import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import type { MikroORM } from '@mikro-orm/core';
import { config } from './config/index.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { mountRoutes } from './routes/index.js';

export function createApp(orm: MikroORM): Express {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors({ origin: config.cors.origins }));
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Logging
  app.use(requestLogger);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Inject ORM into request
  app.use((req, _res, next) => {
    req.orm = orm;
    next();
  });

  // API routes
  mountRoutes(app);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
