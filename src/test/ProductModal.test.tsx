import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
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
});
