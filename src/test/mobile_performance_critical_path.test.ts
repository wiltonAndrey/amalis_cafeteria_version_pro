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

  it('does not use webfont-dependent branding for the navbar LCP text', () => {
    const navbarPath = path.resolve(__dirname, '../components/layout/Navbar.tsx');
    const navbarSource = readFileSync(navbarPath, 'utf8');

    expect(navbarSource).not.toContain('font-accent font-bold transition-colors');
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
    expect(homeSource).toContain("const rootMargin = isMobile ? '0px' : '480px'");
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

  it('embeds structured data in static HTML instead of runtime JS', () => {
    const indexSource = readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

    expect(indexSource).toContain('<script type="application/ld+json">');
    expect(indexSource).toContain('"@type":"CafeOrCoffeeShop"');
  });
});
