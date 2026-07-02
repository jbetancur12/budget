import { LayoutDashboard, ArrowLeftRight, PiggyBank, LogOut } from 'lucide-react';
import type { Tab } from '../../types';

interface MobileNavProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

const ITEMS = [
  { id: 'dashboard' as Tab, label: 'Resumen', icon: LayoutDashboard },
  { id: 'transactions' as Tab, label: 'Movimientos', icon: ArrowLeftRight },
  { id: 'pockets' as Tab, label: 'Bolsillos', icon: PiggyBank },
];

export function MobileNav({ tab, onTabChange, onLogout }: MobileNavProps) {
  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) * 0.3)' }}
    >
      <div className="flex">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all active:scale-95"
            >
              <div className={`w-12 h-7 flex items-center justify-center rounded-full transition-all duration-200 ${active ? 'bg-primary/10' : ''}`}>
                <Icon className={`w-5 h-5 transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <span className={`text-[10px] font-bold tracking-wide transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all active:scale-95"
        >
          <div className="w-12 h-7 flex items-center justify-center rounded-full">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-[10px] font-bold tracking-wide text-muted-foreground">Salir</span>
        </button>
      </div>
    </nav>
  );
}
