import { AnimatePresence, motion } from 'framer-motion';
import { Info, Search, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { insurances, insuranceTypeLabels, type InsuranceType } from '../../data/insurances';
import { site } from '../../data/site';
import { gridItem } from '../../lib/motion';
import { normalize } from '../../lib/validation';
import { SectionHeading } from '../ui/SectionHeading';

type Filter = 'all' | InsuranceType;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  ...(Object.keys(insuranceTypeLabels) as InsuranceType[]).map((id) => ({ id, label: insuranceTypeLabels[id] })),
];

const tones = ['bg-sky-500', 'bg-teal-500', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500', 'bg-blue-600'];

const toneFor = (name: string) => tones[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % tones.length];
const initialsFor = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

export function Insurance() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = normalize(query);
    return insurances.filter((ins) => (filter === 'all' || ins.types.includes(filter)) && (!q || normalize(ins.name).includes(q)));
  }, [filter, query]);

  return (
    <section id="insurance" className="scroll-mt-20 bg-white py-24">
      <div className="wrap">
        <SectionHeading
          eyebrow="Anlaşmalı Kurumlar"
          title="Sigortanız Bizimle Geçerli"
          description="SGK başta olmak üzere pek çok özel sağlık sigortası, tamamlayıcı sağlık sigortası ve uluslararası sigorta kuruluşu ile anlaşmalıyız."
        />

        <div className="mt-10 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  filter === f.id ? 'border-navy bg-navy text-white' : 'border-slate-200 text-slate-600 hover:border-accent hover:text-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative lg:w-80">
            <span className="sr-only">Kurum ara</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sigorta şirketi ara…"
              className="h-11 w-full rounded-full border border-slate-200 bg-surface pl-11 pr-4 text-sm text-navy placeholder:text-slate-400 transition focus:border-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((ins, i) => (
              <motion.li
                key={ins.name}
                layout
                custom={i}
                variants={gridItem}
                initial="hidden"
                whileInView="show"
                exit="exit"
                viewport={{ once: true }}
                className="group flex items-center gap-4 rounded-2xl bg-surface p-4 ring-1 ring-slate-200/70 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-900/5"
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white shadow-md transition-transform group-hover:scale-110 ${toneFor(ins.name)}`}>
                  {ins.short ?? initialsFor(ins.name)}
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-bold text-navy">{ins.name}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {ins.types.map((t) => (
                      <span key={t} className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-200">
                        {insuranceTypeLabels[t]}
                      </span>
                    ))}
                  </span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {filtered.length === 0 && (
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="size-5 text-slate-300" />
            “{query}” ile eşleşen bir kurum bulunamadı. Güncel anlaşmalar için çağrı merkezimizi arayabilirsiniz.
          </p>
        )}

        <div className="mt-10 flex items-start gap-3 rounded-2xl bg-sky-50 p-5 text-sm text-slate-600 ring-1 ring-sky-100">
          <Info className="mt-0.5 size-5 shrink-0 text-accent" />
          <p>
            Anlaşma kapsamı ve provizyon süreçleri poliçenize göre farklılık gösterebilir. Randevu öncesinde{' '}
            <a href={`tel:${site.tel}`} className="font-bold text-navy underline-offset-2 hover:underline">
              {site.phone}
            </a>{' '}
            numaralı çağrı merkezimizden bilgi alabilirsiniz.
          </p>
        </div>
      </div>
    </section>
  );
}
