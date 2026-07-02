import { initORM } from './db.js';
import { Item } from './entities/Item.js';
import { Pocket } from './entities/Pocket.js';
import { MonthlyHistory } from './entities/MonthlyHistory.js';

async function main() {
  const orm = await initORM();
  const em = orm.em.fork();

  const count = await em.count(Item, {});
  if (count > 0) {
    console.log('Already seeded, skipping');
    await orm.close();
    return;
  }

  const items = [
    {
      name: 'Salario Neto',
      amount: 5980000,
      type: 'Fijo' as const,
      category: 'income' as const,
      monthOffset: 0,
    },
    {
      name: 'Otros Ingresos',
      amount: 0,
      type: 'Variable' as const,
      category: 'income' as const,
      monthOffset: 0,
    },
    {
      name: 'Agua',
      amount: 60000,
      type: 'Fijo' as const,
      category: 'services' as const,
      monthOffset: 0,
    },
    {
      name: 'Luz',
      amount: 100000,
      type: 'Fijo' as const,
      category: 'services' as const,
      monthOffset: 0,
    },
    {
      name: 'Internet',
      amount: 82000,
      type: 'Fijo' as const,
      category: 'services' as const,
      monthOffset: 0,
    },
    {
      name: 'Gas',
      amount: 8000,
      type: 'Fijo' as const,
      category: 'services' as const,
      monthOffset: 0,
    },
    {
      name: 'Luz Mamá',
      amount: 195000,
      type: 'Fijo' as const,
      category: 'services' as const,
      monthOffset: 0,
    },
    {
      name: 'Davivienda',
      amount: 766000,
      type: 'Fijo' as const,
      category: 'loans' as const,
      monthOffset: 0,
    },
    {
      name: 'Nequi',
      amount: 174000,
      type: 'Fijo' as const,
      category: 'loans' as const,
      monthOffset: 0,
    },
    {
      name: 'Gasolina',
      amount: 350000,
      type: 'Variable' as const,
      category: 'variable' as const,
      monthOffset: 0,
    },
    {
      name: 'Parqueadero',
      amount: 150000,
      type: 'Variable' as const,
      category: 'variable' as const,
      monthOffset: 0,
    },
  ];
  for (const d of items) em.create(Item, d as never);

  const pocketData = [
    {
      name: 'Fondo de Emergencia',
      balance: 1200000,
      goal: 5000000,
      color: '#3B82F6',
      icon: 'Shield' as const,
    },
    { name: 'Viajes', balance: 450000, goal: 2000000, color: '#8B5CF6', icon: 'Plane' as const },
    {
      name: 'Inversiones',
      balance: 3200000,
      goal: 10000000,
      color: '#16A34A',
      icon: 'TrendingUp' as const,
    },
    {
      name: 'Educación',
      balance: 180000,
      goal: 1000000,
      color: '#F59E0B',
      icon: 'BookOpen' as const,
    },
  ];
  for (const d of pocketData) em.create(Pocket, d as never);

  const baseHistory = [
    {
      monthOffset: -5,
      monthLabel: 'Feb',
      totalIncome: 5800000,
      totalExpenses: 1950000,
      savings: 1925000,
    },
    {
      monthOffset: -4,
      monthLabel: 'Mar',
      totalIncome: 5980000,
      totalExpenses: 2100000,
      savings: 1940000,
    },
    {
      monthOffset: -3,
      monthLabel: 'Abr',
      totalIncome: 5980000,
      totalExpenses: 1750000,
      savings: 2115000,
    },
    {
      monthOffset: -2,
      monthLabel: 'May',
      totalIncome: 6200000,
      totalExpenses: 2250000,
      savings: 1975000,
    },
    {
      monthOffset: -1,
      monthLabel: 'Jun',
      totalIncome: 5980000,
      totalExpenses: 1885000,
      savings: 2047500,
    },
  ];
  for (const d of baseHistory) em.create(MonthlyHistory, d as never);

  await em.flush();
  console.log('Seed complete');
  await orm.close();
}

main().catch(console.error);
