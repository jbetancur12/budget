import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SummaryCard } from '../components/SummaryCard';
import { ChartTooltip } from '../components/ChartTooltip';
import { MiniBar } from '../components/MiniBar';
import { PocketIcon } from '../components/PocketIcon';
import { QuickAddModal } from '../components/QuickAddModal';
import { fmt, safePercent } from '../utils';
import type { ItemData, PocketData, ChartRow, CategoryData } from '../types';

interface DashboardProps {
  income: ItemData[];
  services: ItemData[];
  loans: ItemData[];
  variableExp: ItemData[];
  pockets: PocketData[];
  chartHistory: ChartRow[];
  shortLabel: string;
  onGoToPockets: () => void;
  categories: CategoryData[];
  onQuickAdd: (name: string, amount: number, categoryId: number, date?: string) => Promise<void>;
}

export function Dashboard({
  income,
  services,
  loans,
  variableExp,
  pockets,
  chartHistory,
  shortLabel,
  onGoToPockets,
  categories,
  onQuickAdd,
}: DashboardProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalServices = services.reduce((s, i) => s + i.amount, 0);
  const totalLoans = loans.reduce((s, i) => s + i.amount, 0);
  const totalVariable = variableExp.reduce((s, i) => s + i.amount, 0);
  const totalFixed = totalServices + totalLoans;
  const totalExpenses = totalFixed + totalVariable;
  const balance = totalIncome - totalExpenses;
  const savings = Math.round(balance * 0.5);
  const chartData = [
    ...chartHistory,
    { mes: shortLabel, ingresos: totalIncome, gastos: totalExpenses },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          label="Ingresos Totales"
          mobileLabel="Ingresos"
          value={fmt(totalIncome)}
          sub="Salario Neto + Otros"
          valueColor="text-chart-2"
          bgClass="bg-chart-2/10"
          icon={<TrendingUp className="w-4 h-4 text-chart-2" />}
        />
        <SummaryCard
          label="Gastos Totales"
          mobileLabel="Gastos"
          value={fmt(totalExpenses)}
          sub="Fijos + Variables"
          valueColor="text-chart-4"
          bgClass="bg-chart-4/10"
          icon={<TrendingDown className="w-4 h-4 text-chart-4" />}
        />
        <SummaryCard
          label="Saldo Disponible"
          mobileLabel="Disponible"
          value={fmt(balance)}
          sub="Ingresos − Gastos"
          valueColor={balance >= 0 ? 'text-primary' : 'text-destructive'}
          bgClass={balance >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}
          icon={
            <Wallet className={`w-4 h-4 ${balance >= 0 ? 'text-primary' : 'text-destructive'}`} />
          }
        />
        <SummaryCard
          label="Ahorro Automático"
          mobileLabel="Ahorro 50%"
          value={fmt(savings)}
          sub="50% del saldo disponible"
          valueColor="text-accent-foreground"
          bgClass="bg-accent/20"
          icon={<PiggyBank className="w-4 h-4 text-accent-foreground" />}
          tooltip="Calculado automáticamente como 50% del saldo disponible"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm animate-in animate-in-d1">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-foreground">Comparativo Mensual</h2>
            <p className="text-xs text-muted-foreground">Ingresos vs. Gastos — últimos 6 meses</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
              barCategoryGap="32%"
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12, fill: '#7c7a92' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                tick={{ fontSize: 11, fill: '#7c7a92' }}
                axisLine={false}
                tickLine={false}
                width={54}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 12, paddingTop: 14 }}
              />
              <Bar dataKey="ingresos" name="Ingresos" fill="#4a8c6f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" name="Gastos" fill="#c44545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col animate-in animate-in-d2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Bolsillos</h2>
            <span className="text-xs text-muted-foreground">Saldo acumulado</span>
          </div>
          <div className="space-y-4 flex-1">
            {pockets.map((p) => {
              const pct = safePercent(p.balance, p.goal);
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <PocketIcon icon={p.icon} color={p.color} />
                      <span className="text-xs font-semibold text-foreground">{p.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {fmt(p.balance)}
                    </span>
                  </div>
                  <MiniBar value={pct} color={p.color} />
                  <div className="flex justify-between mt-0.5">
                    <span
                      className="text-[10px] text-muted-foreground font-semibold"
                      style={{ color: p.color }}
                    >
                      {pct}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">Meta {fmt(p.goal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={onGoToPockets}
            className="mt-5 w-full py-2 text-xs text-primary font-semibold border border-primary/25 rounded-xl hover:bg-primary/5 transition-colors"
          >
            Gestionar Bolsillos →
          </button>
        </div>
      </div>

      {(() => {
        const stats = [
          {
            label: 'Gastos Fijos',
            value: totalFixed,
            pct: safePercent(totalFixed, totalExpenses),
            color: 'bg-chart-1',
            suffix: 'del gasto total',
          },
          {
            label: 'Gastos Variables',
            value: totalVariable,
            pct: safePercent(totalVariable, totalExpenses),
            color: 'bg-chart-2',
            suffix: 'del gasto total',
          },
          {
            label: 'Tasa de Ahorro',
            value: savings,
            pct: safePercent(savings, totalIncome),
            color: 'bg-accent',
            suffix: 'sobre ingresos',
            green: true,
          },
        ] as const;
        return (
          <>
            <div className="sm:hidden bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in animate-in-d3">
              {stats.map(({ label, value, pct, color, suffix, green }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 px-4 py-3 ${i < stats.length - 1 ? 'border-b border-border/60' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
                  <span className="text-xs font-semibold text-muted-foreground flex-1 truncate">
                    {label}
                  </span>
                  <div className="text-right shrink-0">
                    <p
                      className={`font-mono text-sm font-bold ${green ? 'text-accent-foreground' : 'text-foreground'}`}
                    >
                      {green ? `${pct}%` : fmt(value)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {green ? fmt(value) : `${pct}% ${suffix}`}
                    </p>
                  </div>
                  <div className="w-16 shrink-0">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:grid grid-cols-3 gap-4">
              {stats.map(({ label, value, pct, color, suffix, green }) => (
                <div
                  key={label}
                  className="bg-card border border-border rounded-2xl p-4 shadow-sm animate-in"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
                    {label}
                  </p>
                  <p
                    className={`font-mono font-bold text-lg ${green ? 'text-accent-foreground' : 'text-foreground'}`}
                  >
                    {green ? `${pct}%` : fmt(value)}
                  </p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {green ? fmt(value) : `${pct}% ${suffix}`}
                  </p>
                </div>
              ))}
            </div>
          </>
        );
      })()}

      <button
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showQuickAdd && (
        <QuickAddModal
          categories={categories}
          onAdd={onQuickAdd}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
