import { Migration } from '@mikro-orm/migrations';

export class AddCategoryBudget extends Migration {
  async up(): Promise<void> {
    this.addSql('ALTER TABLE "category" ADD COLUMN "budget" INTEGER NULL;');
  }

  async down(): Promise<void> {
    this.addSql('ALTER TABLE "category" DROP COLUMN "budget";');
  }
}
