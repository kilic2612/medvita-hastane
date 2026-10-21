import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: readonly string[];
  current: number;
  onStepClick: (index: number) => void;
}

export function StepIndicator({ steps, current, onStepClick }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              disabled={!done}
              onClick={() => onStepClick(i)}
              aria-current={active ? 'step' : undefined}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-300 ${
                  done ? 'bg-mint text-white' : active ? 'bg-accent text-white ring-4 ring-sky-100' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </motion.span>
              <span className={`hidden whitespace-nowrap text-sm font-semibold md:block ${active ? 'text-navy' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <motion.span
                  className="absolute inset-0 origin-left bg-mint"
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
