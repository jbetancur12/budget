import { Migration } from '@mikro-orm/migrations';

export class AddUserRelations extends Migration {
  async up(): Promise<void> {
    this.addSql('ALTER TABLE "item" ADD COLUMN "user_id" INTEGER;');
    this.addSql('ALTER TABLE "pocket" ADD COLUMN "user_id" INTEGER;');
    this.addSql('ALTER TABLE "monthly_history" ADD COLUMN "user_id" INTEGER;');

    this.addSql('UPDATE "item" SET "user_id" = (SELECT "id" FROM "user" LIMIT 1);');
    this.addSql('UPDATE "pocket" SET "user_id" = (SELECT "id" FROM "user" LIMIT 1);');
    this.addSql('UPDATE "monthly_history" SET "user_id" = (SELECT "id" FROM "user" LIMIT 1);');

    this.addSql('ALTER TABLE "item" ALTER COLUMN "user_id" SET NOT NULL;');
    this.addSql('ALTER TABLE "pocket" ALTER COLUMN "user_id" SET NOT NULL;');
    this.addSql('ALTER TABLE "monthly_history" ALTER COLUMN "user_id" SET NOT NULL;');

    this.addSql('ALTER TABLE "item" ADD CONSTRAINT "item_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE;');
    this.addSql('ALTER TABLE "pocket" ADD CONSTRAINT "pocket_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE;');
    this.addSql('ALTER TABLE "monthly_history" ADD CONSTRAINT "monthly_history_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" (id) ON DELETE CASCADE;');

    this.addSql('CREATE INDEX IF NOT EXISTS "item_user_id_index" ON "item" ("user_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "pocket_user_id_index" ON "pocket" ("user_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "monthly_history_user_id_index" ON "monthly_history" ("user_id");');
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "item_user_id_index";');
    this.addSql('DROP INDEX IF EXISTS "pocket_user_id_index";');
    this.addSql('DROP INDEX IF EXISTS "monthly_history_user_id_index";');
    this.addSql('ALTER TABLE "item" DROP CONSTRAINT IF EXISTS "item_user_id_foreign";');
    this.addSql('ALTER TABLE "pocket" DROP CONSTRAINT IF EXISTS "pocket_user_id_foreign";');
    this.addSql('ALTER TABLE "monthly_history" DROP CONSTRAINT IF EXISTS "monthly_history_user_id_foreign";');
    this.addSql('ALTER TABLE "item" DROP COLUMN "user_id";');
    this.addSql('ALTER TABLE "pocket" DROP COLUMN "user_id";');
    this.addSql('ALTER TABLE "monthly_history" DROP COLUMN "user_id";');
  }
}
