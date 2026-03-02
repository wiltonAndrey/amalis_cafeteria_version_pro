import { useEffect, useState } from 'react';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const isMobileViewport = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(max-width: 768px)').matches;
};

export const useDeferredHydration = () => {
  const [isReady, setIsReady] = useState(() => !isMobileViewport());

  useEffect(() => {
    if (isReady || typeof window === 'undefined') {
      return;
    }

    const idleWindow = window as IdleWindow;

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const handle = idleWindow.requestIdleCallback(
        () => setIsReady(true),
        { timeout: 1200 }
      );

      return () => {
        if (typeof idleWindow.cancelIdleCallback === 'function') {
          idleWindow.cancelIdleCallback(handle);
        }
      };
    }

    const timeoutId = window.setTimeout(() => {
      setIsReady(true);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isReady]);

  return isReady;
};
