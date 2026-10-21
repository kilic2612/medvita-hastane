import { AnimatePresence, motion } from 'framer-motion';
import { Award, CalendarCheck, ChevronDown, Languages, Search, Star, UserRoundSearch, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { departments, getDepartment } from '../../data/departments';
import { doctors, type Doctor } from '../../data/doctors';
import { gridItem, hoverTap } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { normalize } from '../../lib/validation';
import { Avatar } from '../ui/Avatar';
import { SectionHeading } from '../ui/SectionHeading';

const INITIAL_COUNT = 8;

export function Doctors() {
  const [query, setQuery] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return doctors.filter((doc) => {
      if (departmentId !== 'all' && doc.departmentId !== departmentId) return false;
      if (!q) return true;
      const haystack = normalize(`${doc.title} ${doc.name} ${doc.specialty} ${getDepartment(doc.departmentId)?.name ?? ''}`);
      return haystack.includes(q);
    });
  }, [query, departmentId]);

  const isFiltering = query.trim() !== '' || departmentId !== 'all';
  const visible = isFiltering || showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  const reset = () => {
    setQuery('');
    setDepartmentId('all');
  };

  return (
    <section id="doctors" className="scroll-mt-20 bg-white py-24">
      <div className="wrap">
        <SectionHeading
          eyebrow="Doktorlarımız"
          title="Alanında Uzman Hekim Kadromuz"
          description="Deneyimli hekimlerimizi isim, uzmanlık alanı veya bölüme göre arayın ve dilediğiniz hekimden doğrudan randevu alın."
        />

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Hekim ara</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hekim adı veya uzmanlık ara… (ör. kardiyoloji, Ayşe)"
              className="h-13 w-full rounded-2xl border border-slate-200 bg-surface pl-12 pr-11 text-sm text-navy placeholder:text-slate-400 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100 [&::-webkit-search-cancel-button]:hidden"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={() => setQuery('')}
                  aria-label="Aramayı temizle"
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300"
                >
                  <X className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </label>
          <label className="relative sm:w-64">
            <span className="sr-only">Bölüm seç</span>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="h-13 w-full appearance-none rounded-2xl border border-slate-200 bg-surface pl-4 pr-10 text-sm font-medium text-navy transition focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
            >
              <option value="all">Tüm bölümler</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </label>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500" aria-live="polite">
          {filtered.length} hekim listeleniyor
        </p>

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-12 max-w-md text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-sky-50 text-accent">
              <UserRoundSearch className="size-8" />
            </span>
            <p className="mt-4 font-bold text-navy">Aramanızla eşleşen hekim bulunamadı</p>
            <p className="mt-1 text-sm text-slate-500">Farklı bir isim veya uzmanlık alanı deneyebilirsiniz.</p>
            <button type="button" onClick={reset} className={`${btn.outline} mt-5`}>
              Filtreleri Temizle
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  layout
                  custom={i}
                  variants={gridItem}
                  initial="hidden"
                  whileInView="show"
                  exit="exit"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <DoctorCard doctor={doc} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isFiltering && filtered.length > INITIAL_COUNT && (
          <div className="mt-12 text-center">
            <motion.button type="button" {...hoverTap} onClick={() => setShowAll((s) => !s)} className={btn.outline}>
              {showAll ? 'Daha Az Göster' : `Tüm Hekimleri Göster (${filtered.length})`}
              <ChevronDown className={`size-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}

function DoctorCard({ doctor: doc }: { doctor: Doctor }) {
  const openAppointment = useAppointment();
  const department = getDepartment(doc.departmentId);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/10">
      <div className="relative h-24 bg-linear-to-br from-sky-100 via-cyan-50 to-teal-100">
        <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy shadow-sm backdrop-blur">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          {doc.rating.toFixed(1)}
          <span className="font-medium text-slate-400">({doc.reviews})</span>
        </span>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-linear-to-br from-accent to-mint p-1 shadow-lg transition-transform duration-500 group-hover:scale-105">
            <Avatar src={doc.photo} name={doc.name} className="size-24 rounded-full border-4 border-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-16 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{department?.name}</p>
        <h3 className="mt-1.5 text-lg font-bold text-navy">
          {doc.title} {doc.name}
        </h3>
        <p className="text-sm text-slate-500">{doc.specialty}</p>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Award className="size-4 text-mint" />
            {doc.experience} yıl deneyim
          </span>
          <span className="inline-flex items-center gap-1">
            <Languages className="size-4 text-mint" />
            {doc.languages.join(' · ')}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <motion.button
            type="button"
            {...hoverTap}
            onClick={() => openAppointment({ departmentId: doc.departmentId, doctorId: doc.id })}
            aria-label={`${doc.title} ${doc.name} ile randevu al`}
            className={`${btn.dark} w-full px-4 group-hover:bg-brand`}
          >
            <CalendarCheck className="size-4 shrink-0" />
            <span className="truncate">Dr. {doc.name.split(' ').at(-1)} ile Randevu Al</span>
          </motion.button>
        </div>
      </div>
    </article>
  );
}
