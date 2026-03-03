import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
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
      image: '/images/sections/pan-artesano-horneado.webp',
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
        image: '/images/sections/pan-artesano-horneado.webp',
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
        image: '/images/sections/pan-artesano-horneado.webp',
        ingredients: [],
        allergens: [],
        featured: true,
      });
    });

    expect(result.current.items[0].name).toBe('Despues');
  });

  it('sincroniza la lista canonica tras reordenar un producto para evitar duplicados de sort_order', async () => {
    const initial: MenuProduct[] = [
      {
        id: '1',
        name: 'Tostada 1',
        price: 2.5,
        category: 'tostadas',
        sort_order: 1,
        description: 'Primera',
        image: '/images/sections/pan-artesano-horneado.webp',
        ingredients: [],
        allergens: [],
        featured: false,
      },
      {
        id: '2',
        name: 'Tostada 2',
        price: 2.7,
        category: 'tostadas',
        sort_order: 2,
        description: 'Segunda',
        image: '/images/sections/pan-artesano-horneado.webp',
        ingredients: [],
        allergens: [],
        featured: false,
      },
    ];

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          menuProducts: [
            {
              id: '2',
              name: 'Tostada 2',
              price: 2.7,
              category: 'tostadas',
              sort_order: 1,
              description: 'Segunda',
              image: '/images/sections/pan-artesano-horneado.webp',
              ingredients: [],
              allergens: [],
              featured: false,
            },
            {
              id: '1',
              name: 'Tostada 1',
              price: 2.5,
              category: 'tostadas',
              sort_order: 2,
              description: 'Primera',
              image: '/images/sections/pan-artesano-horneado.webp',
              ingredients: [],
              allergens: [],
              featured: false,
            },
          ],
        }),
      } as Response);

    const { result } = renderHook(() => useProducts(initial));

    await act(async () => {
      await result.current.updateProduct({
        id: '2',
        name: 'Tostada 2',
        price: 2.7,
        category: 'tostadas',
        sort_order: 1,
        description: 'Segunda',
        image: '/images/sections/pan-artesano-horneado.webp',
        ingredients: [],
        allergens: [],
        featured: false,
      });
    });

    expect(result.current.items.map((product) => ({ id: product.id, sort_order: product.sort_order }))).toEqual([
      { id: '2', sort_order: 1 },
      { id: '1', sort_order: 2 },
    ]);
  });

  it('sincroniza la lista canonica tras borrar para compactar sort_order de inmediato', async () => {
    const initial: MenuProduct[] = [
      {
        id: '1',
        name: 'Tostada 1',
        price: 2.5,
        category: 'tostadas',
        sort_order: 1,
        description: 'Primera',
        image: '/images/sections/pan-artesano-horneado.webp',
        ingredients: [],
        allergens: [],
        featured: false,
      },
      {
        id: '2',
        name: 'Tostada 2',
        price: 2.7,
        category: 'tostadas',
        sort_order: 2,
        description: 'Segunda',
        image: '/images/sections/pan-artesano-horneado.webp',
        ingredients: [],
        allergens: [],
        featured: false,
      },
    ];

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          menuProducts: [
            {
              id: '2',
              name: 'Tostada 2',
              price: 2.7,
              category: 'tostadas',
              sort_order: 1,
              description: 'Segunda',
              image: '/images/sections/pan-artesano-horneado.webp',
              ingredients: [],
              allergens: [],
              featured: false,
            },
          ],
        }),
      } as Response);

    const { result } = renderHook(() => useProducts(initial));

    await act(async () => {
      await result.current.deleteProduct('1');
    });

    expect(result.current.items.map((product) => ({ id: product.id, sort_order: product.sort_order }))).toEqual([
      { id: '2', sort_order: 1 },
    ]);
  });

  it('normaliza productos del admin por categoria y sort_order aunque la API los devuelva mezclados', async () => {
    const initial: MenuProduct[] = [];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        menuProducts: [
          {
            id: 'bebida-1',
            name: 'Cafe',
            price: 1.5,
            category: 'bebidas',
            sort_order: 0,
            description: 'Cafe',
            image: '/images/sections/pan-artesano-horneado.webp',
            ingredients: [],
            allergens: [],
            featured: false,
          },
          {
            id: 'dulce-z',
            name: 'Zeta Dulce',
            price: 2.5,
            category: 'bolleria-dulce',
            description: 'Zeta',
            image: '/images/sections/pan-artesano-horneado.webp',
            ingredients: [],
            allergens: [],
            featured: false,
          },
          {
            id: 'tostada-2',
            name: 'Tostada 2',
            price: 2.9,
            category: 'tostadas',
            sort_order: 2,
            description: 'Tostada 2',
            image: '/images/sections/pan-artesano-horneado.webp',
            ingredients: [],
            allergens: [],
            featured: false,
          },
          {
            id: 'dulce-a',
            name: 'Alfa Dulce',
            price: 2.3,
            category: 'bolleria-dulce',
            description: 'Alfa',
            image: '/images/sections/pan-artesano-horneado.webp',
            ingredients: [],
            allergens: [],
            featured: false,
          },
          {
            id: 'tostada-1',
            name: 'Tostada 1',
            price: 2.7,
            category: 'tostadas',
            sort_order: 1,
            description: 'Tostada 1',
            image: '/images/sections/pan-artesano-horneado.webp',
            ingredients: [],
            allergens: [],
            featured: false,
          },
        ],
      }),
    } as Response);

    const { result } = renderHook(() => useProducts(initial, { autoRefresh: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.items).toHaveLength(5);
    });

    expect(result.current.items.map((product) => product.id)).toEqual([
      'tostada-1',
      'tostada-2',
      'dulce-a',
      'dulce-z',
      'bebida-1',
    ]);
  });
});
