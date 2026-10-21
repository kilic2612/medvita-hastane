import { FlaskConical } from 'lucide-react';

/** Sitenin hayali bir kurum için hazırlanmış portfolyo projesi olduğunu her sayfada belirtir. */
export function DemoBanner() {
  return (
    <div className="bg-amber-400 text-navy">
      <p className="wrap flex items-center justify-center gap-2 py-2 text-center text-xs font-semibold sm:text-sm">
        <FlaskConical className="hidden size-4 shrink-0 sm:block" />
        Portfolyo projesidir · MedVita gerçek bir hastane değildir, lütfen gerçek kişisel bilgilerinizi girmeyin.
      </p>
    </div>
  );
}
