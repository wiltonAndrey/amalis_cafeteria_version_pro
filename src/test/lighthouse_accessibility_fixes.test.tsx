import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';
import { MobileCarousel } from '../components/ui/MobileCarousel';
import { GalleryCarousel } from '../components/ui/GalleryCarousel';
import WhyChooseUs from '../components/WhyChooseUs';
import { ProductCard } from '../components/ui/ProductCard';
import Testimonials from '../components/Testimonials';
import LocationSection from '../components/sections/LocationSection';

describe('lighthouse accessibility regressions', () => {
  test('footer legal copy and links keep readable contrast classes', () => {
    render(<Footer />);

    const legalText = screen.getByText(/Todos los derechos reservados/i);
    expect(legalText).toHaveClass('text-cream/65');

    const privacyButton = screen.getByRole('button', { name: /Privacidad/i });
    const cookiesButton = screen.getByRole('button', { name: /Cookies/i });
    expect(privacyButton).toHaveClass('text-cream/65');
    expect(cookiesButton).toHaveClass('text-cream/65');
  });

  test('mobile carousel indicators have 24px touch targets', () => {
    render(
      <MobileCarousel>
        <div>Primer item</div>
        <div>Segundo item</div>
      </MobileCarousel>
    );

    const indicators = screen.getAllByRole('tab');
    indicators.forEach((indicator) => {
      expect(indicator).toHaveClass('h-6');
      expect(indicator).toHaveClass('w-6');
    });
  });

  test('gallery carousel indicators have 24px touch targets', () => {
    render(
      <GalleryCarousel>
        <div>Imagen 1</div>
        <div>Imagen 2</div>
        <div>Imagen 3</div>
      </GalleryCarousel>
    );

    const indicators = screen.getAllByRole('button', { name: /Ir a imagen/i });
    indicators.forEach((indicator) => {
      expect(indicator).toHaveClass('h-6');
      expect(indicator).toHaveClass('w-6');
    });
  });

  test('why choose us cards avoid skipped heading levels', () => {
    render(
      <MemoryRouter>
        <WhyChooseUs />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0);
    expect(screen.queryAllByRole('heading', { level: 4 })).toHaveLength(0);
  });

  test('product cards use h3 titles inside sections', () => {
    render(
      <ProductCard
        showPrice={false}
        product={{
          id: 'p1',
          name: 'Pan del dia',
          description: 'Producto de prueba',
          price: '2.50 EUR',
          category: 'Bread',
          imageUrl: '/images/sections/pan-artesano-horneado.webp',
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 3, name: /Pan del dia/i })).toBeInTheDocument();
  });

  test('testimonials author labels are not rendered as heading level 5', () => {
    render(<Testimonials />);

    expect(screen.queryAllByRole('heading', { level: 5 })).toHaveLength(0);
  });

  test('location section local heading uses h3 hierarchy', () => {
    render(<LocationSection />);

    expect(screen.getByRole('heading', { level: 3, name: /Nuestra Casa/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('heading', { level: 4 })).toHaveLength(0);
  });
});
