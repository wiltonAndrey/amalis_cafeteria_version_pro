
import React, { useState, useEffect } from 'react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync body scroll with menu state
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 px-6 md:px-12 py-4 ${
          isScrolled || isMenuOpen ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand/Logo */}
          <a href="#home" onClick={closeMenu} className="flex items-center space-x-2 z-[70]">
            <div className="w-10 h-10 bg-brownie rounded-full flex items-center justify-center text-cream font-serif text-xl font-bold shadow-md">
              B
            </div>
            <span className={`text-xl font-serif font-bold tracking-tight transition-colors duration-500 ${
              isScrolled || isMenuOpen ? 'text-brownie' : 'text-white'
            }`}>
              Bakery <span className="text-caramel">Artisan</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors text-sm uppercase tracking-widest relative group ${
                  isScrolled || isMenuOpen ? 'text-brownie/80' : 'text-white/90'
                } hover:text-caramel`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-caramel transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Actions: Button + Hamburger */}
          <div className="flex items-center space-x-4 z-[70]">
            <button className="px-5 py-2 bg-brownie text-cream rounded-full text-xs sm:text-sm font-semibold hover:bg-coffee transition-all transform hover:scale-105 shadow-sm active:scale-95">
              Order Now
            </button>
            
            {/* Standard 3-line Animated Hamburger with White Lines */}
            <button 
              onClick={toggleMenu}
              className="relative w-10 h-10 flex flex-col items-center justify-center md:hidden focus:outline-none bg-brownie rounded-full hover:bg-coffee transition-all shadow-md"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              <div className="space-y-1.5">
                <span 
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span 
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 z-[55] md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-brownie/40 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMenu}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute top-0 right-0 w-[85%] h-full bg-cream shadow-2xl transition-transform duration-500 ease-in-out transform flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-32 px-10 pb-12">
            <div className="flex-grow space-y-8">
              {navLinks.map((link, idx) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className={`block text-4xl font-serif font-bold text-brownie hover:text-caramel transition-all duration-300 transform ${
                    isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${100 + idx * 75}ms` }}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className={`mt-auto space-y-8 transition-all duration-700 delay-300 ${
              isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-10 translate-y-10'
            }`}>
              <div className="h-px bg-brownie/10 w-full" />
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-brownie/40">Our Location</p>
                <p className="text-brownie/70 font-medium">123 Artisan Alley, Pastry District<br />London, W1 2AB</p>
              </div>
              <div className="flex space-x-6">
                {['Instagram', 'Facebook', 'Twitter'].map(social => (
                  <a key={social} href="#" className="text-caramel font-bold hover:text-brownie transition-colors">
                    {social.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
