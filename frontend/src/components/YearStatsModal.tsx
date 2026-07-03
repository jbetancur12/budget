import { X } from 'lucide-react';
import { fmt } from '../utils';
import type { ChartRow } from '../types';

interface Props {
  history: ChartRow[];
  currentIncome: number;
  currentExpenses: number;
  onClose: () => void;
}

export function YearStatsModal({ history, currentIncome, currentExpenses, onClose }: Props) {
  const allMonths = [...history, { mes: 'Este mes', ingresos: currentIncome, gastos: currentExpenses }];

  const totalIngresos = allMonths.reduce((s, m) => s + m.ingresos, 0);
  const totalGastos = allMonths.reduce((s, m) => s + m.gastos, 0);
  const avgIngresos = Math.round(totalIngresos / allMonths.length);
  const avgGastos = Math.round(totalGastos / allMonths.length);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4" onClick={onClose}>
      <div className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-foreground">Estadísticas Anuales</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-chart-2/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-chart-2 font-bold uppercase tracking-wide">Prom. Ingresos</p>
              <p className="font-mono font-bold text-lg text-chart-2">{fmt(avgIngresos)}</p>
            </div>
            <div className="bg-chart-4/10 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-chart-4 font-bold uppercase tracking-wide">Prom. Gastos</p>
              <p className="font-mono font-bold text-lg text-chart-4">{fmt(avgGastos)}</p>
            </div>
          </div>

          {allMonths.length > 1 && (() => {
            const last = allMonths[allMonths.length - 1];
            const prev = allMonths[allMonths.length - 2];
            const incDiff = last.ingresos - prev.ingresos;
            const expDiff = last.gastos - prev.gastos;
            const incPct = prev.ingresos ? Math.round((incDiff / prev.ingresos) * 100) : 0;
            const expPct = prev.gastos ? Math.round((expDiff / prev.gastos) * 100) : 0;
            return (
              <div className="bg-muted/50 rounded-2xl p-4">
                <p className="text-xs font-bold text-foreground mb-2">vs mes anterior</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Ingresos</p>
                    <p className={`font-mono font-bold ${incDiff >= 0 ? 'text-chart-2' : 'text-destructive'}`}>{incDiff >= 0 ? '+' : ''}{incPct}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Gastos</p>
                    <p className={`font-mono font-bold ${expDiff <= 0 ? 'text-chart-2' : 'text-destructive'}`}>{expDiff >= 0 ? '+' : ''}{expPct}%</p>
                  </div>
                </div>
              </div>
            );
          })()}

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs text-muted-foreground font-semibold">Mes</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-semibold">Ingresos</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-semibold">Gastos</th>
                <th className="text-right py-2 text-xs text-muted-foreground font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {allMonths.map((m, i) => {
                const bal = m.ingresos - m.gastos;
                return (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className={`py-2 text-sm ${i === allMonths.length - 1 ? 'font-bold' : ''}`}>{m.mes}</td>
                    <td className="py-2 text-right font-mono text-chart-2">{fmt(m.ingresos)}</td>
                    <td className="py-2 text-right font-mono text-chart-4">{fmt(m.gastos)}</td>
                    <td className={`py-2 text-right font-mono ${bal >= 0 ? 'text-foreground' : 'text-destructive'}`}>{fmt(bal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
