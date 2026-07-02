import { Migration } from '@mikro-orm/migrations';

export class Migration20260702163204_addUserTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null, "name" varchar(255) not null, "role" varchar(255) not null default 'user', "refresh_token" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`,
    );
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
