import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { departments } from '../../data/departments';

interface DepartmentStepProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function DepartmentStep({ selected, onSelect }: DepartmentStepProps) {
  return (
    <div>
      <h3 className="text-base font-bold text-navy">Hangi bölümden randevu almak istiyorsunuz?</h3>
      <p className="mt-1 text-sm text-slate-500">Şikâyetinize uygun bölümü seçin.</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {departments.map((d) => {
          const isSelected = d.id === selected;
          return (
            <motion.button
              key={d.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(d.id)}
              aria-pressed={isSelected}
              className={`relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                isSelected ? 'border-accent bg-sky-50 ring-2 ring-accent/30' : 'border-slate-200 hover:border-accent/50 hover:bg-slate-50'
              }`}
            >
              <span className={`grid size-10 place-items-center rounded-xl bg-linear-to-br text-white shadow-md ${d.gradient}`}>
                <d.icon className="size-5" />
              </span>
              <span className="text-sm font-semibold leading-snug text-navy">{d.name}</span>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-accent text-white"
                >
                  <Check className="size-3" strokeWidth={3} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
