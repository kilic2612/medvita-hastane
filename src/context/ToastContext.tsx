import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

type ToastInput = Omit<ToastItem, 'id'>;

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

const variants: Record<ToastType, { icon: LucideIcon; accent: string; bar: string }> = {
  success: { icon: CircleCheck, accent: 'text-emerald-500 bg-emerald-50', bar: 'bg-emerald-500' },
  error: { icon: CircleAlert, accent: 'text-emergency bg-red-50', bar: 'bg-emergency' },
  info: { icon: Info, accent: 'text-accent bg-sky-50', bar: 'bg-accent' },
};

const DURATION = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-100 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { icon: Icon, accent, bar } = variants[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl bg-white p-4 pr-10 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 sm:w-96"
              >
                <span className={`grid size-9 shrink-0 place-items-center rounded-full ${accent}`}>
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-navy">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-sm text-slate-500">{t.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label="Bildirimi kapat"
                  className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-navy"
                >
                  <X className="size-4" />
                </button>
                <motion.span
                  className={`absolute inset-x-0 bottom-0 h-1 origin-left ${bar}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: DURATION / 1000, ease: 'linear' }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast, ToastProvider içinde kullanılmalıdır.');
  return ctx;
}
