import { X, AlertTriangle } from 'lucide-react';
import { deletePocket } from '../api';
import { fmt } from '../utils';
import type { PocketData } from '../types';

interface Props {
  pocket: PocketData;
  savings: number;
  onClose: () => void;
  onDeleted: () => Promise<void>;
}

export function DeletePocketDialog({ pocket, savings, onClose, onDeleted }: Props) {
  const handleDelete = async () => {
    await deletePocket(pocket.id);
    await onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Eliminar Bolsillo</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
            <p className="text-sm text-destructive font-semibold">Esta acción no se puede deshacer</p>
          </div>

          <p className="text-sm text-foreground">
            Vas a eliminar <strong>{pocket.name}</strong>. Tiene <strong>{fmt(pocket.balance)}</strong> acumulados.
          </p>

          <p className="text-sm text-muted-foreground">
            El saldo de {fmt(pocket.balance)} se perderá. Si querés conservarlo, transferilo a otro bolsillo antes de eliminar.
          </p>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border border-border rounded-2xl text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button onClick={handleDelete} className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-2xl text-sm font-bold hover:bg-destructive/90 transition-colors shadow-md">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
