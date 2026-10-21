import { fromDateKey } from '../../lib/format';
import { slotKey } from '../../services/api';

export interface Slot {
  time: string;
  available: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Pazar günleri hariç, bugünden itibaren `count` gün. */
export function upcomingDays(count = 14) {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < count) {
    if (cursor.getDay() !== 0) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/**
 * Poliklinik saatleri: hafta içi 09:00–17:30 (12:00–13:00 öğle arası), cumartesi 09:00–12:30.
 * `booked` veritabanındaki dolu saatleri içerir; en erken 1 saat sonrasına randevu verilir.
 */
export function slotsFor(dateKey: string, booked: Set<string>): Slot[] {
  const date = fromDateKey(dateKey);
  const saturday = date.getDay() === 6;
  const lastHour = saturday ? 12 : 17;
  const earliest = Date.now() + 60 * 60 * 1000;
  const slots: Slot[] = [];

  for (let h = 9; h <= lastHour; h++) {
    if (h === 12 && !saturday) continue; // öğle arası
    for (const m of [0, 30]) {
      const time = `${pad(h)}:${pad(m)}`;
      const start = new Date(date);
      start.setHours(h, m);
      slots.push({ time, available: !booked.has(slotKey(dateKey, time)) && start.getTime() > earliest });
    }
  }
  return slots;
}
