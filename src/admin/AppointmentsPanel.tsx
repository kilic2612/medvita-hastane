import { deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { CalendarX2, Check, CheckCheck, Mail, Phone, Search, StickyNote, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useToast } from '../context/ToastContext';
import { getDepartment } from '../data/departments';
import { getDoctor } from '../data/doctors';
import { fromDateKey, toDateKey } from '../lib/format';
import { db } from '../lib/firebase';
import { normalize } from '../lib/validation';
import { formatTimestamp, prettyPhone } from './format';
import type { Appointment, AppointmentStatus, LiveCollection } from './types';
import { EmptyState, PanelState } from './ui';

export const statusMeta: Record<AppointmentStatus, { label: string; badge: string }> = {
  pending: { label: 'Onay bekliyor', badge: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Onaylandı', badge: 'bg-sky-100 text-sky-700' },
  completed: { label: 'Tamamlandı', badge: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'İptal', badge: 'bg-slate-200 text-slate-500' },
};

type StatusFilter = 'all' | AppointmentStatus;
type DateFilter = 'upcoming' | 'today' | 'past' | 'all';

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'pending', label: 'Bekleyen' },
  { id: 'confirmed', label: 'Onaylı' },
  { id: 'completed', label: 'Tamamlanan' },
  { id: 'cancelled', label: 'İptal' },
  { id: 'all', label: 'Tümü' },
];

const dayLabel = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' });
const monthLabel = new Intl.DateTimeFormat('tr-TR', { month: 'short' });

