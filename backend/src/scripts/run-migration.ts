import 'dotenv/config';
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config.js';

(async () => {
  console.log('Running migrations...');
  const orm = await MikroORM.init(config);

  try {
    const migrator = orm.getMigrator();

    const pending = await migrator.getPendingMigrations();
    const executed = await migrator.getExecutedMigrations();
    console.log(`Pending: ${pending.length}, Executed: ${executed.length}`);

    if (pending.length > 0) {
      await migrator.up();
      console.log('Migrations executed successfully.');
    } else {
      console.log('No pending migrations.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await orm.close(true);
  }
})();
