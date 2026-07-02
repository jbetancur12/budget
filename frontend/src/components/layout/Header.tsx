import { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import type { Tab } from '../../types';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface HeaderProps {
  tab: Tab;
  monthLabel: string;
  monthOffset: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  onMonthPick: (offset: number) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as Tab, label: 'Resumen' },
  { id: 'transactions' as Tab, label: 'Transacciones' },
  { id: 'pockets' as Tab, label: 'Bolsillos' },
];

export function Header({
  tab, monthLabel, monthOffset, onPrevMonth, onNextMonth,
  onTabChange, onLogout, onMonthPick,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    const rawIdx = 6 + monthOffset;
    return 2026 + Math.floor(rawIdx / 12);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rawIdx = 6 + monthOffset;
    setViewYear(2026 + Math.floor(rawIdx / 12));
  }, [monthOffset]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectMonth = (m: number) => {
    const offset = (viewYear - 2026) * 12 + (m - 6);
    onMonthPick(offset);
    setOpen(false);
  };

  const desktopLabel = NAV_ITEMS.find((n) => n.id === tab)?.label;

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-sm leading-tight">Presupuesto Fácil</p>
              <p className="text-white/60 text-[10px] leading-tight">Gestión mensual</p>
            </div>
            <span className="sm:hidden font-bold text-sm">{desktopLabel}</span>
          </div>

          <nav className="hidden sm:flex items-center bg-white/10 rounded-xl p-1 gap-0.5">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  tab === id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1.5 sm:px-2 py-1.5 shrink-0 relative" ref={ref}>
            <button
              onClick={onPrevMonth}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="text-xs sm:text-sm font-display min-w-[90px] sm:min-w-[148px] text-center hover:bg-white/10 rounded-lg px-2 py-0.5 transition-colors cursor-pointer"
            >
              {monthLabel}
            </button>
            <button
              onClick={onNextMonth}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute top-full mt-2 right-0 bg-card text-foreground border border-border rounded-2xl shadow-xl p-3 w-72 z-50">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setViewYear((y) => y - 1)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm">{viewYear}</span>
                  <button
                    onClick={() => setViewYear((y) => y + 1)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((name, i) => {
                    const isCurrent = (() => {
                      const rawIdx = 6 + monthOffset;
                      const mIdx = ((rawIdx % 12) + 12) % 12;
                      const y = 2026 + Math.floor(rawIdx / 12);
                      return i === mIdx && y === viewYear;
                    })();
                    return (
                      <button
                        key={name}
                        onClick={() => selectMonth(i)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        {name.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className="hidden sm:block p-2 rounded-xl hover:bg-white/15 transition-colors text-white/75 hover:text-white shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
