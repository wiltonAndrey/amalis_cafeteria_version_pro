import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow: string | null = null;

export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (locked) {
      lockCount += 1;
      if (lockCount === 1) {
        originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      if (!locked) return;
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0 && originalOverflow !== null) {
        document.body.style.overflow = originalOverflow;
        originalOverflow = null;
      }
    };
  }, [locked]);
};
