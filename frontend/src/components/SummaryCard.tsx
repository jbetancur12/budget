import { type ReactNode } from 'react';
import { Info } from 'lucide-react';

interface SummaryCardProps {
  label: string;
  mobileLabel: string;
  value: string;
  sub: string;
  valueColor: string;
  bgClass: string;
  icon: ReactNode;
  tooltip?: string;
}

export function SummaryCard({
  label,
  mobileLabel,
  value,
  sub,
  valueColor,
  bgClass,
  icon,
  tooltip,
}: SummaryCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm animate-in">
      <div className="sm:hidden p-3">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${bgClass}`}
          >
            <span className="scale-75 origin-center">{icon}</span>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide truncate">
            {mobileLabel}
          </span>
          {tooltip && (
            <div className="group relative ml-auto shrink-0">
              <Info className="w-3 h-3 text-muted-foreground" />
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-20 bg-foreground text-background text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl pointer-events-none">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <p className={`font-mono text-base font-bold truncate ${valueColor}`}>{value}</p>
      </div>
      <div className="hidden sm:block p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
              {label}
            </span>
            {tooltip && (
              <div className="group relative">
                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 bg-foreground text-background text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl pointer-events-none">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}
          >
            {icon}
          </div>
        </div>
        <p className={`font-mono text-2xl font-bold ${valueColor}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
      </div>
    </div>
  );
}
