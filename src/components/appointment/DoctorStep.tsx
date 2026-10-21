import { motion } from 'framer-motion';
import { Award, Check, Star } from 'lucide-react';
import type { Doctor } from '../../data/doctors';
import { Avatar } from '../ui/Avatar';

interface DoctorStepProps {
  doctors: Doctor[];
  departmentName?: string;
  selected: string;
  onSelect: (id: string) => void;
}

export function DoctorStep({ doctors, departmentName, selected, onSelect }: DoctorStepProps) {
  return (
    <div>
      <h3 className="text-base font-bold text-navy">Hekiminizi seçin</h3>
      <p className="mt-1 text-sm text-slate-500">{departmentName} bölümündeki hekimlerimiz</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {doctors.map((doc) => {
          const isSelected = doc.id === selected;
          return (
            <motion.button
              key={doc.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(doc.id)}
              aria-pressed={isSelected}
              className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                isSelected ? 'border-accent bg-sky-50 ring-2 ring-accent/30' : 'border-slate-200 hover:border-accent/50 hover:bg-slate-50'
              }`}
            >
              <Avatar src={doc.photo} name={doc.name} className="size-14 shrink-0 rounded-2xl" />
              <span className="min-w-0">
                <span className="block font-bold text-navy">
                  {doc.title} {doc.name}
                </span>
                <span className="block truncate text-sm text-slate-500">{doc.specialty}</span>
                <span className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {doc.rating.toFixed(1)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Award className="size-3.5 text-mint" />
                    {doc.experience} yıl
                  </span>
                </span>
              </span>
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
