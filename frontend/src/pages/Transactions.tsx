import { TableSection } from '../components/TableSection';
import { fmt } from '../utils';
import type { ItemData, ItemHandlers } from '../types';

interface TransactionsProps {
  income: ItemData[];
  services: ItemData[];
  loans: ItemData[];
  variableExp: ItemData[];
  monthLabel: string;
  servicesOpen: boolean;
  loansOpen: boolean;
  variableOpen: boolean;
  incomeOpen: boolean;
  onToggleServices: () => void;
  onToggleLoans: () => void;
  onToggleVariable: () => void;
  onToggleIncome: () => void;
  incomeH: ItemHandlers;
  servicesH: ItemHandlers;
  loansH: ItemHandlers;
  variableH: ItemHandlers;
}

export function Transactions({
  income, services, loans, variableExp, monthLabel,
  servicesOpen, loansOpen, variableOpen, incomeOpen, onToggleServices, onToggleLoans, onToggleVariable, onToggleIncome,
  incomeH, servicesH, loansH, variableH,
}: TransactionsProps) {
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalServices = services.reduce((s, i) => s + i.amount, 0);
  const totalLoans = loans.reduce((s, i) => s + i.amount, 0);
  const totalVariable = variableExp.reduce((s, i) => s + i.amount, 0);
  const totalFixed = totalServices + totalLoans;
  const totalExpenses = totalFixed + totalVariable;
  const balance = totalIncome - totalExpenses;

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transacciones</h1>
          <p className="text-sm text-muted-foreground">{monthLabel}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-chart-2" />
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Ingresos</h2>
          <span className="ml-auto font-mono text-sm font-bold text-chart-2">{fmt(totalIncome)}</span>
        </div>
        <TableSection title="Ingresos" items={income} type="Variable" total={totalIncome} totalColor="text-chart-2" collapsible isOpen={incomeOpen} onToggle={onToggleIncome} {...incomeH} />
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-chart-1" />
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Gastos Fijos</h2>
          <span className="ml-auto font-mono text-sm font-bold text-chart-4">{fmt(totalFixed)}</span>
        </div>
        <TableSection title="Servicios" items={services} type="Fijo" total={totalServices} totalColor="text-chart-4" collapsible isOpen={servicesOpen} onToggle={onToggleServices} {...servicesH} />
        <TableSection title="Préstamos" items={loans} type="Fijo" total={totalLoans} totalColor="text-chart-4" collapsible isOpen={loansOpen} onToggle={onToggleLoans} {...loansH} />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-chart-2" />
          <h2 className="font-bold text-foreground text-sm uppercase tracking-wide">Gastos Variables</h2>
          <span className="ml-auto font-mono text-sm font-bold text-chart-4">{fmt(totalVariable)}</span>
        </div>
        <TableSection title="Variables" items={variableExp} type="Variable" total={totalVariable} totalColor="text-chart-4" collapsible isOpen={variableOpen} onToggle={onToggleVariable} {...variableH} />
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
