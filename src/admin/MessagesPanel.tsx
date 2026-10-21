import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Inbox, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { db } from '../lib/firebase';
import { formatTimestamp, prettyPhone } from './format';
import type { LiveCollection, Message } from './types';
import { EmptyState, PanelState } from './ui';

export function MessagesPanel({ data }: { data: LiveCollection<Message> }) {
  const toast = useToast();
  const [onlyUnread, setOnlyUnread] = useState(false);
  const visible = onlyUnread ? data.items.filter((m) => !m.read) : data.items;

  const toggleRead = (m: Message) =>
    updateDoc(doc(db, 'messages', m.id), { read: !m.read }).catch(() => toast({ type: 'error', title: 'Güncellenemedi' }));

  const remove = async (m: Message) => {
    if (!window.confirm(`${m.name} adlı kişinin mesajı silinsin mi?`)) return;
    try {
      await deleteDoc(doc(db, 'messages', m.id));
      toast({ type: 'success', title: 'Mesaj silindi' });
    } catch {
      toast({ type: 'error', title: 'Silinemedi' });
    }
  };

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
        <input type="checkbox" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.target.checked)} className="size-4 accent-accent" />
        Yalnızca okunmamışlar
      </label>

      <PanelState loading={data.loading} error={data.error}>
        {visible.length === 0 ? (
          <EmptyState icon={Inbox} text="Gösterilecek mesaj yok." />
        ) : (
          <ul className="mt-5 space-y-3">
            {visible.map((m) => (
              <li key={m.id} className={`rounded-2xl bg-white p-5 ring-1 ${m.read ? 'ring-slate-200' : 'ring-2 ring-accent/40'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 font-bold text-navy">
                      {!m.read && <span className="size-2 rounded-full bg-accent" />}
                      {m.name}
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">{m.subject}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-accent">
                        <Mail className="size-3.5" />
                        {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-accent">
                          <Phone className="size-3.5" />
                          {prettyPhone(m.phone)}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{formatTimestamp(m.createdAt)}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand"
                  >
                    <Reply className="size-4" /> Yanıtla
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleRead(m)}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    {m.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                    {m.read ? 'Okunmadı yap' : 'Okundu işaretle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-emergency ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" /> Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelState>
    </div>
  );
}
