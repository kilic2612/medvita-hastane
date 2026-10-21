import { animate, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

/** Görünür olduğunda 0'dan hedef değere sayar; React render'ı tetiklemeden DOM'u günceller. */
export function StatCounter({ value, label, prefix = '', suffix = '' }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix]);

  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-1 text-sm text-slate-400">{label}</dt>
      <dd className="whitespace-nowrap text-3xl font-extrabold tabular-nums text-white sm:text-4xl">
        <span ref={ref}>
          {prefix}0{suffix}
        </span>
      </dd>
    </div>
  );
}
