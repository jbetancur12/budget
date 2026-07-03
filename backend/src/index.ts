import { createApp } from './app.js';
import { config } from './config/index.js';
import { initORM } from './db.js';
import { logger } from './middleware/logger.js';

async function main() {
  const orm = await initORM();

  const app = createApp(orm);

  const server = app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await orm.close().catch(() => {});
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error(
    { error: (err as Error).message, stack: (err as Error).stack },
    'Failed to start server',
  );
  process.exit(1);
});
