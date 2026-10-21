import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, LoaderCircle, Moon, Sun } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { toDateKey } from '../../lib/format';
import { slotsFor, upcomingDays, type Slot } from './schedule';

interface DateTimePickerProps {
  /** Veritabanındaki dolu saatler; null ise henüz yükleniyor. */
  booked: Set<string> | null;
  date: string;
  time: string;
  onDate: (date: string) => void;
  onTime: (time: string) => void;
}

const weekday = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' });
const month = new Intl.DateTimeFormat('tr-TR', { month: 'short' });

export function DateTimePicker({ booked, date, time, onDate, onTime }: DateTimePickerProps) {
  const days = useMemo(
    () =>
      booked
        ? upcomingDays(14).map((d) => {
            const key = toDateKey(d);
            return { key, date: d, free: slotsFor(key, booked).filter((s) => s.available).length };
          })
        : [],
    [booked],
  );
  const slots = useMemo(() => (date && booked ? slotsFor(date, booked) : []), [booked, date]);
  const morning = slots.filter((s) => Number(s.time.slice(0, 2)) < 12);
  const afternoon = slots.filter((s) => Number(s.time.slice(0, 2)) >= 12);

  if (!booked) {
    return (
      <div className="grid min-h-[18rem] place-items-center text-sm text-slate-500">
        <span className="flex items-center gap-3">
          <LoaderCircle className="size-5 animate-spin text-accent" />
          Hekimin uygun saatleri yükleniyor…
        </span>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-base font-bold text-navy">Tarih ve saat seçin</h3>
      <p className="mt-1 text-sm text-slate-500">Önümüzdeki 2 hafta içindeki uygun günler listelenmektedir.</p>

      <div className="no-scrollbar -mx-6 mt-5 flex snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-2">
        {days.map(({ key, date: d, free }) => {
          const isSelected = key === date;
          const disabled = free === 0;
          return (
            <motion.button
              key={key}
              type="button"
              disabled={disabled}
              whileHover={disabled ? undefined : { y: -3 }}
              whileTap={disabled ? undefined : { scale: 0.95 }}
              onClick={() => onDate(key)}
              aria-pressed={isSelected}
              className={`flex w-[4.25rem] shrink-0 snap-start flex-col items-center rounded-2xl border px-2 py-3 transition-colors ${
                isSelected
                  ? 'border-transparent bg-linear-to-b from-accent to-mint text-white shadow-lg shadow-sky-500/30'
                  : disabled
                    ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                    : 'border-slate-200 text-navy hover:border-accent/60'
              }`}
            >
              <span className={`text-xs font-semibold uppercase ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{weekday.format(d)}</span>
              <span className="mt-0.5 text-xl font-extrabold">{d.getDate()}</span>
              <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{month.format(d)}</span>
              <span className={`mt-1.5 text-[10px] font-semibold ${isSelected ? 'text-white' : disabled ? '' : 'text-mint'}`}>
                {disabled ? 'Dolu' : `${free} boş`}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {date ? (
          <motion.div key={date} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mt-5 space-y-5">
            <SlotGroup title="Sabah" icon={<Sun className="size-4 text-amber-500" />} slots={morning} selected={time} onSelect={onTime} />
            <SlotGroup title="Öğleden Sonra" icon={<Moon className="size-4 text-indigo-400" />} slots={afternoon} selected={time} onSelect={onTime} />
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <Legend className="border border-slate-200 bg-white" label="Müsait" />
              <Legend className="bg-accent" label="Seçili" />
              <Legend className="bg-slate-100" label="Dolu" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
            <CalendarDays className="size-5 text-accent" />
            Uygun saatleri görmek için yukarıdan bir gün seçin.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SlotGroupProps {
  title: string;
  icon: ReactNode;
  slots: Slot[];
  selected: string;
  onSelect: (time: string) => void;
}

function SlotGroup({ title, icon, slots, selected, onSelect }: SlotGroupProps) {
  if (slots.length === 0) return null;
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-navy">
        {icon}
        {title}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {slots.map((slot) => {
          const isSelected = slot.time === selected;
          return (
            <motion.button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              whileTap={slot.available ? { scale: 0.94 } : undefined}
              onClick={() => onSelect(slot.time)}
              aria-pressed={isSelected}
              className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? 'bg-accent text-white shadow-md shadow-sky-500/30'
                  : slot.available
                    ? 'border border-slate-200 text-navy hover:border-accent hover:text-accent'
                    : 'cursor-not-allowed bg-slate-100 text-slate-300 line-through'
              }`}
            >
              {slot.time}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-3 rounded ${className}`} />
      {label}
    </span>
  );
}
