import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarCheck, CircleCheck, Star, X } from 'lucide-react';
import { useState } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { categoryLabels, departments, type Department, type DepartmentCategory } from '../../data/departments';
import { doctorsIn } from '../../data/doctors';
import { gridItem, hoverTap } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { Avatar } from '../ui/Avatar';
import { Drawer } from '../ui/Drawer';
import { SectionHeading } from '../ui/SectionHeading';

type Filter = 'all' | DepartmentCategory;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'surgical', label: categoryLabels.surgical },
  { id: 'internal', label: categoryLabels.internal },
  { id: 'diagnostic', label: categoryLabels.diagnostic },
];

export function Departments() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Department | null>(null);
  const visible = filter === 'all' ? departments : departments.filter((d) => d.category === filter);

  return (
    <section id="departments" className="scroll-mt-20 bg-surface py-24">
      <div className="wrap">
        <SectionHeading
          eyebrow="Bölümlerimiz"
          title="Uzmanlık Alanlarımız"
          description="25’ten fazla tıbbi birimimizle tanıdan tedaviye, koruyucu hekimlikten ileri cerrahiye kadar tüm sağlık ihtiyaçlarınız tek çatı altında."
        />

        <div className="no-scrollbar -mx-4 mt-10 flex justify-start overflow-x-auto px-4 sm:justify-center" role="tablist" aria-label="Bölüm kategorileri">
          <div className="flex gap-1 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-slate-200">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  filter === f.id ? 'text-white' : 'text-slate-500 hover:text-navy'
                }`}
              >
                {filter === f.id && (
                  <motion.span layoutId="dept-filter" className="absolute inset-0 rounded-full bg-navy" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((d, i) => (
              <motion.div
                key={d.id}
                layout
                custom={i}
                variants={gridItem}
                initial="hidden"
                whileInView="show"
                exit="exit"
                viewport={{ once: true, margin: '-60px' }}
                whileHover={{ y: -6 }}
              >
                <DepartmentCard department={d} onExplore={() => setSelected(d)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{selected && <DepartmentDrawer department={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  );
}

function DepartmentCard({ department: d, onExplore }: { department: Department; onExplore: () => void }) {
  const doctorCount = doctorsIn(d.id).length;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-slate-200/70 transition-shadow duration-300 hover:shadow-2xl hover:shadow-slate-900/10">
      <span aria-hidden className={`absolute -right-12 -top-12 size-40 rounded-full bg-linear-to-br opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-30 ${d.gradient}`} />
      <div className="flex items-start justify-between">
        <span className={`grid size-14 place-items-center rounded-2xl bg-linear-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${d.gradient}`}>
          <d.icon className="size-7" />
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{categoryLabels[d.category]}</span>
      </div>
      <h3 className="mt-6 text-xl font-bold text-navy">{d.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{d.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {d.treatments.slice(0, 3).map((t) => (
          <li key={t} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-7">
        <button type="button" onClick={onExplore} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand transition-colors hover:text-accent">
          Bölümü İncele
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
        <span className="text-xs font-medium text-slate-400">{doctorCount} hekim</span>
      </div>
    </article>
  );
}

function DepartmentDrawer({ department: d, onClose }: { department: Department; onClose: () => void }) {
  const openAppointment = useAppointment();
  const team = doctorsIn(d.id);

  const book = (doctorId?: string) => {
    onClose();
    openAppointment({ departmentId: d.id, doctorId });
  };

  return (
    <Drawer onClose={onClose} label={d.name} className="max-w-md">
      <div className={`relative overflow-hidden bg-linear-to-br p-6 pb-8 text-white ${d.gradient}`}>
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/15" />
        <span aria-hidden className="absolute -bottom-16 right-16 size-32 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <d.icon className="size-7" />
          </span>
          <button type="button" onClick={onClose} aria-label="Kapat" className="grid size-10 place-items-center rounded-full bg-white/20 transition hover:bg-white/30">
            <X className="size-5" />
          </button>
        </div>
        <p className="relative mt-5 text-xs font-bold uppercase tracking-widest text-white/70">{categoryLabels[d.category]} Bölüm</p>
        <h3 className="relative mt-1 text-2xl font-extrabold">{d.name}</h3>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto p-6">
        <p className="leading-relaxed text-slate-600">{d.description}</p>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-navy">Tedavi ve Hizmetler</h4>
          <ul className="mt-4 grid gap-2.5">
            {d.treatments.map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-3 text-sm text-slate-600"
              >
                <CircleCheck className="size-5 shrink-0 text-mint" />
                {t}
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-navy">Bölüm Hekimleri</h4>
          <ul className="mt-4 space-y-3">
            {team.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 rounded-2xl p-3 ring-1 ring-slate-200">
                <Avatar src={doc.photo} name={doc.name} className="size-12 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-navy">
                    {doc.title} {doc.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {doc.rating.toFixed(1)} · {doc.experience} yıl deneyim
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => book(doc.id)}
                  className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent hover:text-white"
                >
                  Randevu
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 p-5">
        <motion.button type="button" {...hoverTap} onClick={() => book()} className={`${btn.primary} w-full`}>
          <CalendarCheck className="size-4" />
          Bu Bölümden Randevu Al
        </motion.button>
      </div>
    </Drawer>
  );
}
