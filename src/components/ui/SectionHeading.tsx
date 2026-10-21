import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, revealOnScroll } from '../../lib/motion';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'center' | 'left';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <motion.div variants={fadeUp} {...revealOnScroll} className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">
        <span className="size-1.5 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base text-slate-500 sm:text-lg">{description}</p>}
    </motion.div>
  );
}
