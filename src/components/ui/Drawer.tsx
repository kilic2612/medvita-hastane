import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useEscape } from '../../hooks/useEscape';
import { useLockBody } from '../../hooks/useLockBody';

interface DrawerProps {
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}

/** Sağdan kayan panel. AnimatePresence içinde render edilmelidir. */
export function Drawer({ onClose, label, children, className = 'max-w-sm' }: DrawerProps) {
  useLockBody();
  useEscape(onClose);

  return (
    <div className="fixed inset-0 z-80">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={label}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 36 }}
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl ${className}`}
      >
        {children}
      </motion.aside>
    </div>
  );
}
