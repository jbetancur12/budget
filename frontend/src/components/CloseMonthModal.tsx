import { useForm, useWatch } from 'react-hook-form';
import { X } from 'lucide-react';
import { fmt, safePercent } from '../utils';
import type { Pocket, CloseOption, DistributeMode } from '../types';

interface CloseMonthForm {
  closeOption: CloseOption;
  distributeMode: DistributeMode;
  pocketAmounts: Record<string, string>;
}

interface CloseMonthModalProps {
  savings: number;
  monthLabel: string;
  nextMonthLabel: string;
  pockets: Pocket[];
  onClose: () => void;
  onConfirm: (option: CloseOption, amounts?: Record<number, number>) => void;
}

export function CloseMonthModal({
  savings,
  monthLabel,
  nextMonthLabel,
  pockets,
  onClose,
  onConfirm,
}: CloseMonthModalProps) {
  const { control, register, handleSubmit, setValue } = useForm<CloseMonthForm>({
    defaultValues: {
      closeOption: 'next',
      distributeMode: 'amount',
      pocketAmounts: Object.fromEntries(pockets.map((p) => [String(p.id), ''])),
    },
  });

  const closeOption = useWatch({ control, name: 'closeOption' });
  const distributeMode = useWatch({ control, name: 'distributeMode' });
  const pocketAmounts = useWatch({ control, name: 'pocketAmounts' });

  const resolvedAmounts: Record<number, number> = {};
  pockets.forEach((p) => {
    const raw = parseFloat(pocketAmounts?.[String(p.id)] ?? '') || 0;
    resolvedAmounts[p.id] =
      distributeMode === 'percent' ? Math.round((raw / 100) * savings) : Math.round(raw);
  });

  const distributeTotal = Object.values(resolvedAmounts).reduce((s, v) => s + v, 0);
  const distributeRemaining = savings - distributeTotal;

  const percentTotal = pockets.reduce(
    (s, p) => s + (parseFloat(pocketAmounts?.[String(p.id)] ?? '') || 0),
    0,
  );
  const percentRemaining = 100 - percentTotal;

  const onSubmit = () => {
    if (closeOption === 'distribute') {
      onConfirm('distribute', resolvedAmounts);
    } else {
      onConfirm('next');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-md w-full overflow-hidden max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Cierre de Mes</h2>
            <p className="text-xs text-muted-foreground">{monthLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 text-center">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
              Saldo sin asignar
            </p>
            <p className="font-display text-4xl font-bold text-accent-foreground">{fmt(savings)}</p>
          </div>

          <p className="text-sm text-muted-foreground font-medium">
            ¿Qué deseas hacer con este saldo?
          </p>

          <div className="space-y-3">
            <label
              className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                closeOption === 'next'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-accent/30'
              }`}
            >
              <input
                type="radio"
                value="next"
                {...register('closeOption')}
                className="mt-0.5 accent-primary"
              />
              <div>
                <p className="text-sm font-bold text-foreground">Transferir como saldo inicial</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Abrir <span className="font-semibold">{nextMonthLabel}</span> con {fmt(savings)}{' '}
                  de saldo de apertura
                </p>
              </div>
            </label>

            <div
              className={`rounded-2xl border-2 transition-all ${
                closeOption === 'distribute'
                  ? 'border-accent bg-accent/5'
                  : 'border-border hover:border-accent/30'
              }`}
            >
              <label className="flex items-start gap-3.5 p-4 cursor-pointer">
                <input
                  type="radio"
                  value="distribute"
                  {...register('closeOption')}
                  className="mt-0.5 accent-primary"
                />
                <div>
                  <p className="text-sm font-bold text-foreground">Distribuir en mis Bolsillos</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Asigna lo que quieras a cada bolsillo — el resto pasa como saldo inicial al
                    próximo mes
                  </p>
                </div>
              </label>

              {closeOption === 'distribute' && (
                <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ingresar por:</span>
                    <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
                      {(['amount', 'percent'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setValue('distributeMode', m)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            distributeMode === m
                              ? 'bg-card text-primary shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {m === 'amount' ? '$ Monto' : '% Porcentaje'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`text-xs font-semibold rounded-lg px-3 py-2 space-y-1 ${
                      distributeRemaining < 0
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted border border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignado a bolsillos</span>
                      <span className="font-mono text-foreground">{fmt(distributeTotal)}</span>
                    </div>
                    <div
                      className={`flex items-center justify-between ${
                        distributeRemaining < 0 ? 'text-destructive' : 'text-primary'
                      }`}
                    >
                      <span>
                        {distributeRemaining >= 0
                          ? '→ Saldo inicial próximo mes'
                          : '⚠ Excede el disponible'}
                      </span>
                      <span className="font-mono">
                        {distributeMode === 'percent'
                          ? `${fmt(distributeRemaining)} (${percentRemaining.toFixed(1)}%)`
                          : fmt(distributeRemaining)}
                      </span>
                    </div>
                  </div>

                  {pockets.map((p) => {
                    const computed = resolvedAmounts[p.id] ?? 0;
                    return (
                      <div key={p.id} className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="text-xs text-foreground truncate">{p.name}</span>
                        </div>
                        <div className="relative shrink-0">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none select-none">
                            {distributeMode === 'amount' ? '$' : '%'}
                          </span>
                          <input
                            className="font-mono text-xs w-24 border border-border rounded-xl pl-6 pr-2 py-1.5 bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
                            placeholder="0"
                            {...register(`pocketAmounts.${p.id}`)}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground w-24 text-right shrink-0">
                          {distributeMode === 'percent' && computed > 0
                            ? `= ${fmt(computed)}`
                            : distributeMode === 'amount' && computed > 0
                              ? `${safePercent(computed, savings)}%`
                              : '—'}
                        </span>
                      </div>
                    );
                  })}

                  {distributeRemaining < 0 && (
                    <p className="text-xs text-destructive font-semibold bg-destructive/10 rounded-lg px-3 py-2">
                      ⚠ Estás asignando {fmt(-distributeRemaining)} más de lo disponible. Reduce
                      algún valor.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={closeOption === 'distribute' && distributeRemaining < 0}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Finalizar Cierre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
