import { motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { useEscape } from '../../hooks/useEscape';
import { useLockBody } from '../../hooks/useLockBody';

interface ModalProps {
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}

/** AnimatePresence içinde render edilmelidir; arka plan kararır, panel ölçeklenerek açılır. */
export function Modal({ onClose, label, children, className = 'max-w-2xl' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBody();
  useEscape(onClose);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="fixed inset-0 z-90 flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.94, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
