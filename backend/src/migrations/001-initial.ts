import { Migration } from '@mikro-orm/migrations';

export class InitialMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "item" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "amount" INTEGER NOT NULL DEFAULT 0,
        "type" VARCHAR(10) NOT NULL CHECK ("type" IN ('Fijo', 'Variable')),
        "category" VARCHAR(20) NOT NULL CHECK ("category" IN ('income', 'services', 'loans', 'variable')),
        "month_offset" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "pocket" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "balance" INTEGER NOT NULL DEFAULT 0,
        "goal" INTEGER NOT NULL DEFAULT 0,
        "color" VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
        "icon" VARCHAR(20) NOT NULL DEFAULT 'Shield' CHECK ("icon" IN ('Shield', 'Plane', 'TrendingUp', 'BookOpen')),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "monthly_history" (
        "id" SERIAL PRIMARY KEY,
        "month_offset" INTEGER NOT NULL,
        "month_label" VARCHAR(20) NOT NULL,
        "total_income" INTEGER NOT NULL DEFAULT 0,
        "total_expenses" INTEGER NOT NULL DEFAULT 0,
        "savings" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "item" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "pocket" CASCADE;');
    this.addSql('DROP TABLE IF EXISTS "monthly_history" CASCADE;');
  }
}
