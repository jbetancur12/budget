import { Migration } from '@mikro-orm/migrations';

export class AddCategories extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "category" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "type" VARCHAR(10) NOT NULL CHECK ("type" IN ('income', 'expense')),
        "user_id" INTEGER NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`CREATE INDEX IF NOT EXISTS "category_user_id_index" ON "category" ("user_id");`);

    this.addSql(`
      INSERT INTO "category" ("name", "type", "user_id")
      SELECT 'Ingresos', 'income', "id" FROM "user"
      WHERE NOT EXISTS (
        SELECT 1 FROM "category" WHERE "category"."name" = 'Ingresos' AND "category"."user_id" = "user"."id"
      );
    `);
    this.addSql(`
      INSERT INTO "category" ("name", "type", "user_id")
      SELECT 'Servicios', 'expense', "id" FROM "user"
      WHERE NOT EXISTS (
        SELECT 1 FROM "category" WHERE "category"."name" = 'Servicios' AND "category"."user_id" = "user"."id"
      );
    `);
    this.addSql(`
      INSERT INTO "category" ("name", "type", "user_id")
      SELECT 'Préstamos', 'expense', "id" FROM "user"
      WHERE NOT EXISTS (
        SELECT 1 FROM "category" WHERE "category"."name" = 'Préstamos' AND "category"."user_id" = "user"."id"
      );
    `);
    this.addSql(`
      INSERT INTO "category" ("name", "type", "user_id")
      SELECT 'Variables', 'expense', "id" FROM "user"
      WHERE NOT EXISTS (
        SELECT 1 FROM "category" WHERE "category"."name" = 'Variables' AND "category"."user_id" = "user"."id"
      );
    `);

    this.addSql('ALTER TABLE "item" ADD COLUMN "category_id" INTEGER;');

    this.addSql(`
      UPDATE "item" SET "category_id" = (
        SELECT "id" FROM "category"
        WHERE "category"."user_id" = "item"."user_id"
          AND "category"."name" = CASE "item"."category"
            WHEN 'income' THEN 'Ingresos'
            WHEN 'services' THEN 'Servicios'
            WHEN 'loans' THEN 'Préstamos'
            WHEN 'variable' THEN 'Variables'
          END
        LIMIT 1
      );
    `);

    this.addSql('ALTER TABLE "item" ALTER COLUMN "category_id" SET NOT NULL;');
    this.addSql('ALTER TABLE "item" DROP COLUMN "category";');
    this.addSql('ALTER TABLE "item" ADD CONSTRAINT "item_category_id_foreign" FOREIGN KEY ("category_id") REFERENCES "category" (id) ON DELETE RESTRICT;');
    this.addSql('CREATE INDEX IF NOT EXISTS "item_category_id_index" ON "item" ("category_id");');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "item" DROP CONSTRAINT IF EXISTS "item_category_id_foreign";');
    this.addSql('DROP INDEX IF EXISTS "item_category_id_index";');
    this.addSql('ALTER TABLE "item" ADD COLUMN "category" VARCHAR(20);');
    this.addSql(`
      UPDATE "item" SET "category" = (
        SELECT CASE "category"."name"
          WHEN 'Ingresos' THEN 'income'
          WHEN 'Servicios' THEN 'services'
          WHEN 'Préstamos' THEN 'loans'
          WHEN 'Variables' THEN 'variable'
        END
        FROM "category" WHERE "category"."id" = "item"."category_id"
      );
    `);
    this.addSql('ALTER TABLE "item" ALTER COLUMN "category" SET NOT NULL;');
    this.addSql('ALTER TABLE "item" DROP COLUMN "category_id";');
    this.addSql('DROP TABLE IF EXISTS "category" CASCADE;');
  }
}
