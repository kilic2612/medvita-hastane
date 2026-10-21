import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Clock, Globe, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { site } from '../../data/site';

const languages = [
  { code: 'TR', label: 'Türkçe', available: true },
  { code: 'EN', label: 'English', available: false },
];

function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <Globe className="size-4" />
        TR
        <ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-60 mt-2 w-44 origin-top-right overflow-hidden rounded-xl bg-white p-1 text-sm text-slate-700 shadow-xl ring-1 ring-slate-200"
          >
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={!lang.available}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {lang.label}
                  {lang.available ? (
                    <Check className="size-4 text-accent" />
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Yakında</span>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopBar() {
  return (
    <div className="bg-navy text-xs text-slate-300 sm:text-sm">
      <div className="wrap flex h-10 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-6">
          <a href={`tel:${site.emergencyTel}`} className="flex items-center gap-2 font-medium text-white">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emergency" />
            </span>
            <span className="hidden sm:inline">7/24 Acil Hat:</span>
            <span className="sm:hidden">Acil:</span>
            <strong className="font-bold">{site.emergencyPhone}</strong>
          </a>
          <span className="hidden items-center gap-2 md:flex">
            <Clock className="size-4 text-accent" />
            Pzt–Cuma 08:00–20:00 · Cmt 09:00–17:00
          </span>
          <a href={`mailto:${site.email}`} className="hidden items-center gap-2 transition hover:text-white xl:flex">
            <Mail className="size-4 text-accent" />
            {site.email}
          </a>
        </div>
        <LanguageSelector />
      </div>
    </div>
  );
}
