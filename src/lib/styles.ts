const base =
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50';

export const btn = {
  primary: `${base} bg-linear-to-r from-accent to-mint text-white shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 focus-visible:ring-sky-200`,
  dark: `${base} bg-navy text-white shadow-lg shadow-slate-900/20 hover:bg-brand focus-visible:ring-slate-300`,
  outline: `${base} border border-slate-200 bg-white text-navy hover:border-accent hover:text-accent focus-visible:ring-sky-100`,
  ghostLight: `${base} border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/15 focus-visible:ring-white/30`,
};

export type FieldState = 'error' | 'valid' | undefined;

export const inputClass = (state?: FieldState) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy placeholder:text-slate-400 transition focus:outline-none focus:ring-4 ${
    state === 'error'
      ? 'border-red-300 focus:border-emergency focus:ring-red-100'
      : state === 'valid'
        ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
        : 'border-slate-200 focus:border-accent focus:ring-sky-100'
  }`;
