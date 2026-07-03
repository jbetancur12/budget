import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { parseAmount, formatInput } from '../utils';
import type { ItemType } from '../types';

interface AddRowProps {
  type: ItemType;
  onAdd: (name: string, amount: number, date?: string) => void;
  onCancel: () => void;
  showType?: boolean;
}

export function AddRow({ type: _type, onAdd, onCancel, showType }: AddRowProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const commit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), parseAmount(amount), date);
  };

  return (
    <tr className="border-b border-border/40 bg-primary/5">
      <td className="py-2 px-4">
        <input
          autoFocus
          className="text-sm border border-primary/40 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 bg-card placeholder:text-muted-foreground/60"
          placeholder="Nombre del ítem..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') onCancel();
          }}
        />
      </td>
      <td className="py-2 px-4 w-28">
        <input
          type="date"
          className="text-xs border border-primary/40 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 bg-card"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </td>
      <td className="py-2 px-4 w-44">
        <input
          className="font-mono text-sm border border-primary/40 rounded-lg px-2.5 py-1 w-36 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-card placeholder:text-muted-foreground/60"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(formatInput(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') onCancel();
          }}
        />
      </td>
      {showType && <td className="hidden sm:table-cell" />}
      <td className="py-2 px-3 w-16">
        <div className="flex items-center gap-1">
          <button
            onClick={commit}
            className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
