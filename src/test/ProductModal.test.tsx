import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../components/layout/Navbar';
import ProductModal from '../components/ProductModal';
import type { MenuProduct } from '../types';

const createProduct = (overrides: Partial<MenuProduct> = {}): MenuProduct => ({
  id: 'product-1',
  name: 'Tostada Catalana',
  price: 3.25,
  category: 'Tostadas',
  description: 'Pan tostado con tomate y jamon serrano.',
  image: '/images/test-product.webp',
  ingredients: ['Pan', 'Tomate', 'Jamon'],
  allergens: ['Gluten'],
  ...overrides,
});

describe('ProductModal', () => {
  const getZIndex = (className: string): number | null => {
    const bracketMatch = className.match(/z-\[(\d+)\]/);
    if (bracketMatch) {
      return Number(bracketMatch[1]);
    }

    const simpleMatch = className.match(/(?:^|\s)z-(\d+)(?:\s|$)/);
    if (simpleMatch) {
      return Number(simpleMatch[1]);
    }

    return null;
  };

  it('centra la imagen y limita el scrim al borde derecho', () => {
    render(<ProductModal product={createProduct()} onClose={vi.fn()} />);

    const image = screen.getByRole('img', { name: 'Tostada Catalana' });
    const scrim = document.querySelector('.product-image-scrim');

    expect(image).toHaveClass('object-cover');
    expect(image).toHaveClass('object-center');
    expect(scrim).not.toBeNull();
    expect(scrim?.className).toContain('transparent_88%');
    expect(scrim?.className).toContain('rgba(26,26,26,0.72)_100%');
  });

  it('mantiene el contenedor del modal por encima del navbar fijo en móvil', () => {
    render(
      <>
        <Navbar />
        <ProductModal product={createProduct()} onClose={vi.fn()} />
      </>
    );

    const header = document.querySelector('header');
    const modalLayer = Array.from(document.querySelectorAll('div')).find((element) =>
      element.className.includes('fixed inset-0') &&
      element.className.includes('justify-center')
    );

    expect(header).not.toBeNull();
    expect(modalLayer).not.toBeNull();

    const headerZ = getZIndex(header!.className);
    const modalZ = getZIndex(modalLayer!.className);

    expect(headerZ).not.toBeNull();
    expect(modalZ).not.toBeNull();
    expect(modalZ!).toBeGreaterThan(headerZ!);
  });
});
