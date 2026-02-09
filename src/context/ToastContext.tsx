import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string, durationMs?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4000;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, number>());

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(item => item.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((type: ToastType, message: string, durationMs?: number) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts(prev => [...prev, { id, type, message }]);

    const duration = typeof durationMs === 'number' ? durationMs : DEFAULT_DURATION;
    const timer = window.setTimeout(() => {
      dismissToast(id);
    }, duration);
    timersRef.current.set(id, timer);
  }, [dismissToast]);

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [toasts, showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[min(360px,90vw)] flex-col gap-3">
        {toasts.map(item => (
          <div
            key={item.id}
            role={item.type === 'error' ? 'alert' : 'status'}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-xl backdrop-blur-xl ${
              item.type === 'success'
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
                : item.type === 'error'
                ? 'border-rose-400/40 bg-rose-400/10 text-rose-100'
                : 'border-caramel/30 bg-caramel/10 text-cream'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{item.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                className="text-xs uppercase tracking-[0.3em] text-cream/70 transition hover:text-cream cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};
