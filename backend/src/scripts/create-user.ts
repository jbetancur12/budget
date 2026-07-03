import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { initORM } from '../db.js';
import { User } from '../entities/User.js';

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Uso: npx tsx src/scripts/create-user.ts <email> <password>');
  process.exit(1);
}

const orm = await initORM();
const em = orm.em.fork();

const existing = await em.findOne(User, { email });
if (existing) {
  console.error(`Error: ya existe un usuario con el email ${email}`);
  await orm.close();
  process.exit(1);
}

const hashed = await bcrypt.hash(password, 12);
em.create(User, {
  email,
  password: hashed,
  name: email.split('@')[0],
  role: 'user',
} as never);

await em.flush();
console.log(`Usuario creado: ${email}`);
await orm.close();
