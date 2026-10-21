import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BedDouble, Building2, CircleCheck, HeartHandshake, Phone, ShieldCheck, Smile } from 'lucide-react';
import { useState } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { site } from '../../data/site';
import { fadeUp, hoverTap, revealOnScroll, stagger } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { SectionHeading } from '../ui/SectionHeading';

const tabs = [
  {
    id: 'mission',
    label: 'Misyonumuz',
    text: 'Bilimsel temelli, etik ve hasta odaklı sağlık hizmetini; güler yüzlü, güvenli ve erişilebilir biçimde sunarak toplum sağlığına katkıda bulunmak.',
  },
  {
    id: 'vision',
    label: 'Vizyonumuz',
    text: 'Tıbbi kalitesi, teknolojik altyapısı ve hasta deneyimiyle bölgesinde örnek gösterilen, uluslararası standartlarda bir sağlık kurumu olmak.',
  },
  {
    id: 'values',
    label: 'Değerlerimiz',
    text: 'Hasta güvenliği, şeffaflık, mahremiyete saygı, sürekli gelişim ve ekip çalışması tüm kararlarımızın merkezinde yer alır.',
  },
];

const highlights = [
  'Uluslararası hasta güvenliği ve kalite standartları',
  'Tam donanımlı yoğun bakım ve ameliyathaneler',
  'Tüm tetkik sonuçlarına online erişim',
  'Anlaşmalı kurumlarla kolay provizyon süreci',
];

export function About() {
  const [tab, setTab] = useState(tabs[0].id);
  const openAppointment = useAppointment();
  const activeTab = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <section id="about" className="scroll-mt-20 overflow-hidden bg-surface py-24">
      <div className="wrap grid items-center gap-16 lg:grid-cols-2">
        <motion.div variants={stagger(0.12)} {...revealOnScroll} className="relative grid grid-cols-2 gap-4 sm:gap-5">
          <motion.div
            variants={fadeUp}
            className="relative col-span-2 overflow-hidden rounded-3xl bg-linear-to-br from-brand to-accent p-8 text-white shadow-2xl shadow-sky-900/20 sm:col-span-1 sm:row-span-2 sm:flex sm:flex-col sm:justify-between"
          >
            <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
            <span aria-hidden className="absolute -bottom-12 -left-8 size-36 rounded-full bg-white/10" />
            <Building2 className="relative size-10 text-sky-100" />
            <div className="relative mt-10">
              <p className="text-6xl font-extrabold">25+</p>
              <p className="mt-2 text-lg font-semibold text-sky-100">Yıllık sağlık tecrübesi</p>
              <p className="mt-4 text-sm leading-relaxed text-sky-100/80">
                1999’dan bu yana binlerce ailenin güvendiği sağlık kurumu olarak hizmet veriyoruz.
              </p>
            </div>
          </motion.div>
          <StatTile icon={ShieldCheck} value="%100" label="Akredite kalite süreçleri" tone="bg-teal-50 text-mint" />
          <StatTile icon={Smile} value="%98" label="Hasta memnuniyeti" tone="bg-amber-50 text-amber-500" />
          <StatTile icon={BedDouble} value="350" label="Yatak kapasitesi" tone="bg-sky-50 text-accent" className="col-span-2 flex items-center gap-5 sm:gap-6" inline />
        </motion.div>

        <div>
          <SectionHeading align="left" eyebrow="Hakkımızda" title="Modern Tıbbın Güvenilir Adresi" />
          <motion.p variants={fadeUp} {...revealOnScroll} className="mt-5 leading-relaxed text-slate-500">
            {site.fullName}, 350 yatak kapasitesi, 12 ameliyathanesi ve 600’ü aşkın sağlık profesyoneliyle her yaştan hastasına kapsamlı sağlık
            hizmeti sunar. Teşhisten taburculuğa kadar her adımda hasta güvenliğini ve konforunu ön planda tutarız.
          </motion.p>

          <div className="mt-8">
            <div className="flex gap-1 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${tab === t.id ? 'text-white' : 'text-slate-500 hover:text-navy'}`}
                >
                  {tab === t.id && <motion.span layoutId="about-tab" className="absolute inset-0 rounded-full bg-linear-to-r from-accent to-mint" />}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="relative mt-5 min-h-24">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab.id}
                  role="tabpanel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-3 rounded-2xl bg-white p-5 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200"
                >
                  <HeartHandshake className="size-5 shrink-0 text-accent" />
                  {activeTab.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <motion.ul variants={stagger(0.08)} {...revealOnScroll} className="mt-6 grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <motion.li key={h} variants={fadeUp} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                <CircleCheck className="mt-0.5 size-5 shrink-0 text-mint" />
                {h}
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <motion.button type="button" {...hoverTap} onClick={() => openAppointment()} className={btn.primary}>
              Randevu Oluştur
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <a href={`tel:${site.tel}`} className="group flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-white text-accent shadow-md ring-1 ring-slate-200 transition group-hover:bg-accent group-hover:text-white">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-xs text-slate-500">Çağrı Merkezi</span>
                <span className="block font-bold text-navy">{site.phone}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatTileProps {
  icon: typeof ShieldCheck;
  value: string;
  label: string;
  tone: string;
  className?: string;
  inline?: boolean;
}

function StatTile({ icon: Icon, value, label, tone, className = '', inline = false }: StatTileProps) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -6 }} className={`rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-100 ${className}`}>
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${tone}`}>
        <Icon className="size-6" />
      </span>
      <div className={inline ? '' : 'mt-5'}>
        <p className="text-3xl font-extrabold text-navy">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}
