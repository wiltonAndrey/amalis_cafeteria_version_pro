import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProducts, ProductPayload } from '../hooks/useProducts';
import type { MenuProduct } from '../types';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe('useProducts', () => {
  it('crea un producto y actualiza la lista con el id del servidor', async () => {
    const initial: MenuProduct[] = [];
    const payload: ProductPayload = {
      name: 'Nuevo',
      price: 2.5,
      category: 'cocas',
      description: 'Descripcion',
      image: '/images/sections/editada-01.webp',
      ingredients: [],
      allergens: [],
      featured: false,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, id: 10 }),
    } as Response);

    const { result } = renderHook(() => useProducts(initial));

    await act(async () => {
      await result.current.createProduct(payload);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('10');
  });

  it('actualiza un producto existente', async () => {
    const initial: MenuProduct[] = [
      {
        id: '1',
        name: 'Antes',
        price: 1,
        category: 'cocas',
        description: 'Viejo',
        image: '/images/sections/editada-01.webp',
        ingredients: [],
        allergens: [],
        featured: false,
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    const { result } = renderHook(() => useProducts(initial));

    await act(async () => {
      await result.current.updateProduct({
        id: '1',
        name: 'Despues',
        price: 1.2,
        category: 'cocas',
        description: 'Nuevo',
        image: '/images/sections/editada-01.webp',
        ingredients: [],
        allergens: [],
        featured: true,
      });
    });

    expect(result.current.items[0].name).toBe('Despues');
  });
});
