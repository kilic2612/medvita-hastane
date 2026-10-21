import { AnimatePresence, motion } from 'framer-motion';
import { Clock, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { useToast } from '../../context/ToastContext';
import { departments } from '../../data/departments';
import { legalDocs, type LegalDocId } from '../../data/legal';
import { navLinks, site } from '../../data/site';
import { isValidEmail } from '../../lib/validation';
import { AlreadySubscribedError, subscribeNewsletter } from '../../services/api';
import { Logo } from '../ui/Logo';
import { Modal } from '../ui/Modal';
import { SocialIcons } from '../ui/SocialIcons';

export function Footer() {
  const [legal, setLegal] = useState<LegalDocId | null>(null);
  const openAppointment = useAppointment();

  return (
    <footer className="relative overflow-hidden bg-navy text-slate-400">
      <span aria-hidden className="absolute -left-40 top-0 size-96 rounded-full bg-accent/10 blur-3xl" />
      <span aria-hidden className="absolute -right-40 bottom-0 size-96 rounded-full bg-mint/10 blur-3xl" />

      <div className="wrap relative">
        <Newsletter />

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              Uzman kadromuz, ileri teknolojimiz ve hasta odaklı yaklaşımımızla 7/24 yanınızdayız. Sağlığınız bizim için her şeyden önce gelir.
            </p>
            <div className="mt-6">
              <SocialIcons />
            </div>
          </div>

          <FooterColumn title="Hızlı Erişim" className="lg:col-span-2">
            {navLinks.map((l) => (
              <li key={l.id}>
                <FooterLink href={`#${l.id}`}>{l.label}</FooterLink>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => openAppointment()} className={footerLinkClass}>
                Online Randevu
              </button>
            </li>
          </FooterColumn>

          <FooterColumn title="Bölümler" className="lg:col-span-3">
            {departments.slice(0, 7).map((d) => (
              <li key={d.id}>
                <button type="button" onClick={() => openAppointment({ departmentId: d.id })} className={`${footerLinkClass} text-left`}>
                  {d.name}
                </button>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="İletişim" className="lg:col-span-3">
            <li className="flex gap-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              {site.address}
            </li>
            <li>
              <a href={`tel:${site.tel}`} className="flex gap-3 text-sm transition-colors hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`tel:${site.emergencyTel}`} className="flex gap-3 text-sm font-semibold text-red-400 transition-colors hover:text-red-300">
                <Phone className="mt-0.5 size-4 shrink-0" />
                Acil: {site.emergencyPhone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 text-sm transition-colors hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                {site.email}
              </a>
            </li>
            <li className="flex gap-3 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0 text-accent" />
              Acil servis 7/24 açık
            </li>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}. Tüm hakları saklıdır.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(legalDocs) as LegalDocId[]).map((id) => (
              <li key={id}>
                <button type="button" onClick={() => setLegal(id)} className="transition-colors hover:text-white">
                  {legalDocs[id].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="pb-8 text-[11px] leading-relaxed text-slate-500">
          Bu sitede yer alan bilgiler yalnızca bilgilendirme amaçlıdır ve hekim muayenesinin yerine geçmez. Tanı ve tedavi için mutlaka bir sağlık
          kuruluşuna başvurunuz.
        </p>
      </div>

      <AnimatePresence>
        {legal && (
          <Modal onClose={() => setLegal(null)} label={legalDocs[legal].title} className="max-w-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-navy">{legalDocs[legal].title}</h2>
              <button
                type="button"
                onClick={() => setLegal(null)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
              >
                Kapat
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-slate-600">
              {legalDocs[legal].paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

const footerLinkClass = 'inline-block text-sm transition duration-200 hover:translate-x-1 hover:text-white';

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={footerLinkClass}>
      {children}
    </a>
  );
}

function Newsletter() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!isValidEmail(email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await subscribeNewsletter(email);
      setEmail('');
      toast({ type: 'success', title: 'Bültene abone oldunuz', description: 'Sağlık rehberimizdeki yeni içerikler e-postanıza gelecek.' });
    } catch (err) {
      if (err instanceof AlreadySubscribedError) {
        setEmail('');
        toast({ type: 'info', title: 'Zaten abonesiniz', description: 'Bu e-posta adresi bültenimize kayıtlı.' });
      } else {
        toast({ type: 'error', title: 'Abonelik tamamlanamadı', description: 'Lütfen daha sonra tekrar deneyin.' });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative -mb-px flex flex-col gap-6 border-b border-white/10 py-12 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 className="text-2xl font-extrabold text-white">Sağlık bültenimize abone olun</h3>
        <p className="mt-2 text-sm">Hekimlerimizden sağlık önerileri ve check-up kampanyaları ayda bir e-postanızda.</p>
      </div>
      <form onSubmit={submit} noValidate className="w-full lg:max-w-md">
        <div className={`flex rounded-full bg-white/5 p-1.5 ring-1 transition focus-within:ring-2 ${error ? 'ring-red-400' : 'ring-white/15 focus-within:ring-accent'}`}>
          <label htmlFor="newsletter-email" className="sr-only">
            E-posta adresi
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="E-posta adresiniz"
            className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <motion.button
            type="submit"
            disabled={busy}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-linear-to-r from-accent to-mint px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            Abone Ol
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
          </motion.button>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 pl-4 text-xs text-red-400">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
