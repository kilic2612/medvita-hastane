import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, PhoneCall } from 'lucide-react';
import { useEffect, useState } from 'react';
import { site } from '../../data/site';

/** Mobilde sabit acil arama butonu ve tüm ekranlarda yukarı çık butonu. */
export function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.a
        href={`tel:${site.emergencyTel}`}
        aria-label={`Acil hattı ara: ${site.emergencyPhone}`}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-5 left-5 z-40 grid size-14 place-items-center rounded-full bg-emergency text-white shadow-xl shadow-red-500/40 sm:hidden"
      >
        <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full" />
        <PhoneCall className="relative size-6" />
      </motion.a>

      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            aria-label="Sayfanın başına dön"
            onClick={() => window.scrollTo({ top: 0 })}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ y: -4 }}
            className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-navy text-white shadow-xl shadow-slate-900/30 transition-colors hover:bg-brand sm:bottom-6 sm:right-6"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
