import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import * as api from '../api';

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const [rate, setRate] = useState(50);

  useEffect(() => {
    api
      .fetchSettings()
      .then((s) => setRate(s.savingsRate))
      .catch(() => {});
  }, []);

  const save = async () => {
    await api.updateSettings({ savingsRate: rate });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-card sm:border border-border sm:rounded-3xl rounded-t-3xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Configuración</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Porcentaje de ahorro automático
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="font-mono font-bold text-lg text-foreground w-12 text-right">
                {rate}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Calculado al cerrar mes sobre el saldo disponible
            </p>
          </div>
          <button
            onClick={save}
            className="w-full py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
