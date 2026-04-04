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

  it('muestra bizcochos al público con precio principal por 100 g', () => {
    render(
      <ProductModal
        product={createProduct({
          name: 'Bizcocho de Pistacho',
          price: '26.00' as any,
          category: 'bolleria',
          price_unit: 'kg',
        })}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('2,60 €/100 g');
    expect(screen.queryByText('26.00€')).not.toBeInTheDocument();
  });

  it('normaliza la etiqueta de categoría para payloads legacy de bizcochos', () => {
    render(
      <ProductModal
        product={createProduct({
          name: 'Bizcocho de Pistacho',
          price: '26.00' as any,
          category: 'bizcochos',
          price_unit: undefined,
        })}
        onClose={vi.fn()}
      />
    );

    const categoryBadges = screen.getAllByText('Pastelería');

    expect(categoryBadges.length).toBeGreaterThan(0);
    expect(screen.queryByText('bizcochos')).not.toBeInTheDocument();
  });

  it('reutiliza el formato público estándar para productos no pesados', () => {
    render(<ProductModal product={createProduct({ price: 3.5, category: 'tostadas' })} onClose={vi.fn()} />);

    expect(screen.getByRole('dialog')).toHaveTextContent('3.50 EUR');
    expect(screen.queryByText('3.50€')).not.toBeInTheDocument();
  });

  it('prioriza price_unit unit sobre la heurística legacy de bizcocho', () => {
    render(
      <ProductModal
        product={createProduct({
          name: 'Bizcocho de Pistacho',
          price: '26.00' as any,
          category: 'bizcochos',
          price_unit: 'unit',
        })}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('26.00 EUR');
    expect(screen.queryByText('2,60 €/100 g')).not.toBeInTheDocument();
  });
});
