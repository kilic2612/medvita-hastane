import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';
import { site } from '../../data/site';

interface EmergencyButtonProps {
  label?: string;
  className?: string;
  href?: string;
}

/** Dikkat çeken ama rahatsız etmeyen, nabız gibi atan acil arama butonu. */
export function EmergencyButton({ label = 'Acil', className = '', href = `tel:${site.emergencyTel}` }: EmergencyButtonProps) {
  return (
    <motion.a
      href={href}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`relative inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-emergency px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/40 ${className}`}
    >
      <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full" />
      <span className="relative inline-flex items-center gap-2">
        <PhoneCall className="size-4" />
        {label}
      </span>
    </motion.a>
  );
}
