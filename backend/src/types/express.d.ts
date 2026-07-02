import type { MikroORM } from '@mikro-orm/core';

declare global {
  namespace Express {
    interface Request {
      orm: MikroORM;
    }
  }
}
