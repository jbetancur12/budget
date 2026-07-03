import { Migration } from '@mikro-orm/migrations';

export class AddDebts extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "debt" (
        "id" SERIAL PRIMARY KEY,
        "person" VARCHAR(255) NOT NULL,
        "type" VARCHAR(10) NOT NULL CHECK ("type" IN ('lent', 'borrowed')),
        "original_amount" INTEGER NOT NULL DEFAULT 0,
        "remaining_balance" INTEGER NOT NULL DEFAULT 0,
        "notes" VARCHAR(255) NULL,
        "user_id" INTEGER NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    this.addSql('CREATE INDEX IF NOT EXISTS "debt_user_id_index" ON "debt" ("user_id");');
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "debt" CASCADE;');
  }
}
