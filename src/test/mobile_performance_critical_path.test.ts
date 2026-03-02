import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('mobile performance critical path', () => {
  it('does not preload Google Fonts stylesheet in document head', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const indexSource = readFileSync(indexPath, 'utf8');

    expect(indexSource).not.toMatch(/rel=\"preload\"\s+as=\"style\"[\s\S]*fonts\.googleapis\.com\/css2/i);
    expect(indexSource).not.toContain('fonts.googleapis.com/css2');
  });

  it('uses async image decoding for the hero LCP image', () => {
    const heroPath = path.resolve(__dirname, '../components/Hero.tsx');
    const heroSource = readFileSync(heroPath, 'utf8');

    expect(heroSource).toContain('decoding="async"');
    expect(heroSource).not.toContain('decoding="sync"');
  });

  it('avoids expensive text effects in above-the-fold hero heading', () => {
    const heroPath = path.resolve(__dirname, '../components/Hero.tsx');
    const heroSource = readFileSync(heroPath, 'utf8');

    expect(heroSource).not.toContain('drop-shadow-');
    expect(heroSource).not.toContain('bg-clip-text');
    expect(heroSource).not.toContain('text-transparent');
  });

  it('uses the lightweight hero asset in both markup and preload', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const heroPath = path.resolve(__dirname, '../components/Hero.tsx');

    const indexSource = readFileSync(indexPath, 'utf8');
    const heroSource = readFileSync(heroPath, 'utf8');
    const heroImage = '/images/nuestra_historia/pan-recien-horneado-santa-pola.webp';

    expect(indexSource).toContain(heroImage);
    expect(heroSource).toContain(heroImage);
  });

  it('keeps the approved navbar branding classes without forcing an inline system font override', () => {
    const navbarPath = path.resolve(__dirname, '../components/layout/Navbar.tsx');
    const navbarSource = readFileSync(navbarPath, 'utf8');

    expect(navbarSource).toContain('font-accent font-bold transition-colors');
    expect(navbarSource).not.toContain('style={{ fontFamily:');
  });

  it('renders hero content without deferred reveal wrappers above the fold', () => {
    const heroPath = path.resolve(__dirname, '../components/Hero.tsx');
    const heroSource = readFileSync(heroPath, 'utf8');

    expect(heroSource).not.toContain("import { Reveal }");
    expect(heroSource).not.toContain('<Reveal');
  });

  it('uses high-contrast text for the honey CTA variant', () => {
    const buttonPath = path.resolve(__dirname, '../components/ui/Button.tsx');
    const buttonSource = readFileSync(buttonPath, 'utf8');

    expect(buttonSource).toContain("honey: `bg-honey text-espresso");
    expect(buttonSource).not.toContain("honey: `bg-honey text-brownie");
  });

  it('keeps above-the-fold modules off the monolithic constants file', () => {
    const heroSource = readFileSync(path.resolve(__dirname, '../components/Hero.tsx'), 'utf8');
    const navbarSource = readFileSync(path.resolve(__dirname, '../components/layout/Navbar.tsx'), 'utf8');
    const footerSource = readFileSync(path.resolve(__dirname, '../components/Footer.tsx'), 'utf8');
    const structuredDataSource = readFileSync(path.resolve(__dirname, '../utils/structured-data.ts'), 'utf8');

    expect(heroSource).not.toContain("from '../constants'");
    expect(navbarSource).not.toContain("from '../../constants'");
    expect(footerSource).not.toContain("from '../constants'");
    expect(structuredDataSource).not.toContain("from '../constants'");
  });

  it('does not eagerly import the footer in the app shell', () => {
    const appSource = readFileSync(path.resolve(__dirname, '../App.tsx'), 'utf8');

    expect(appSource).not.toContain("import Footer from './components/Footer'");
    expect(appSource).toContain("const Footer = React.lazy");
  });

  it('lazy-loads admin providers instead of bundling them in the home shell', () => {
    const appSource = readFileSync(path.resolve(__dirname, '../App.tsx'), 'utf8');

    expect(appSource).toContain("const AdminShell = React.lazy(() => import('./pages/AdminShell'))");
    expect(appSource).toContain('<Route path="/admin" element={<AdminShell />} />');
    expect(appSource).not.toContain("const Admin = React.lazy(() => import('./pages/Admin'))");
  });

  it('loads global CSS without a static blocking import in index entry', () => {
    const entrySource = readFileSync(path.resolve(__dirname, '../index.tsx'), 'utf8');

    expect(entrySource).not.toContain("import './index.css';");
    expect(entrySource).toContain("import stylesheetHref from './index.css?url'");
    expect(entrySource).toContain("href = stylesheetHref");
    expect(entrySource).toContain("window.addEventListener('load'");
  });

  it('eagerly loads global CSS for non-home routes before mounting route-specific apps', () => {
    const entrySource = readFileSync(path.resolve(__dirname, '../index.tsx'), 'utf8');

    expect(entrySource).toContain('if (!isHomeRoute) {');
    expect(entrySource).toContain('ensureGlobalStyles();');
  });

  it('keeps runtime entry lean by avoiding non-critical providers and JSON-LD injection JS', () => {
    const entrySource = readFileSync(path.resolve(__dirname, '../index.tsx'), 'utf8');

    expect(entrySource).not.toContain('ToastProvider');
    expect(entrySource).not.toContain('injectStructuredData');
    expect(entrySource).not.toContain('<ToastProvider>');
  });

  it('defers below-the-fold home sections behind viewport guards', () => {
    const homeSource = readFileSync(path.resolve(__dirname, '../pages/Home.tsx'), 'utf8');

    expect(homeSource).toContain('const DeferredSection');
    expect(homeSource).toContain("matchMedia('(max-width: 768px)')");
    expect(homeSource).toContain("const rootMargin = isMobile ? '0px' : '120px'");
    expect(homeSource).toContain('const threshold = isMobile ? 0.15 : 0');
    expect(homeSource).toContain('{ rootMargin, threshold }');
    expect(homeSource).toContain('<DeferredSection');
    expect(homeSource).not.toContain('<Suspense fallback={<div className=\"py-20\" />}>\n                <section id=\"about\"');
  });

  it('contains inline critical CSS for navbar and hero above the fold', () => {
    const indexSource = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

    expect(indexSource).toContain('<style id="critical-home-css">');
    expect(indexSource).toContain('section#home');
    expect(indexSource).toContain('header.fixed');
  });

  it('contains inline critical CSS for the menu hero above the fold', () => {
    const indexSource = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(indexSource).toContain('<style id="critical-menu-css">');
    expect(indexSource).toContain('#menu-page-hero h1');
    expect(menuSource).toContain('id="menu-page"');
    expect(menuSource).toContain('id="menu-page-hero"');
  });

  it('keeps inline critical home CSS free of expensive stroke and shadow paint effects', () => {
    const indexSource = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

    expect(indexSource).not.toContain('-webkit-text-stroke');
    expect(indexSource).not.toContain('paint-order: stroke fill');
    expect(indexSource).not.toContain('text-shadow:');
  });

  it('embeds structured data in static HTML instead of runtime JS', () => {
    const indexSource = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

    expect(indexSource).toContain('<script type="application/ld+json">');
    expect(indexSource).toContain('"@type":"CafeOrCoffeeShop"');
  });

  it('routes /carta through a dedicated app entry instead of the router shell', () => {
    const entrySource = readFileSync(path.resolve(__dirname, '../index.tsx'), 'utf8');

    expect(entrySource).toContain("const isMenuRoute = pathname === '/carta'");
    expect(entrySource).toContain("const { default: MenuApp } = await import('./MenuApp')");
    expect(entrySource).not.toContain("const [{ BrowserRouter }, { default: App }] = await Promise.all([");
  });

  it('keeps the approved framer-motion menu transitions while lazy-loading the modal', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(menuSource).toContain("from 'framer-motion'");
    expect(menuSource).toContain('motion.button');
    expect(menuSource).toContain('AnimatePresence');
  });

  it('keeps icon-driven category pills in the menu shell instead of text initials', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(menuSource).toContain("from 'lucide-react'");
    expect(menuSource).toContain('const CATEGORY_ICONS');
    expect(menuSource).toContain('const Icon = CATEGORY_ICONS[cat.id] || Coffee;');
    expect(menuSource).not.toContain('cat.label.slice(0, 1)');
  });

  it('lazy-loads the menu modal so framer-motion stays out of the first menu paint', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(menuSource).toContain("const ProductModal = React.lazy(() => import('../components/ProductModal'))");
    expect(menuSource).not.toContain("import ProductModal from '../components/ProductModal'");
    expect(menuSource).toContain('{selectedProduct ? (');
  });

  it('keeps offscreen image deferral without adding placeholder shells that change the approved layout', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');
    const productCardSource = readFileSync(path.resolve(__dirname, '../components/ui/ProductCard.tsx'), 'utf8');

    expect(menuSource).not.toContain('const placeholderCards =');
    expect(menuSource).not.toContain('menu-shell-placeholder-');
    expect(productCardSource).toContain("fetchPriority={priorityImage ? 'high' : 'auto'}");
  });

  it('keeps the approved caramel active menu pill styling and semantic h2 card titles', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(menuSource).toContain("text-white border-[var(--color-caramel)]");
    expect(menuSource).toContain("text-white scale-110");
    expect(menuSource).toContain('titleTag="h2"');
  });

  it('keeps the original menu hero spacing and card grid rhythm', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(menuSource).toContain('pt-24 pb-16 md:pt-40 md:pb-24');
    expect(menuSource).toContain('className="py-12 md:py-24"');
  });

  it('defers non-priority product images until their cards intersect the viewport', () => {
    const productCardSource = readFileSync(path.resolve(__dirname, '../components/ui/ProductCard.tsx'), 'utf8');

    expect(productCardSource).toContain('const [shouldLoadImage, setShouldLoadImage]');
    expect(productCardSource).toContain('new IntersectionObserver');
    expect(productCardSource).toContain("rootMargin: '0px 0px'");
  });

  it('keeps the original menu background decoration and headline scale', () => {
    const menuSource = readFileSync(path.resolve(__dirname, '../pages/Menu.tsx'), 'utf8');

    expect(menuSource).toContain('blur-[150px]');
    expect(menuSource).toContain('text-5xl md:text-8xl');
  });

  it('keeps critical menu content available on first paint while still deferring the fetch until after the frame boundary', () => {
    const entrySource = readFileSync(path.resolve(__dirname, '../index.tsx'), 'utf8');
    const hookSource = readFileSync(path.resolve(__dirname, '../hooks/useMenuProducts.ts'), 'utf8');

    expect(entrySource).not.toContain("const menuLcpImageHref = '/images/products/Tostada-Tomate-Atun.webp'");
    expect(entrySource).not.toContain('data-preload-key');
    expect(hookSource).toContain('MENU_CRITICAL_PRODUCTS.map');
    expect(hookSource).toContain('window.requestAnimationFrame(() => {');
    expect(hookSource).toContain('window.cancelAnimationFrame(frameId);');
  });

  it('avoids expensive inline paint effects in the hero LCP heading', () => {
    const heroSource = readFileSync(path.resolve(__dirname, '../components/Hero.tsx'), 'utf8');

    expect(heroSource).not.toContain('-webkit-text-stroke');
    expect(heroSource).not.toContain('[text-shadow:');
  });

  it('keeps menu fallback data off the initial shell bundle', () => {
    const hookSource = readFileSync(path.resolve(__dirname, '../hooks/useMenuProducts.ts'), 'utf8');

    expect(hookSource).not.toContain("from '../constants'");
    expect(hookSource).toContain("from '../constants/menu-critical'");
    expect(hookSource).toContain("await import('../constants/menu-fallback')");
  });
});
