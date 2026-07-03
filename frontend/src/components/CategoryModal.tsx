import { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2 } from 'lucide-react';
import { formatInput, parseAmount, fmt } from '../utils';
import * as api from '../api';
import type { CategoryData } from '../types';

interface Props {
  onClose: () => void;
}

export function CategoryModal({ onClose }: Props) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newBudget, setNewBudget] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const cats = await api.fetchCategories();
    setCategories(cats);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setError('');
    try {
      await api.createCategory({
        name: newName.trim(),
        type: newType,
        budget: parseAmount(newBudget) || null,
      });
      setNewName('');
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    setError('');
    try {
      await api.updateCategory(id, {
        name: editName.trim(),
        budget: parseAmount(editBudget) || null,
      });
      setEditingId(null);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    try {
      await api.deleteCategory(id);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Categorías</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
              className="border border-border rounded-xl px-3 py-2 text-sm bg-background"
            >
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
              className="flex-1 border border-border rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Nueva categoría..."
            />
            <input
              value={newBudget}
              onChange={(e) => setNewBudget(formatInput(e.target.value))}
              className="w-28 border border-border rounded-xl px-3 py-2 text-sm font-mono bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Presupuesto"
            />
            <button
              onClick={handleCreate}
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors group"
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.type === 'income' ? 'bg-chart-2/10 text-chart-2' : 'bg-chart-4/10 text-chart-4'}`}
                >
                  {cat.type === 'income' ? 'Ingreso' : 'Gasto'}
                </span>
                {editingId === cat.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate(cat.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="flex-1 border border-primary rounded-lg px-2 py-1 text-sm bg-card"
                    />
                    <input
                      value={editBudget}
                      onChange={(e) => setEditBudget(formatInput(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdate(cat.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-24 border border-primary rounded-lg px-2 py-1 text-sm font-mono bg-card"
                      placeholder="Tope"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="text-sm text-foreground truncate">{cat.name}</span>
                    {cat.type === 'expense' && cat.budget ? (
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {fmt(cat.budget)}
                      </span>
                    ) : null}
                  </div>
                )}
                <div className="flex gap-0.5 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditName(cat.name);
                      setEditBudget(formatInput(String(cat.budget ?? '')));
                    }}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
