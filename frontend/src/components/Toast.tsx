import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-transform duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-white/95 dark:bg-zinc-900/95 border-emerald-500/30 text-zinc-900 dark:text-white'
              : toast.type === 'error'
              ? 'bg-white/95 dark:bg-zinc-900/95 border-rose-500/30 text-zinc-900 dark:text-white'
              : 'bg-white/95 dark:bg-zinc-900/95 border-indigo-500/30 text-zinc-900 dark:text-white'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-500" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold leading-snug">{toast.title}</div>
            {toast.description && (
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                {toast.description}
              </div>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
