import { useEffect } from 'react';

// Sayaç sayesinde iç içe açılan modal/çekmeceler birbirinin kilidini erken kaldırmaz.
let activeLocks = 0;

export function useLockBody(locked = true) {
  useEffect(() => {
    if (!locked) return;
    activeLocks += 1;
    document.body.style.overflow = 'hidden';
    return () => {
      activeLocks -= 1;
      if (activeLocks === 0) document.body.style.overflow = '';
    };
  }, [locked]);
}
