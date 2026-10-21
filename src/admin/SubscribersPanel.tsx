import { deleteDoc, doc } from 'firebase/firestore';
import { Download, Trash2, Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { db } from '../lib/firebase';
import { formatTimestamp } from './format';
import type { LiveCollection, Subscriber } from './types';
import { EmptyState, PanelState } from './ui';

export function SubscribersPanel({ data }: { data: LiveCollection<Subscriber> }) {
  const toast = useToast();

  const exportCsv = () => {
    const rows = [['E-posta', 'Kayıt Tarihi'], ...data.items.map((s) => [s.email, s.createdAt ? s.createdAt.toDate().toISOString() : ''])];
    // Excel'in Türkçe karakterleri doğru açması için BOM eklenir.
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulten-aboneleri-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (s: Subscriber) => {
    if (!window.confirm(`${s.email} bülten listesinden çıkarılsın mı?`)) return;
    try {
      await deleteDoc(doc(db, 'subscribers', s.id));
      toast({ type: 'success', title: 'Abone silindi' });
    } catch {
      toast({ type: 'error', title: 'Silinemedi' });
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={exportCsv}
        disabled={data.items.length === 0}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
      >
        <Download className="size-4" /> Excel (CSV) olarak indir
      </button>

      <PanelState loading={data.loading} error={data.error}>
        {data.items.length === 0 ? (
          <EmptyState icon={Users} text="Henüz bülten abonesi yok." />
        ) : (
          <ul className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            {data.items.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{s.email}</p>
                  <p className="text-xs text-slate-400">{formatTimestamp(s.createdAt)}</p>
                </div>
                <button type="button" onClick={() => remove(s)} aria-label={`${s.email} sil`} className="rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-emergency">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PanelState>
    </div>
  );
}
