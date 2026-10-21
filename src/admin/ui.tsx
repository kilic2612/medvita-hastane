import { CircleAlert, LoaderCircle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function PanelState({ loading, error, children }: { loading: boolean; error: string | null; children: ReactNode }) {
  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center gap-3 text-sm text-slate-500">
        <LoaderCircle className="size-5 animate-spin text-accent" />
        Yükleniyor…
      </div>
    );
  }
  if (error) {
    return (
      <p className="mt-6 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-emergency ring-1 ring-red-100">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        Veriler okunamadı: {error}
      </p>
    );
  }
  return <>{children}</>;
}

export function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500">
      <Icon className="size-8 text-slate-300" />
      <p className="mt-3">{text}</p>
    </div>
  );
}
