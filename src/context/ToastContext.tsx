import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Loader2,
  Download,
  ExternalLink,
} from 'lucide-react';

export type ToastType = 'loading' | 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  progress?: number;
  downloadUrl?: string;
  filename?: string;
  duration?: number;
  createdAt: number;
}

export interface ShowToastOptions {
  type?: ToastType;
  message?: string;
  progress?: number;
  downloadUrl?: string;
  filename?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => string;
  updateToast: (id: string, updates: Partial<ToastItem>) => void;
  dismissToast: (id: string) => void;
  toast: {
    loading: (title: string, options?: Omit<ShowToastOptions, 'type'>) => string;
    success: (title: string, options?: Omit<ShowToastOptions, 'type'>) => string;
    error: (title: string, options?: Omit<ShowToastOptions, 'type'>) => string;
    info: (title: string, options?: Omit<ShowToastOptions, 'type'>) => string;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismissToast = useCallback((id: string) => {
    // Clear timer if running
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (item: Omit<ToastItem, 'id' | 'createdAt'>): string => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
      const defaultDuration =
        item.duration !== undefined
          ? item.duration
          : item.type === 'loading'
          ? 0 // loading toasts don't auto-dismiss until updated
          : item.type === 'error'
          ? 7000
          : 5000;

      const newToast: ToastItem = {
        ...item,
        id,
        duration: defaultDuration,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);

      if (defaultDuration > 0) {
        const timer = setTimeout(() => {
          dismissToast(id);
        }, defaultDuration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismissToast]
  );

  const updateToast = useCallback(
    (id: string, updates: Partial<ToastItem>) => {
      setToasts((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updated = { ...t, ...updates };

            // Reset or adjust auto-dismiss timer if type changed from loading
            if (updates.type && updates.type !== 'loading') {
              if (timersRef.current.has(id)) {
                clearTimeout(timersRef.current.get(id));
                timersRef.current.delete(id);
              }
              const duration = updates.duration ?? (updates.type === 'error' ? 7000 : 5000);
              if (duration > 0) {
                const timer = setTimeout(() => {
                  dismissToast(id);
                }, duration);
                timersRef.current.set(id, timer);
              }
            }

            return updated;
          }
          return t;
        })
      );
    },
    [dismissToast]
  );

  const toastHelpers = {
    loading: (title: string, options?: Omit<ShowToastOptions, 'type'>) =>
      showToast({ type: 'loading', title, ...options }),
    success: (title: string, options?: Omit<ShowToastOptions, 'type'>) =>
      showToast({ type: 'success', title, ...options }),
    error: (title: string, options?: Omit<ShowToastOptions, 'type'>) =>
      showToast({ type: 'error', title, ...options }),
    info: (title: string, options?: Omit<ShowToastOptions, 'type'>) =>
      showToast({ type: 'info', title, ...options }),
    dismiss: (id: string) => dismissToast(id),
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        updateToast,
        dismissToast,
        toast: toastHelpers,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Global Toast Container Component
const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="global-toast-container"
      className="fixed bottom-5 right-5 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96 pointer-events-none select-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 text-slate-800 relative overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          {/* Top colored accent indicator line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${
              toast.type === 'loading'
                ? 'bg-blue-600'
                : toast.type === 'success'
                ? 'bg-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-500'
                : 'bg-indigo-500'
            }`}
          />

          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'loading' && (
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
              {toast.type === 'success' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs animate-in zoom-in-50 duration-200">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'error' && (
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs animate-in zoom-in-50 duration-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Info className="w-4 h-4" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                  {toast.title}
                </h4>
                {toast.filename && (
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {toast.filename}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message / Description */}
          {toast.message && (
            <p className="text-xs text-slate-600 leading-snug mt-2">
              {toast.message}
            </p>
          )}

          {/* Progress bar for loading state */}
          {toast.type === 'loading' && toast.progress !== undefined && (
            <div className="mt-3 space-y-1.5">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/60 p-0.5">
                <div
                  style={{ width: `${Math.max(5, toast.progress)}%` }}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 h-full rounded-full transition-all duration-300"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                <span>Processing</span>
                <span className="text-blue-600 tabular-nums">{toast.progress}%</span>
              </div>
            </div>
          )}

          {/* Action buttons on success */}
          {toast.type === 'success' && toast.downloadUrl && (
            <div className="flex items-center gap-2 mt-3 pt-1">
              <a
                href={toast.downloadUrl}
                download={toast.filename || 'SmartCV.pdf'}
                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </a>
              <a
                href={toast.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Open</span>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
