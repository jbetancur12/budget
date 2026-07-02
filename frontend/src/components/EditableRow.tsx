import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { fmt, parseAmount } from '../utils';
import type { Item } from '../types';

interface EditableRowProps {
  item: Item;
  onAmountChange: (id: number, amount: number) => void;
  onDelete: (id: number) => void;
  showType?: boolean;
}

export function EditableRow({ item, onAmountChange, onDelete, showType }: EditableRowProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const startEdit = () => {
    setValue(String(item.amount));
    setEditing(true);
  };

  const commit = () => {
    onAmountChange(item.id, parseAmount(value));
    setEditing(false);
  };

  return (
    <tr className="group border-b border-border/40 last:border-0 hover:bg-primary/[0.03] transition-colors">
      <td className="py-2.5 px-4 text-sm text-foreground">{item.name}</td>
      <td className="py-2.5 px-4 w-44">
        {editing ? (
          <input
            autoFocus
            className="font-mono text-sm w-36 border-2 border-primary rounded-lg px-2 py-1 bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') setEditing(false);
            }}
          />
        ) : (
          <span
            className="font-mono text-sm cursor-pointer hover:text-primary transition-colors"
            onClick={startEdit}
          >
            {fmt(item.amount)}
          </span>
        )}
      </td>
      {showType && (
        <td className="py-2.5 px-4 w-24 hidden sm:table-cell">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              item.type === 'Fijo'
                ? 'bg-primary/10 text-primary'
                : 'bg-accent/20 text-accent-foreground'
            }`}
          >
            {item.type}
          </span>
        </td>
      )}
      <td className="py-2.5 px-3 w-16">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="p-1 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
