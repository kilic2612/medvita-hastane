import { Plus } from 'lucide-react';
import { site } from '../../data/site';

export function Logo({ light = false }: { light?: boolean }) {
  const [first, second] = site.nameParts;
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-accent to-mint text-white shadow-lg shadow-sky-500/30">
        <Plus className="size-6" strokeWidth={3} />
      </span>
      <span className="leading-none">
        <span className={`block whitespace-nowrap text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>
          {first}
          <span className="text-accent">{second}</span>
        </span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{site.logoSubtitle}</span>
      </span>
    </span>
  );
}
