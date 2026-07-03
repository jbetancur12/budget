import { useEffect } from 'react';

interface ToastProps {
  message: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
  onDone: () => void;
}

export function Toast({ message, action, duration = 5000, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-sm font-semibold animate-in slide-in-from-bottom-4">
      {message}
      {action && (
        <button
          onClick={() => {
            action.onClick();
            onDone();
          }}
          className="text-blue-400 dark:text-blue-600 font-bold hover:underline shrink-0"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
