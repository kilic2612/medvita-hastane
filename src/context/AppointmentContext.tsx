import { AnimatePresence } from 'framer-motion';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AppointmentModal } from '../components/appointment/AppointmentModal';

export interface AppointmentPreset {
  departmentId?: string;
  doctorId?: string;
}

const AppointmentContext = createContext<((preset?: AppointmentPreset) => void) | null>(null);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; preset: AppointmentPreset; key: number }>({
    open: false,
    preset: {},
    key: 0,
  });

  const open = useCallback((preset: AppointmentPreset = {}) => setState((s) => ({ open: true, preset, key: s.key + 1 })), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <AppointmentContext.Provider value={open}>
      {children}
      {/* key her açılışta değişir; modal durumu sıfırdan, verilen ön seçimlerle başlar. */}
      <AnimatePresence>{state.open && <AppointmentModal key={state.key} preset={state.preset} onClose={close} />}</AnimatePresence>
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) throw new Error('useAppointment, AppointmentProvider içinde kullanılmalıdır.');
  return ctx;
}
