import { useState } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { EditableRow } from './EditableRow';
import { AddRow } from './AddRow';
import { ConfirmModal } from './ConfirmModal';
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
  onNameChange: (id: number, name: string) => Promise<void>;
  onDateChange: (id: number, date: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onAdd: (name: string, amount: number, date?: string, recurring?: boolean) => Promise<void>;
  onRecurringToggle?: (id: number, recurring: boolean) => Promise<void>;
  onNotesChange?: (id: number, notes: string) => Promise<void>;
  onDuplicate?: (id: number) => Promise<void>;
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
  onNameChange,
  onDateChange,
  onDelete,
  onAdd,
  onRecurringToggle,
  onNotesChange,
  onDuplicate,
}: TableSectionProps) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<{ id: number; name: string } | null>(null);
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
                  onNameChange={onNameChange}
                  onAmountChange={onAmountChange}
                  onDateChange={onDateChange}
                  onDelete={(id) => setDeleting({ id, name: item.name })}
                  showType={showType}
                  onRecurringToggle={onRecurringToggle}
                  onNotesChange={onNotesChange}
                  onDuplicate={onDuplicate}
                />
              ))}
              {adding && (
                <AddRow
                  type={type}
                  showType={showType}
                  onAdd={(name, amount, date, recurring) => {
                    onAdd(name, amount, date, recurring);
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

      {deleting && (
        <ConfirmModal
          title="Eliminar ítem"
          message={`¿Estás seguro de eliminar "${deleting.name}"?`}
          confirmLabel="Eliminar"
          onConfirm={async () => {
            await onDelete(deleting.id);
            setDeleting(null);
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
