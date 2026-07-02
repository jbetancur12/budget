import { useState } from 'react';
import { Plus, Check, X, AlertCircle } from 'lucide-react';
import { PocketIcon } from '../components/PocketIcon';
import { MiniBar } from '../components/MiniBar';
import { CloseMonthModal } from '../components/CloseMonthModal';
import { fmt, safePercent } from '../utils';
import { closeMonth, transferToPocket } from '../api';
import type { PocketData, CloseOption } from '../types';

interface PocketsProps {
  pockets: PocketData[];
  income: { amount: number }[];
  services: { amount: number }[];
  loans: { amount: number }[];
  variableExp: { amount: number }[];
  monthLabel: string;
  nextMonthLabel: string;
  onPocketsUpdated: () => Promise<void>;
  onMonthForward: () => void;
}

export function Pockets({
  pockets, income, services, loans, variableExp,
  monthLabel, nextMonthLabel, onPocketsUpdated, onMonthForward,
}: PocketsProps) {
  const [transferringTo, setTransferringTo] = useState<number | null>(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);

  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = [...services, ...loans, ...variableExp].reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savings = Math.round(balance * 0.5);
  const totalPocketBalance = pockets.reduce((s, p) => s + p.balance, 0);
  const totalPocketGoal = pockets.reduce((s, p) => s + p.goal, 0);

  const commitTransfer = async () => {
    const amount = parseFloat(transferAmount.replace(/[^\d]/g, '')) || 0;
    if (!amount || transferringTo === null) return;
    await transferToPocket(transferringTo, amount);
    await onPocketsUpdated();
    setTransferringTo(null);
    setTransferAmount('');
  };

  const handleCloseMonth = async (option: CloseOption, amounts?: Record<number, number>) => {
    const payload: { closeOption: string; pocketAmounts?: Record<number, number>; currentMonthOffset?: number } = {
      closeOption: option,
    };
    if (option === 'distribute') payload.pocketAmounts = amounts;
    await closeMonth(payload);
    setShowCloseModal(false);
    onMonthForward();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Bolsillos de Ahorro</h1>
          <p className="text-sm text-muted-foreground">{monthLabel} · {pockets.length} bolsillos activos</p>
        </div>
        <div className="text-right bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">Para distribuir</p>
          <p className="font-mono font-bold text-xl text-primary">{fmt(savings)}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {pockets.map((p) => {
          const pct = safePercent(p.balance, p.goal);
          const isTransferring = transferringTo === p.id;
          return (
            <div key={p.id} className={`bg-card border rounded-2xl p-5 shadow-sm transition-all animate-in ${isTransferring ? 'border-accent ring-2 ring-accent/20 shadow-md' : 'border-border hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}1a` }}>
                    <PocketIcon icon={p.icon} color={p.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">Meta: {fmt(p.goal)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-foreground">{fmt(p.balance)}</p>
                  <p className="text-xs font-semibold" style={{ color: p.color }}>{pct}% alcanzado</p>
                </div>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: p.color }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>{fmt(p.balance)} acumulado</span>
                <span>{fmt(p.goal - p.balance)} restante</span>
              </div>

              {isTransferring ? (
                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground shrink-0">Transferir:</span>
                  <input autoFocus className="font-mono text-sm flex-1 min-w-0 border-2 border-accent rounded-xl px-3 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground/50" placeholder="0" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') commitTransfer(); if (e.key === 'Escape') { setTransferringTo(null); setTransferAmount(''); } }} />
                  <button onClick={commitTransfer} className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { setTransferringTo(null); setTransferAmount(''); }} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground shrink-0"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <button onClick={() => { setTransferringTo(p.id); setTransferAmount(''); }} className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold border border-dashed rounded-xl py-2 transition-colors" style={{ borderColor: p.color, color: p.color }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${p.color}12`; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}>
                  <Plus className="w-3.5 h-3.5" /> Transferir al bolsillo
                </button>
              )}
            </div>
          );
        })}

        <button className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all min-h-[160px]">
          <div className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center"><Plus className="w-5 h-5" /></div>
          <span className="text-sm font-semibold">Nuevo Bolsillo</span>
        </button>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-foreground">Tienes {fmt(savings)} sin asignar</p>
          <p className="text-xs text-muted-foreground mt-0.5">Al cerrar el mes puedes transferirlo al siguiente mes o distribuirlo entre tus bolsillos.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Total acumulado en bolsillos</p>
          <p className="font-mono font-bold text-xl text-foreground mt-0.5">{fmt(totalPocketBalance)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Progreso general</p>
          <p className="font-mono font-bold text-lg text-primary">{safePercent(totalPocketBalance, totalPocketGoal)}%</p>
          <div className="w-32 mt-1"><MiniBar value={safePercent(totalPocketBalance, totalPocketGoal)} color="#d4a853" /></div>
        </div>
      </div>

      <button onClick={() => setShowCloseModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-7 py-4 sm:py-3.5 rounded-2xl font-bold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg hover:shadow-xl">
        <Check className="w-4 h-4" /> Cerrar Mes · {monthLabel}
      </button>

      {showCloseModal && (
        <CloseMonthModal
          savings={savings}
          monthLabel={monthLabel}
          nextMonthLabel={nextMonthLabel}
          pockets={pockets}
          onClose={() => setShowCloseModal(false)}
          onConfirm={handleCloseMonth}
        />
      )}
    </div>
  );
}
