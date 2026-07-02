import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';

export async function initORM() {
  return MikroORM.init(config);
}
