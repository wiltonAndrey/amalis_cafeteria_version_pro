import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../components/Hero';
import { Navbar } from '../components/layout/Navbar';
import WhyChooseUs from '../components/WhyChooseUs';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import { ProductCard } from '../components/ui/ProductCard';
import PromotionsSection from '../components/sections/PromotionsSection';
import CoffeeExperience from '../components/sections/CoffeeExperience';
import Testimonials from '../components/Testimonials';
import LocationSection from '../components/sections/LocationSection';
import type { Product, PromotionCard } from '../types';

let promotionCards: PromotionCard[] = [];

vi.mock('../hooks/useScroll', () => ({
  useScroll: () => false,
}));

vi.mock('../hooks/usePromotionCards', () => ({
  usePromotionCards: () => ({
    cards: promotionCards,
    loading: false,
    error: null,
  }),
}));

const productMock: Product = {
  id: 'p1',
  name: 'Producto Test',
  description: 'Descripcion test',
  price: '3.50 EUR',
  category: 'Bread',
  imageUrl: '/images/test.webp',
  imageAlt: 'Producto test alt',
};

describe('Landing refinement', () => {
  beforeEach(() => {
    promotionCards = [
      {
        id: 'promo-1',
        badge: 'Top',
        image: '/images/promo.webp',
        image_alt: 'Promo alt',
        image_title: 'Promo title',
        title: 'Promo principal',
        price: 4.5,
        description: 'Descripcion extensa para validar line clamp en cards de promociones.',
        items: ['Cafe', 'Tostada'],
        availability_text: 'Hoy',
        cta_label: 'Ver promo',
        cta_url: 'url-invalida',
      },
    ];
  });

  it('uses stronger hero contrast and desktop subtitle hierarchy', () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    const overlay = container.querySelector('.bg-gradient-to-t');
    expect(overlay).toHaveClass('from-coffee');

    const dualTone = screen.getByText(/Sin Atajos/i);
    expect(dualTone).toHaveClass('text-transparent');
    expect(dualTone).toHaveClass('bg-clip-text');

    const subtitle = screen.getByText(/huele a pan/i);
    expect(subtitle).toHaveClass('md:text-3xl');
  });

  it('keeps navbar links visually strong on initial state', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /navegaci[oó]n principal/i });
    const inicio = within(nav).getByRole('link', { name: 'Inicio' });

    expect(inicio).toHaveClass('font-bold');
    expect(inicio).toHaveClass('drop-shadow-md');
  });

  it('routes philosophy CTAs to /carta', () => {
    render(
      <MemoryRouter>
        <WhyChooseUs />
      </MemoryRouter>
    );

    const cta = screen.getByRole('link', { name: /ver carta completa/i });
    expect(cta).toHaveAttribute('href', '/carta');
  });

  it('hides price in ProductCard when showPrice is false', () => {
    render(<ProductCard product={productMock} {...({ showPrice: false } as object)} />);

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.queryByText(/3\.50/i)).not.toBeInTheDocument();
  });

  it('uses /carta links in featured section CTA', () => {
    render(
      <MemoryRouter>
        <FeaturedProducts />
      </MemoryRouter>
    );

    const cta = screen.getByRole('link', { name: /ver carta completa/i });
    expect(cta).toHaveAttribute('href', '/carta');
  });

  it('clamps promotion descriptions and uses safe CTA fallback', () => {
    render(<PromotionsSection />);

    const description = screen.getAllByText(/Descripcion extensa para validar line clamp/i)[0];
    expect(description).toHaveClass('line-clamp-3');

    const link = screen.getAllByRole('link', { name: 'Ver promo' })[0];
    expect(link).toHaveAttribute('href', '/carta');
  });

  it('improves floating card contrast in coffee experience', () => {
    render(<CoffeeExperience />);
    const title = screen.getByText('Temperatura Ideal');
    const card = title.closest('div');
    expect(card).toHaveClass('bg-black/60');
  });

  it('uses custom slider layout with navigation for testimonials', () => {
    const { container } = render(<Testimonials />);
    const scrollContainer = container.querySelector('.no-scrollbar');
    expect(scrollContainer).toBeInTheDocument();

    // Check for navigation buttons (hidden on mobile, block on md)
    const prevButton = screen.getByLabelText('Anterior');
    const nextButton = screen.getByLabelText('Siguiente');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('uses real Google Maps links for location CTAs', () => {
    render(<LocationSection />);

    const compartir = screen.getByRole('link', { name: /compartir ubicacion/i });
    const llegar = screen.getByRole('link', { name: /como llegar/i });

    expect(compartir).toHaveAttribute('href', 'https://www.google.com/maps?q=38.19156,-0.55558');
    expect(llegar).toHaveAttribute('href', 'https://www.google.com/maps?q=38.19156,-0.55558');
    expect(compartir).toHaveAttribute('target', '_blank');
    expect(compartir).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(compartir).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});
