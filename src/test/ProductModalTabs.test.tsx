import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProductModalTabs } from '../components/ProductModalTabs';
import type { MenuProduct } from '../types';

const createProduct = (overrides: Partial<MenuProduct> = {}): MenuProduct => ({
  id: 'chef-1',
  name: 'Tostada de la Casa',
  price: 3.5,
  category: 'tostadas',
  description: 'Pan crujiente con tomate natural.',
  chef_suggestion: 'Pruebala recien hecha con un cafe cortado.',
  image: '/images/test-product.webp',
  ingredients: ['Pan', 'Tomate', 'AOVE'],
  allergens: ['Gluten'],
  ...overrides,
});

describe('ProductModalTabs', () => {
  it('muestra la sugerencia personalizada del chef cuando el producto la incluye', () => {
    render(
      <ProductModalTabs
        product={createProduct()}
        activeTab="desc"
        onTabChange={vi.fn()}
      />
    );

    expect(screen.getByText('Pruebala recien hecha con un cafe cortado.')).toBeInTheDocument();
  });

  it('usa un fallback breve y neutro cuando no hay sugerencia guardada', () => {
    render(
      <ProductModalTabs
        product={createProduct({ chef_suggestion: '   ' })}
        activeTab="desc"
        onTabChange={vi.fn()}
      />
    );

    expect(
      screen.getByText('Consejo rapido: mejor recien hecho para disfrutar su punto.')
    ).toBeInTheDocument();
  });

  it('renderiza alergenos y texto de trazas sin secuencias unicode literales', () => {
    const { container } = render(
      <ProductModalTabs
        product={createProduct({ allergens: ['L\\u00e1cteos'] })}
        activeTab="ale"
        onTabChange={vi.fn()}
      />
    );

    expect(screen.getByText('Lácteos')).toBeInTheDocument();
    expect(screen.getByText(/Información sobre trazas:/i)).toBeInTheDocument();
    expect(container.textContent).not.toContain('\\u00');
  });
});
