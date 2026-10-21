import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, CalendarCheck, FileText, HeartPulse, ShieldCheck, Smartphone, Star } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { doctors } from '../../data/doctors';
import { fadeUp, hoverTap, stagger } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { Avatar } from '../ui/Avatar';
import { StatCounter } from './StatCounter';

const stats = [
  { value: 50, suffix: '+', label: 'Uzman Hekim' },
  { value: 100, suffix: ' Bin+', label: 'Mutlu Hasta' },
  { value: 24, prefix: '7/', label: 'Acil Servis' },
  { value: 25, suffix: '+', label: 'Tıbbi Bölüm' },
];

export function Hero() {
  const openAppointment = useAppointment();

  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden bg-navy pb-36 pt-14 text-white sm:pt-20 lg:pb-44 lg:pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-navy via-brand/70 to-navy" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />
        <motion.div
          className="absolute -left-32 top-0 size-[26rem] rounded-full bg-accent/30 blur-3xl will-change-transform"
          animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 size-[30rem] rounded-full bg-mint/20 blur-3xl will-change-transform"
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="wrap relative grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <motion.div variants={stagger(0.12)} initial="hidden" animate="show">
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-sky-100 backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-mint" />
            </span>
            7/24 kesintisiz sağlık hizmeti
          </motion.span>

          <motion.h1 variants={fadeUp} className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Sağlığınız,{' '}
            <span className="bg-linear-to-r from-accent via-cyan-300 to-mint bg-clip-text text-transparent">Tutkumuz</span>
            <br className="hidden sm:block" /> ve Hassasiyetimiz
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Alanında uzman 50’den fazla hekimimiz, 7/24 açık acil servisimiz ve son teknoloji tıbbi cihazlarımızla size ve sevdiklerinize en
            iyi bakımı sunuyoruz.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
            <motion.button type="button" {...hoverTap} onClick={() => openAppointment()} className={`${btn.primary} px-7 py-3.5 text-base`}>
              <CalendarCheck className="size-5" />
              Randevu Al
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.a href="#departments" {...hoverTap} className={`${btn.ghostLight} px-7 py-3.5 text-base`}>
              Bölümleri Keşfet
            </motion.a>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 sm:flex sm:justify-between">
            {stats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </motion.dl>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}

const ecgPath =
  'M0 50 H40 L48 50 L54 38 L60 50 L68 50 L74 12 L82 88 L90 50 L104 50 L112 40 L122 50 H160 L168 50 L174 38 L180 50 L188 50 L194 12 L202 88 L210 50 L224 50 L232 40 L242 50 H300';

function HeroVisual() {
  const doctor = doctors[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md lg:max-w-lg"
    >
      <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-200/70">Canlı Hasta Monitörü</p>
            <p className="mt-1 text-sm text-slate-300">Kardiyoloji Yoğun Bakım</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Stabil
          </span>
        </div>

        <div className="mt-6 flex items-end gap-4">
          <motion.span
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 0.83, repeat: Infinity, ease: 'easeInOut' }}
            className="grid size-14 place-items-center rounded-2xl bg-rose-500/20 text-rose-400"
          >
            <HeartPulse className="size-7" />
          </motion.span>
          <div>
            <p className="text-5xl font-extrabold leading-none tabular-nums">72</p>
            <p className="mt-1 text-sm text-slate-400">nabız / dakika</p>
          </div>
        </div>

        <svg viewBox="0 0 300 100" className="mt-5 h-24 w-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="ecg" x1="0" x2="1">
              <stop offset="0" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
          <path d={ecgPath} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={2} />
          <motion.path
            d={ecgPath}
            fill="none"
            stroke="url(#ecg)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.2 }}
          />
        </svg>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Tansiyon', value: '120/80' },
            { label: 'SpO₂', value: '%98' },
            { label: 'Ateş', value: '36.6°' },
          ].map((m) => (
            <div key={m.label} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <p className="text-xs text-slate-400">{m.label}</p>
              <p className="mt-1 text-lg font-bold">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3 text-navy">
          <Avatar src={doctor.photo} name={doctor.name} className="size-11 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">
              {doctor.title} {doctor.name}
            </p>
            <p className="text-xs text-slate-500">Nöbetçi Kardiyolog</p>
          </div>
          <BadgeCheck className="size-6 shrink-0 text-accent" />
        </div>
      </div>

      <FloatingCard className="-left-6 -top-12 sm:-left-12" delay={0}>
        <span className="grid size-10 place-items-center rounded-xl bg-sky-100 text-accent">
          <Smartphone className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold">Hızlı Online Check-in</p>
          <p className="text-xs text-slate-500">2 dakikada tamamlayın</p>
        </div>
      </FloatingCard>

      <FloatingCard className="-right-4 top-1/3 sm:-right-10" delay={1.2}>
        <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-500">
          <Star className="size-5 fill-current" />
        </span>
        <div>
          <p className="text-sm font-bold">4.9 / 5</p>
          <p className="text-xs text-slate-500">Hasta memnuniyeti</p>
        </div>
      </FloatingCard>

      <FloatingCard className="-bottom-12 -left-4 sm:-left-8" delay={2.4}>
        <span className="grid size-10 place-items-center rounded-xl bg-teal-100 text-mint">
          <FileText className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold">Dijital Sağlık Kayıtları</p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <ShieldCheck className="size-3 text-mint" /> Sonuçlar anında cebinizde
          </p>
        </div>
      </FloatingCard>
    </motion.div>
  );
}

function FloatingCard({ className, delay, children }: { className: string; delay: number; children: ReactNode }) {
  return (
    <motion.div
      className={`absolute hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 text-navy shadow-2xl shadow-black/20 sm:flex ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay: 0.8 + delay * 0.2, duration: 0.5 },
        scale: { delay: 0.8 + delay * 0.2, duration: 0.5 },
        y: { delay, duration: 5, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {children}
    </motion.div>
  );
}
