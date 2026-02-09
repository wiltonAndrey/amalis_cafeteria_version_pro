import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PromotionsSection from '../components/sections/PromotionsSection';
import type { PromotionCard } from '../types';

let hookCards: PromotionCard[] = [];
let hookLoading = false;
let hookError: string | null = null;

vi.mock('../hooks/usePromotionCards', () => ({
  usePromotionCards: () => ({
    cards: hookCards,
    loading: hookLoading,
    error: hookError,
  }),
}));

describe('PromotionsSection', () => {
  beforeEach(() => {
    hookLoading = false;
    hookError = null;
    hookCards = [
      {
        id: 'p1',
        badge: 'Especial',
        image: '/img/1.webp',
        image_alt: 'Alt promo 1',
        image_title: 'Title promo 1',
        title: 'Promo Test 1',
        price: 4.5,
        description: 'Desc 1',
        items: ['Item 1', 'Item 2'],
        availability_text: 'Hoy',
        cta_label: 'Ver promo 1',
        cta_url: '/promo-1',
      },
      {
        id: 'p2',
        badge: 'Top',
        image: '/img/2.webp',
        image_alt: 'Alt promo 2',
        image_title: 'Title promo 2',
        title: 'Promo Test 2',
        price: 6,
        description: 'Desc 2',
        items: ['Item A'],
        availability_text: 'Semana',
        cta_label: 'Ver promo 2',
        cta_url: '/promo-2',
      },
    ];
  });

  it('renders cards, prices, cta links and seo attributes from hook data', () => {
    render(<PromotionsSection />);

    expect(screen.getAllByText('Promo Test 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Promo Test 2').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/4,50\s?€/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/6,00\s?€/).length).toBeGreaterThan(0);

    const ctas = screen.getAllByRole('link', { name: 'Ver promo 1' });
    expect(ctas.length).toBeGreaterThan(0);
    expect(ctas[0]).toHaveAttribute('href', '/promo-1');

    const images = screen.getAllByRole('img', { name: 'Alt promo 1' });
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('title', 'Title promo 1');
  });

  it('falls back image alt/title to promotion title', () => {
    hookCards = [
      {
        ...hookCards[0],
        image_alt: '',
        image_title: '',
      },
    ];

    render(<PromotionsSection />);

    const images = screen.getAllByRole('img', { name: 'Promo Test 1' });
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('title', 'Promo Test 1');
  });
});
