import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

type SWState = 'idle' | 'waiting' | 'updated';

export function PwaUpdatePrompt() {
  const [state, setState] = useState<SWState>('idle');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState('updated');
      });
    }
  }, []);

  if (state === 'idle') return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="bg-card border border-border rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 max-w-sm">
        <p className="text-sm text-foreground">
          {state === 'waiting' ? 'Nueva versión disponible' : 'Actualizada correctamente'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-xs font-bold hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Recargar
        </button>
      </div>
    </div>
  );
}
