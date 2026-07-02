import 'reflect-metadata';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { config } from './config/index.js';
import { Item } from './entities/Item.js';
import { Pocket } from './entities/Pocket.js';
import { MonthlyHistory } from './entities/MonthlyHistory.js';
import { User } from './entities/User.js';

export default defineConfig({
  dbName: config.db.name,
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  entities: [Item, Pocket, MonthlyHistory, User],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
});
