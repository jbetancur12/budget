import { useState } from 'react';
import { Trash2, RefreshCw, Copy } from 'lucide-react';
import { fmt, parseAmount, formatInput } from '../utils';
import type { Item } from '../types';

interface EditableRowProps {
  item: Item;
  onNameChange: (id: number, name: string) => void;
  onAmountChange: (id: number, amount: number) => void;
  onDateChange: (id: number, date: string) => void;
  onDelete: (id: number) => void;
  showType?: boolean;
  onRecurringToggle?: (id: number, recurring: boolean) => Promise<void>;
  onNotesChange?: (id: number, notes: string) => Promise<void>;
  onDuplicate?: (id: number) => Promise<void>;
}

export function EditableRow({
  item,
  onNameChange,
  onAmountChange,
  onDateChange,
  onDelete,
  showType,
  onRecurringToggle,
  onNotesChange,
  onDuplicate,
}: EditableRowProps) {
  const [editingAmount, setEditingAmount] = useState(false);
  const [amountValue, setAmountValue] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [editingDate, setEditingDate] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');

  const startAmountEdit = () => {
    setAmountValue(formatInput(String(item.amount)));
    setEditingAmount(true);
  };

  const commitAmount = () => {
    onAmountChange(item.id, parseAmount(amountValue));
    setEditingAmount(false);
  };

  const startNameEdit = () => {
    setNameValue(item.name);
    setEditingName(true);
  };

  const commitName = () => {
    if (nameValue.trim()) {
      onNameChange(item.id, nameValue.trim());
    }
    setEditingName(false);
  };

  const startDateEdit = () => {
    setDateValue(item.date?.slice(0, 10) ?? '');
    setEditingDate(true);
  };

  const commitDate = () => {
    if (dateValue) onDateChange(item.id, dateValue);
    setEditingDate(false);
  };

  return (
    <tr className="group border-b border-border/40 last:border-0 hover:bg-primary/[0.03] transition-colors">
      <td className="py-2.5 px-4 text-sm text-foreground">
        <div className="flex items-center gap-1.5">
          {editingName ? (
            <input
              autoFocus
              className="text-sm border-2 border-primary rounded-lg px-2 py-1 w-full bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitName();
                if (e.key === 'Escape') setEditingName(false);
              }}
            />
          ) : (
            <div>
              <span
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={startNameEdit}
                title="Click para editar nombre"
              >
                {item.name}
              </span>
              {onNotesChange &&
                (editingNotes ? (
                  <input
                    autoFocus
                    className="text-[11px] border border-primary rounded px-1.5 py-0.5 w-full bg-card mt-0.5 focus:outline-none"
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    onBlur={() => {
                      onNotesChange(item.id, notesValue);
                      setEditingNotes(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onNotesChange(item.id, notesValue);
                        setEditingNotes(false);
                      }
                      if (e.key === 'Escape') setEditingNotes(false);
                    }}
                    placeholder="Nota..."
                  />
                ) : item.notes ? (
                  <span
                    className="block text-[11px] text-muted-foreground/70 cursor-pointer hover:text-muted-foreground mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotesValue(item.notes ?? '');
                      setEditingNotes(true);
                    }}
                    title="Click para editar nota"
                  >
                    {item.notes}
                  </span>
                ) : (
                  <span
                    className="block text-[11px] text-muted-foreground/30 cursor-pointer hover:text-muted-foreground/60 mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotesValue('');
                      setEditingNotes(true);
                    }}
                  >
                    + nota
                  </span>
                ))}
            </div>
          )}
          {onRecurringToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRecurringToggle(item.id, !item.recurring);
              }}
              className={`p-0.5 rounded transition-colors ${item.recurring ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'}`}
              title={item.recurring ? 'Recurrente' : 'No recurrente'}
            >
              <RefreshCw className={`w-3 h-3 ${item.recurring ? 'stroke-[2.5]' : ''}`} />
            </button>
          )}
        </div>
      </td>
      <td className="py-2.5 px-4 text-xs text-muted-foreground w-28">
        {editingDate ? (
          <input
            type="date"
            autoFocus
            className="text-xs border-2 border-primary rounded-lg px-2 py-1 w-full bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            onBlur={commitDate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDate();
              if (e.key === 'Escape') setEditingDate(false);
            }}
          />
        ) : (
          <span
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={startDateEdit}
            title="Click para editar fecha"
          >
            {item.date?.slice(0, 10)}
          </span>
        )}
      </td>
      <td className="py-2.5 px-4 w-44">
        {editingAmount ? (
          <input
            autoFocus
            className="font-mono text-sm w-36 border-2 border-primary rounded-lg px-2 py-1 bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={amountValue}
            onChange={(e) => setAmountValue(formatInput(e.target.value))}
            onBlur={commitAmount}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitAmount();
              if (e.key === 'Escape') setEditingAmount(false);
            }}
          />
        ) : (
          <span
            className="font-mono text-sm cursor-pointer hover:text-primary transition-colors"
            onClick={startAmountEdit}
            title="Click para editar monto"
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
      <td className="py-2.5 px-3 w-20">
        <div className="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(item.id)}
              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              title="Duplicar"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
