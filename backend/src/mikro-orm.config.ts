import 'reflect-metadata';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { Item } from './entities/Item.js';
import { Pocket } from './entities/Pocket.js';
import { MonthlyHistory } from './entities/MonthlyHistory.js';
import { User } from './entities/User.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  dbName: config.db.name,
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  entities: [Item, Pocket, MonthlyHistory, User],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: join(__dirname, 'migrations'),
    glob: '!(*.d).{js,ts}',
  },
});