export function AppointmentsPanel({ data }: { data: LiveCollection<Appointment> }) {
  const toast = useToast();
  const [status, setStatus] = useState<StatusFilter>('pending');
  const [range, setRange] = useState<DateFilter>('upcoming');
  const [search, setSearch] = useState('');

  const today = toDateKey(new Date());

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: data.items.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const a of data.items) c[a.status] += 1;
    return c;
  }, [data.items]);

  const visible = useMemo(() => {
    const q = normalize(search);
    const list = data.items.filter((a) => {
      if (status !== 'all' && a.status !== status) return false;
      if (range === 'today' && a.date !== today) return false;
      if (range === 'upcoming' && a.date < today) return false;
      if (range === 'past' && a.date >= today) return false;
      if (!q) return true;
      return normalize(`${a.patient.fullName} ${a.patient.tc} ${a.patient.phone} ${a.code}`).includes(q);
    });
    const key = (a: Appointment) => `${a.date} ${a.time}`;
    return list.sort((x, y) => (range === 'past' || range === 'all' ? key(y).localeCompare(key(x)) : key(x).localeCompare(key(y))));
  }, [data.items, status, range, search, today]);

  const changeStatus = async (a: Appointment, next: AppointmentStatus) => {
    try {
      if (next === 'cancelled') {
        if (!window.confirm(`${a.patient.fullName} adlı hastanın ${a.date} ${a.time} randevusu iptal edilsin mi? Saat tekrar randevuya açılacak.`)) return;
        // İptalde slot silinir, böylece saat başka hastalara açılır.
        const batch = writeBatch(db);
        batch.update(doc(db, 'appointments', a.id), { status: next });
        batch.delete(doc(db, 'slots', a.slotId));
        await batch.commit();
      } else {
        await updateDoc(doc(db, 'appointments', a.id), { status: next });
      }
      toast({ type: 'success', title: `Randevu: ${statusMeta[next].label}`, description: `${a.code} · ${a.patient.fullName}` });
    } catch {
      toast({ type: 'error', title: 'İşlem başarısız', description: 'Yetkinizi ve bağlantınızı kontrol edin.' });
    }
  };

  const remove = async (a: Appointment) => {
    if (!window.confirm(`${a.code} numaralı iptal edilmiş randevu kalıcı olarak silinsin mi?`)) return;
    try {
      await deleteDoc(doc(db, 'appointments', a.id));
      toast({ type: 'success', title: 'Randevu kaydı silindi' });
    } catch {
      toast({ type: 'error', title: 'Silinemedi' });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {statusFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatus(f.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                status === f.id ? 'bg-navy text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-navy'
              }`}
            >
              {f.label} <span className={status === f.id ? 'text-white/60' : 'text-slate-400'}>{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as DateFilter)}
            className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-navy focus:border-accent focus:outline-none"
          >
            <option value="upcoming">Bugün ve sonrası</option>
            <option value="today">Sadece bugün</option>
            <option value="past">Geçmiş</option>
            <option value="all">Tüm tarihler</option>
          </select>
          <label className="relative flex-1 lg:w-64 lg:flex-none">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, TC, telefon, kod…"
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm focus:border-accent focus:outline-none"
            />
          </label>
        </div>
      </div>

      <PanelState loading={data.loading} error={data.error}>
        {visible.length === 0 ? (
          <EmptyState icon={CalendarX2} text="Bu filtreye uyan randevu yok." />
        ) : (
          <ul className="mt-5 space-y-3">
            {visible.map((a) => {
              const date = fromDateKey(a.date);
              const doctor = getDoctor(a.doctorId);
              const isToday = a.date === today;
              return (
                <li key={a.id} className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-start sm:p-5">
                  <div
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 sm:w-24 sm:flex-col sm:gap-0 sm:text-center ${
                      isToday ? 'bg-accent text-white' : 'bg-surface text-navy ring-1 ring-slate-200'
                    }`}
                  >
                    <span className={`text-xs font-bold uppercase ${isToday ? 'text-white/80' : 'text-slate-400'}`}>
                      {isToday ? 'Bugün' : dayLabel.format(date)}
                    </span>
                    <span className="text-2xl font-extrabold leading-tight">{date.getDate()}</span>
                    <span className={`text-xs ${isToday ? 'text-white/80' : 'text-slate-500'}`}>{monthLabel.format(date)}</span>
                    <span className="ml-auto text-lg font-bold sm:ml-0 sm:mt-1 sm:text-sm">{a.time}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-bold text-navy">{a.patient.fullName}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusMeta[a.status].badge}`}>{statusMeta[a.status].label}</span>
                      <span className="font-mono text-xs text-slate-400">{a.code}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {getDepartment(a.departmentId)?.name ?? a.departmentId} · {doctor ? `${doctor.title} ${doctor.name}` : a.doctorId}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span>TC: {a.patient.tc}</span>
                      <a href={`tel:${a.patient.phone}`} className="inline-flex items-center gap-1 hover:text-accent">
                        <Phone className="size-3.5" />
                        {prettyPhone(a.patient.phone)}
                      </a>
                      {a.patient.email && (
                        <a href={`mailto:${a.patient.email}`} className="inline-flex items-center gap-1 hover:text-accent">
                          <Mail className="size-3.5" />
                          {a.patient.email}
                        </a>
                      )}
                    </div>
                    {a.patient.notes && (
                      <p className="mt-2 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                        <StickyNote className="mt-0.5 size-4 shrink-0" />
                        {a.patient.notes}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">Oluşturulma: {formatTimestamp(a.createdAt)}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                    {a.status === 'pending' && (
                      <ActionButton onClick={() => changeStatus(a, 'confirmed')} className="bg-sky-500 text-white hover:bg-sky-600">
                        <Check className="size-4" /> Onayla
                      </ActionButton>
                    )}
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <ActionButton onClick={() => changeStatus(a, 'completed')} className="bg-emerald-500 text-white hover:bg-emerald-600">
                        <CheckCheck className="size-4" /> Geldi
                      </ActionButton>
                    )}
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <ActionButton onClick={() => changeStatus(a, 'cancelled')} className="bg-white text-emergency ring-1 ring-red-200 hover:bg-red-50">
                        <X className="size-4" /> İptal
                      </ActionButton>
                    )}
                    {a.status === 'cancelled' && (
                      <ActionButton onClick={() => remove(a)} className="bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">
                        Kaydı sil
                      </ActionButton>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PanelState>
    </div>
  );
}

function ActionButton({ onClick, className, children }: { onClick: () => void; className: string; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${className}`}>
      {children}
    </button>
  );
}
