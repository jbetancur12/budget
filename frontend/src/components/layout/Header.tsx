import { Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Tab } from '../../types';

interface HeaderProps {
  tab: Tab;
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard' as Tab, label: 'Resumen' },
  { id: 'transactions' as Tab, label: 'Transacciones' },
  { id: 'pockets' as Tab, label: 'Bolsillos' },
];

export function Header({ tab, monthLabel, onPrevMonth, onNextMonth, onTabChange }: HeaderProps) {
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

          <div className="flex items-center gap-1 bg-white/10 rounded-xl px-1.5 sm:px-2 py-1.5 shrink-0">
            <button
              onClick={onPrevMonth}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs sm:text-sm font-display min-w-[90px] sm:min-w-[148px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={onNextMonth}
              className="p-1 rounded-lg hover:bg-white/15 transition-colors active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
