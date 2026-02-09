
import { useState, useCallback } from 'react';
import { useLockBodyScroll } from './useLockBodyScroll';

export const useMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  useLockBodyScroll(isOpen);

  return { isOpen, toggle, close };
};
