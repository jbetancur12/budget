export function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
      />
    </div>
  );
}
