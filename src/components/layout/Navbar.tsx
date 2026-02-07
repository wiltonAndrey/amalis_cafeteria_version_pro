import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScroll } from '../../hooks/useScroll';
import { useMenu } from '../../hooks/useMenu';
import { Button } from '../ui/Button';

const NAV_LINKS = [
  { name: 'Inicio', href: '/#home' },
  { name: 'Carta', href: '/carta' },
  { name: 'Nosotros', href: '/#about' },
  { name: 'Galería', href: '/#gallery' },
  { name: 'Contacto', href: '/#contact' },
];

export const Navbar: React.FC = () => {
  const isScrolled = useScroll();
  const { isOpen, toggle, close } = useMenu();
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Focus trap: when drawer opens, focus first link
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Focus trap: trap focus inside drawer
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    close();

    if (href.startsWith('/#')) {
      const targetId = href.split('#')[1];

      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // If not on home page, Link will handle navigation to /#id
    }
  };

  const handleOrderClick = () => {
    close();
    navigate('/carta');
  };

  return (
    <>
      {/* Skip Link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-brownie focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel"
      >
        Saltar al contenido principal
      </a>

      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-6 md:px-12 py-4 ${isScrolled || isOpen ? 'bg-black/50 backdrop-blur-md shadow-sm border-b border-white/5' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" onClick={close} className="flex items-center space-x-2 z-[70]">
            <div className="w-10 h-10 bg-brownie rounded-full flex items-center justify-center text-beige font-serif text-xl font-bold">A</div>
            <span className={`text-lg sm:text-xl md:text-2xl font-accent font-bold transition-colors ${isScrolled || isOpen ? 'text-cream' : 'text-white'}`}>
              Amalis <span className="text-caramel">Cafetería</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Navegación principal">
            {NAV_LINKS.map(link => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`font-medium transition-colors text-sm uppercase tracking-widest relative group ${isScrolled ? 'text-cream/90' : 'text-white/90'
                  } hover:text-caramel`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 z-[70]">
            <button onClick={toggle} className="w-10 h-10 flex flex-col items-center justify-center lg:hidden bg-brownie rounded-full text-white" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isOpen}>
              <div className="space-y-1.5">
                <span className={`block w-5 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block w-5 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-[55] md:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className={`absolute inset-0 bg-brownie/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={close} aria-hidden="true" />
        <div
          ref={drawerRef}
          className={`absolute top-0 right-0 w-[85%] h-full bg-beige transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col pt-32 px-10`}
        >
          {NAV_LINKS.map((link, idx) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              ref={idx === 0 ? firstLinkRef : null}
              className={`block text-4xl font-serif font-bold text-brownie mb-8 transform transition-all ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              style={{ transitionDelay: `${100 + idx * 75}ms` }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
