import { Migration } from '@mikro-orm/migrations';

export class AddRecurringSearch extends Migration {
  async up(): Promise<void> {
    this.addSql('ALTER TABLE "item" ADD COLUMN "recurring" BOOLEAN NOT NULL DEFAULT false;');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "item" DROP COLUMN "recurring";');
  }
}
