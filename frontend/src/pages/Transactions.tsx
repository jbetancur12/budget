import { Search, Download } from 'lucide-react';
import { TableSection } from '../components/TableSection';
import { fmt } from '../utils';
import type { ItemData, CategoryData, ItemHandlers } from '../types';

interface TransactionsProps {
  categories: CategoryData[];
  incomeCategories: CategoryData[];
  expenseCategories: CategoryData[];
  itemsByCategory: Record<number, ItemData[]>;
  monthLabel: string;
  openCategories: Record<number, boolean>;
  onToggleCategory: (id: number) => void;
  makeHandlers: (categoryId: number, type: 'Fijo' | 'Variable') => ItemHandlers;
  search?: string;
  onSearchChange?: (value: string) => void;
}

function downloadCSV(categories: CategoryData[], itemsByCategory: Record<number, ItemData[]>, monthLabel: string) {
  const rows: string[] = [];
  rows.push('Categoría,Nombre,Monto,Tipo,Fecha');
  for (const cat of categories) {
    for (const item of itemsByCategory[cat.id] ?? []) {
      rows.push(`${cat.name},${item.name},${item.amount},${item.type},${item.date}`);
    }
  }

  const totalIncome = categories.filter((c) => c.type === 'income')
    .flatMap((c) => itemsByCategory[c.id] ?? [])
    .reduce((s, i) => s + i.amount, 0);
  const totalExpenses = categories.filter((c) => c.type === 'expense')
    .flatMap((c) => itemsByCategory[c.id] ?? [])
    .reduce((s, i) => s + i.amount, 0);

  rows.push('');
  rows.push('Resumen,Categoría,Total');
  rows.push(`Ingresos,,${totalIncome}`);
  rows.push(`Gastos,,${totalExpenses}`);

  const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `presupuesto-${monthLabel.replace(/\s/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Transactions({
  categories, incomeCategories, expenseCategories, itemsByCategory, monthLabel,
  openCategories, onToggleCategory, makeHandlers,
  search, onSearchChange,
}: TransactionsProps) {
  const totalIncome = incomeCategories
    .flatMap((c) => itemsByCategory[c.id] ?? [])
    .reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenseCategories
    .flatMap((c) => itemsByCategory[c.id] ?? [])
    .reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transacciones</h1>
          <p className="text-sm text-muted-foreground">{monthLabel}</p>
        </div>
        <button
          onClick={() => downloadCSV(categories, itemsByCategory, monthLabel)}
          className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Exportar CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {onSearchChange && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/60"
            placeholder="Buscar items..."
          />
        </div>
      )}

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-chart-2" />
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Ingresos</h2>
          <span className="ml-auto font-mono text-sm font-bold text-chart-2">{fmt(totalIncome)}</span>
        </div>
        {incomeCategories.map((cat) => {
          const items = itemsByCategory[cat.id] ?? [];
          const h = makeHandlers(cat.id, 'Variable');
          return (
            <TableSection
              key={cat.id}
              title={cat.name}
              items={items}
              type="Variable"
              total={items.reduce((s, i) => s + i.amount, 0)}
              totalColor="text-chart-2"
              collapsible
              isOpen={openCategories[cat.id] !== false}
              onToggle={() => onToggleCategory(cat.id)}
              {...h}
            />
          );
        })}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-chart-4" />
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Gastos</h2>
          <span className="ml-auto font-mono text-sm font-bold text-chart-4">{fmt(totalExpenses)}</span>
        </div>
        {expenseCategories.map((cat) => {
          const items = itemsByCategory[cat.id] ?? [];
          const h = makeHandlers(cat.id, 'Fijo');
          return (
            <TableSection
              key={cat.id}
              title={cat.name}
              items={items}
              type="Fijo"
              total={items.reduce((s, i) => s + i.amount, 0)}
              totalColor="text-chart-4"
              collapsible
              isOpen={openCategories[cat.id] !== false}
              onToggle={() => onToggleCategory(cat.id)}
              {...h}
            />
          );
        })}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">Ingresos <span className="font-mono font-bold text-chart-2">{fmt(totalIncome)}</span></span>
            <span className="text-muted-foreground">−</span>
            <span className="text-muted-foreground">Gastos <span className="font-mono font-bold text-chart-4">{fmt(totalExpenses)}</span></span>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Saldo disponible</p>
            <p className={`font-mono font-bold text-xl ${balance >= 0 ? 'text-primary' : 'text-destructive'}`}>{fmt(balance)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
