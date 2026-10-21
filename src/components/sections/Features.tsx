import { motion } from 'framer-motion';
import { Ambulance, Microscope, Smartphone, Stethoscope } from 'lucide-react';
import { fadeUp, revealOnScroll, stagger } from '../../lib/motion';

const features = [
  {
    icon: Ambulance,
    title: '7/24 Acil Bakım',
    text: 'Tam donanımlı acil servisimiz ve ambulans ekibimizle günün her saati yanınızdayız.',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    icon: Stethoscope,
    title: 'Uzman Hekim Kadrosu',
    text: 'Alanında deneyimli profesör, doçent ve uzman hekimlerden oluşan güçlü bir ekip.',
    gradient: 'from-brand to-blue-500',
  },
  {
    icon: Microscope,
    title: 'Modern Teknoloji',
    text: '3T MR, laparoskopik cerrahi ve dijital görüntüleme ile hızlı ve doğru tanı.',
    gradient: 'from-accent to-cyan-400',
  },
  {
    icon: Smartphone,
    title: 'Online Randevu & Sonuç',
    text: 'Randevunuzu saniyeler içinde alın, tahlil sonuçlarınıza her yerden ulaşın.',
    gradient: 'from-mint to-emerald-400',
  },
];

export function Features() {
  return (
    <div className="bg-surface">
      <motion.div
        variants={stagger(0.1)}
        {...revealOnScroll}
        className="wrap relative z-10 -mt-24 grid gap-5 sm:grid-cols-2 lg:-mt-28 lg:grid-cols-4"
      >
        {features.map((f) => (
          <motion.article
            key={f.title}
            variants={fadeUp}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-slate-900/[0.07] ring-1 ring-slate-100"
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r transition-transform duration-500 group-hover:scale-x-100 ${f.gradient}`}
            />
            <span className={`grid size-12 place-items-center rounded-2xl bg-linear-to-br text-white shadow-lg ${f.gradient}`}>
              <f.icon className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-navy">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
