import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { site } from '../../data/site';
import { formatDateWithDay } from '../../lib/format';
import { hoverTap } from '../../lib/motion';
import { btn } from '../../lib/styles';

interface AppointmentSuccessProps {
  code: string;
  patient: string;
  tc: string;
  phone: string;
  department?: string;
  doctor?: string;
  date: string;
  time: string;
  onClose: () => void;
}

export function AppointmentSuccess({ code, patient, tc, phone, department, doctor, date, time, onClose }: AppointmentSuccessProps) {
  const rows = [
    ['Hasta', patient],
    ['TC Kimlik No', `${tc.slice(0, 3)}*****${tc.slice(-3)}`],
    ['Bölüm', department],
    ['Hekim', doctor],
    ['Tarih', formatDateWithDay(date)],
    ['Saat', time],
    ['Adres', site.address],
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="relative mx-auto grid size-20 place-items-center rounded-full bg-emerald-100"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-200"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        <svg viewBox="0 0 24 24" className="relative size-10 text-emerald-500" aria-hidden>
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="mt-5 text-2xl font-extrabold text-navy">Randevunuz Oluşturuldu!</h3>
        <p className="mt-2 text-sm text-slate-500">
          Randevu bilgileriniz <strong className="text-navy">{phone}</strong> numarasına SMS ile gönderilecektir.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-auto mt-6 max-w-md overflow-hidden rounded-2xl text-left ring-1 ring-slate-200"
      >
        <div className="flex items-center justify-between bg-linear-to-r from-navy to-brand px-5 py-4 text-white">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-200">Randevu No</span>
          <span className="font-mono text-lg font-bold tracking-wider">{code}</span>
        </div>
        <dl className="divide-y divide-dashed divide-slate-200 px-5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-6 py-2.5 text-sm">
              <dt className="shrink-0 text-slate-500">{label}</dt>
              <dd className="text-right font-semibold text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="mx-auto mt-5 flex max-w-md items-start gap-2 rounded-xl bg-sky-50 p-3 text-left text-xs text-slate-600"
      >
        <Info className="mt-0.5 size-4 shrink-0 text-accent" />
        Lütfen randevu saatinizden 15 dakika önce kimlik belgenizle birlikte hastanemizde olunuz. İptal ve değişiklik için {site.phone} numarasını
        arayabilirsiniz.
      </motion.p>

      <motion.button type="button" {...hoverTap} onClick={onClose} className={`${btn.primary} mt-6 px-10`}>
        Tamam
      </motion.button>
    </div>
  );
}
