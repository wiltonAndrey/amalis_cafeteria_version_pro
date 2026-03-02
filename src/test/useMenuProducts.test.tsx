import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMenuProducts } from '../hooks/useMenuProducts';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('useMenuProducts', () => {
  it('keeps the visible category rail fixed even if the CMS returns extra categories', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        menuCategories: [
          { id: 'all', label: 'Todos' },
          { id: 'cocas', label: 'Cocas' },
          { id: 'empanadillas', label: 'Empanadillas' },
          { id: 'bebidas', label: 'Bebidas' },
        ],
        menuProducts: [
          {
            id: '7',
            name: 'Pack Desayuno CMS',
            price: 4.9,
            category: 'ofertas',
            description: 'Versión del CMS',
            image: '/images/sections/editada-04.webp',
            ingredients: ['Varios'],
            allergens: ['Varios'],
            featured: true,
          },
        ],
      }),
    } as Response);

    const { result } = renderHook(() => useMenuProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.menuCategories.map((category) => category.id)).toEqual([
      'all',
      'tostadas',
      'bolleria-salada',
      'bolleria-dulce',
      'pasteleria',
      'ofertas',
      'bebidas',
    ]);
    expect(result.current.menuProducts.some((product) => product.category === 'bebidas')).toBe(true);
    expect(result.current.menuProducts.find((product) => product.id === '7')?.name).toBe('Pack Desayuno CMS');
  });
});
