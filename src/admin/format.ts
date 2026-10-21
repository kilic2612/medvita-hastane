import type { Timestamp } from 'firebase/firestore';

const dateTime = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatTimestamp = (ts: Timestamp | null) => (ts ? dateTime.format(ts.toDate()) : '—');

/** "05321234567" → "0532 123 45 67" */
export const prettyPhone = (digits: string) =>
  digits.length === 11 ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}` : digits;
