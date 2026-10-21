import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, ChevronRight, Clock, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { navLinks, site } from '../../data/site';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { hoverTap, stagger } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { Drawer } from '../ui/Drawer';
import { EmergencyButton } from '../ui/EmergencyButton';
import { Logo } from '../ui/Logo';

const sectionIds = navLinks.map((l) => l.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(sectionIds);
  const openAppointment = useAppointment();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          scrolled ? 'bg-white/85 shadow-lg shadow-slate-900/5 backdrop-blur-xl' : 'bg-white'
        }`}
      >
        <nav className="wrap flex h-18 items-center justify-between gap-4" aria-label="Ana menü">
          <a href="#home" aria-label="Ana sayfa">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 xl:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`relative block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active === link.id ? 'text-brand' : 'text-slate-600 hover:text-navy'
                  }`}
                >
                  {active === link.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-accent/10" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <EmergencyButton className="max-sm:hidden" label="Acil Çağrı" />
            <motion.button type="button" {...hoverTap} onClick={() => openAppointment()} className={`${btn.primary} px-4 py-2.5 sm:px-5`}>
              <CalendarCheck className="size-4" />
              <span className="hidden sm:inline">Randevu Al</span>
            </motion.button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={menuOpen}
              className="grid size-11 place-items-center rounded-full bg-slate-100 text-navy transition hover:bg-slate-200 xl:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Header'daki backdrop-filter fixed konumlamayı bozacağı için çekmece header dışında render edilir. */}
      <AnimatePresence>{menuOpen && <MobileMenu active={active} onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ active, onClose }: { active: string; onClose: () => void }) {
  const openAppointment = useAppointment();

  return (
    <Drawer onClose={onClose} label="Mobil menü">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <Logo />
        <button type="button" onClick={onClose} aria-label="Menüyü kapat" className="grid size-10 place-items-center rounded-full bg-slate-100 text-navy">
          <X className="size-5" />
        </button>
      </div>

      <motion.ul variants={stagger(0.05, 0.12)} initial="hidden" animate="show" className="flex-1 space-y-1 overflow-y-auto p-5">
        {navLinks.map((link) => (
          <motion.li key={link.id} variants={{ hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } }}>
            <a
              href={`#${link.id}`}
              onClick={onClose}
              className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors ${
                active === link.id ? 'bg-accent/10 text-brand' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
              <ChevronRight className="size-4 opacity-40" />
            </a>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3 border-t border-slate-100 p-5"
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            openAppointment();
          }}
          className={`${btn.primary} w-full`}
        >
          <CalendarCheck className="size-4" />
          Online Randevu Al
        </button>
        <EmergencyButton className="w-full justify-center py-3" label={`Acil: ${site.emergencyPhone}`} />
        <p className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500">
          <Clock className="size-3.5 text-accent" />
          Acil servisimiz 7/24 hizmetinizde
        </p>
      </motion.div>
    </Drawer>
  );
}
