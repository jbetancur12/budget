import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { parseAmount, formatInput } from '../utils';
import type { CategoryData } from '../types';

interface Props {
  categories: CategoryData[];
  onAdd: (name: string, amount: number, categoryId: number, date?: string) => Promise<void>;
  onClose: () => void;
}

export function QuickAddModal({ categories, onAdd, onClose }: Props) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  const incomeCats = categories.filter((c) => c.type === 'income');
  const expenseCats = categories.filter((c) => c.type === 'expense');

  const commit = async () => {
    if (!name.trim() || !categoryId) return;
    setLoading(true);
    try {
      await onAdd(name.trim(), parseAmount(amount), categoryId, date);
      onClose();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4" onClick={onClose}>
      <div className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Nuevo movimiento</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Nombre</label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Ej: Mercado" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Monto</label>
            <input value={amount} onChange={(e) => setAmount(formatInput(e.target.value))}
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="0" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              {incomeCats.length > 0 && <optgroup label="Ingresos">
                {incomeCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>}
              {expenseCats.length > 0 && <optgroup label="Gastos">
                {expenseCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <button onClick={commit} disabled={loading || !name.trim()}
            className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4 inline mr-1" />Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
