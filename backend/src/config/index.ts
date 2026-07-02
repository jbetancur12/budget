import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  logLevel: process.env.LOG_LEVEL || 'info',

  db: {
    name: process.env.DB_NAME || 'presupuesto',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'budget',
    password: process.env.DB_PASSWORD || 'budget123',
  },

  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
};
