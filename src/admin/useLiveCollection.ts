import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import type { LiveCollection } from './types';

/** Koleksiyonu en yeni kayıtlar önce olacak şekilde canlı dinler; yeni randevular sayfa yenilemeden düşer. */
export function useLiveCollection<T>(name: string, max = 500): LiveCollection<T> {
  const [state, setState] = useState<LiveCollection<T>>({ items: [], loading: true, error: null });

  useEffect(() => {
    const q = query(collection(db, name), orderBy('createdAt', 'desc'), limit(max));
    return onSnapshot(
      q,
      (snap) => setState({ items: snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T), loading: false, error: null }),
      (err) => setState({ items: [], loading: false, error: err.message }),
    );
  }, [name, max]);

  return state;
}
