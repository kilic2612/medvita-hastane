import type { Variants } from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export const stagger = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

// Liste/grid kartları: filtre değiştiğinde sırayla belirir, kaybolurken küçülür.
export const gridItem: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut, delay: Math.min(i, 8) * 0.06 },
  }),
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
};

export const revealOnScroll = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-80px' },
} as const;

export const hoverTap = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
} as const;
