import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import Menu from './pages/Menu';

const Footer = React.lazy(() => import('./components/Footer'));

const MenuApp: React.FC = () => {
  const footerTriggerRef = useRef<HTMLDivElement>(null);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const node = footerTriggerRef.current;
    if (!node || showFooter) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const rootMargin = isMobile ? '0px' : '120px';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFooter(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showFooter]);

  return (
    <div className="min-h-screen bg-transparent selection:bg-caramel selection:text-coffee overflow-x-hidden">
      <Navbar />
      <main id="main-content" role="main" tabIndex={-1}>
        <Menu />
      </main>
      <div ref={footerTriggerRef} className="h-px w-full" aria-hidden="true" />
      {showFooter ? (
        <Suspense fallback={<div className="h-24" />}>
          <Footer />
        </Suspense>
      ) : (
        <div className="h-24" />
      )}
    </div>
  );
};

export default MenuApp;
