import { fmt } from '../utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: { fill: string; name: string; value: number }[];
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
      <p className="font-display text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-mono text-sm" style={{ color: p.fill }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}
