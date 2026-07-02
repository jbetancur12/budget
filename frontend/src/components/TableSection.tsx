import { useState } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { EditableRow } from './EditableRow';
import { AddRow } from './AddRow';
import { fmt } from '../utils';
import type { Item, ItemType } from '../types';

interface TableSectionProps {
  title: string;
  items: Item[];
  type: ItemType;
  total: number;
  totalColor?: string;
  showType?: boolean;
  collapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onAmountChange: (id: number, amount: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAdd: (name: string, amount: number) => Promise<void>;
}

export function TableSection({
  title,
  items,
  type,
  total,
  totalColor = 'text-foreground',
  showType = false,
  collapsible = false,
  isOpen = true,
  onToggle,
  onAmountChange,
  onDelete,
  onAdd,
}: TableSectionProps) {
  const [adding, setAdding] = useState(false);
  const closed = collapsible && !isOpen;

  return (
    <div className="mb-3">
      <div
        className={`flex items-center justify-between px-4 py-3 bg-muted/50 border border-border ${
          closed ? 'rounded-xl' : 'rounded-t-xl'
        } ${collapsible ? 'cursor-pointer select-none' : ''}`}
        onClick={collapsible ? onToggle : undefined}
      >
        <div className="flex items-center gap-2">
          {collapsible &&
            (isOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ))}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <span className={`font-mono text-sm font-bold ${totalColor}`}>{fmt(total)}</span>
      </div>
      {!closed && (
        <div className="border border-t-0 border-border rounded-b-xl overflow-hidden bg-card">
          <table className="w-full">
            <tbody>
              {items.map((item) => (
                <EditableRow
                  key={item.id}
                  item={item}
                  onAmountChange={onAmountChange}
                  onDelete={onDelete}
                  showType={showType}
                />
              ))}
              {adding && (
                <AddRow
                  type={type}
                  showType={showType}
                  onAdd={(name, amount) => {
                    onAdd(name, amount);
                    setAdding(false);
                  }}
                  onCancel={() => setAdding(false)}
                />
              )}
            </tbody>
          </table>
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="w-full flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-4 py-2 hover:bg-primary/5 border-t border-border/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar ítem
            </button>
          )}
        </div>
      )}
    </div>
  );
}
