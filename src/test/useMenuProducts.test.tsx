import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMenuProducts } from '../hooks/useMenuProducts';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('useMenuProducts', () => {
  it('keeps the visible category rail fixed and uses only CMS products', async () => {
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
    expect(result.current.menuProducts).toEqual([
      expect.objectContaining({
        id: '7',
        name: 'Pack Desayuno CMS',
        category: 'ofertas',
      }),
    ]);
  });

  it('returns no products when the API fails instead of falling back to hardcoded menu items', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('offline'));

    const { result } = renderHook(() => useMenuProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('cms_unavailable');
    expect(result.current.menuProducts).toEqual([]);
  });

  it('normalizes CMS products for the Todos view by category order and sort_order', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        menuProducts: [
          {
            id: 'cms-bebida',
            name: 'Cafe CMS',
            price: 1.9,
            category: 'bebidas',
            description: 'Cafe',
            image: '/images/sections/vertido-cafe-espresso.webp',
            ingredients: [],
            allergens: [],
            featured: false,
            sort_order: 0,
          },
          {
            id: 'cms-tostada-2',
            name: 'Tostada CMS 2',
            price: 3.1,
            category: 'tostadas',
            description: 'Tostada 2',
            image: '/images/products/Tostada-Tomate.webp',
            ingredients: [],
            allergens: [],
            featured: false,
            sort_order: 2,
          },
          {
            id: 'cms-oferta',
            name: 'Oferta CMS',
            price: 4.5,
            category: 'ofertas',
            description: 'Oferta',
            image: '/images/sections/editada-04.webp',
            ingredients: [],
            allergens: [],
            featured: true,
            sort_order: 0,
          },
          {
            id: 'cms-tostada-1',
            name: 'Tostada CMS 1',
            price: 2.9,
            category: 'tostadas',
            description: 'Tostada 1',
            image: '/images/products/Tostada-Tomate.webp',
            ingredients: [],
            allergens: [],
            featured: false,
            sort_order: 1,
          },
        ],
      }),
    } as Response);

    const { result } = renderHook(() => useMenuProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const cmsIds = result.current.menuProducts
      .filter((product) => product.id.startsWith('cms-'))
      .map((product) => product.id);

    expect(cmsIds).toEqual([
      'cms-tostada-1',
      'cms-tostada-2',
      'cms-oferta',
      'cms-bebida',
    ]);
  });
});
