
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import Home from './pages/Home';
import { ScrollToTop } from './components/layout/ScrollToTop';

// Lazy load non-critical routes
const Menu = React.lazy(() => import('./pages/Menu'));
const AdminShell = React.lazy(() => import('./pages/AdminShell'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const Footer = React.lazy(() => import('./components/Footer'));

const App: React.FC = () => {
  const footerTriggerRef = useRef<HTMLDivElement>(null);
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const node = footerTriggerRef.current;
    if (!node || showFooter) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const rootMargin = isMobile ? '120px' : '600px';

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
      <ScrollToTop />
      <main id="main-content" role="main" tabIndex={-1}>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carta" element={<Menu />} />
            <Route path="/admin" element={<AdminShell />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
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

export default App;
