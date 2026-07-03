import { Migration } from '@mikro-orm/migrations';

export class AddItemDate extends Migration {
  async up(): Promise<void> {
    this.addSql('ALTER TABLE "item" ADD COLUMN "date" DATE NOT NULL DEFAULT CURRENT_DATE;');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "item" DROP COLUMN "date";');
  }
}
