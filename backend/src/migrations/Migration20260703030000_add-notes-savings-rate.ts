import { Migration } from '@mikro-orm/migrations';

export class AddNotesSavingsRate extends Migration {
  async up(): Promise<void> {
    this.addSql('ALTER TABLE "item" ADD COLUMN "notes" VARCHAR(255) NULL;');
    this.addSql('ALTER TABLE "user" ADD COLUMN "savings_rate" INTEGER NOT NULL DEFAULT 50;');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "item" DROP COLUMN "notes";');
    this.addSql('ALTER TABLE "user" DROP COLUMN "savings_rate";');
  }
}
