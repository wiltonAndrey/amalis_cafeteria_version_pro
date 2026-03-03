import { describe, expect, it } from 'vitest';
import type { MenuCategory, MenuProduct } from '../types';
import { groupMenuProductsForAllView, sortMenuProductsForAllView } from '../utils/menu-products';

const createMenuProduct = (
  id: string,
  name: string,
  category: MenuCategory,
  overrides: Partial<MenuProduct> = {}
): MenuProduct => ({
  id,
  name,
  category,
  price: 1,
  description: `${name} description`,
  image: '/images/test-product.webp',
  ingredients: [],
  allergens: [],
  ...overrides,
});

describe('menu-products helpers', () => {
  it('sorts the Todos list by visible category order and then by sort_order', () => {
    const products = [
      createMenuProduct('drink-1', 'Cafe', 'bebidas', { sort_order: 0 }),
      createMenuProduct('toast-2', 'Tostada 2', 'tostadas', { sort_order: 2 }),
      createMenuProduct('offer-1', 'Oferta 1', 'ofertas', { sort_order: 0 }),
      createMenuProduct('toast-1', 'Tostada 1', 'tostadas', { sort_order: 1 }),
    ];

    expect(sortMenuProductsForAllView(products).map((product) => product.id)).toEqual([
      'toast-1',
      'toast-2',
      'offer-1',
      'drink-1',
    ]);
  });

  it('uses a stable alphabetical fallback inside a category when sort_order is missing', () => {
    const products = [
      createMenuProduct('sweet-z', 'Zeta Dulce', 'bolleria'),
      createMenuProduct('sweet-a', 'Alfa Dulce', 'bolleria'),
      createMenuProduct('sweet-b', 'Beta Dulce', 'bolleria'),
    ];

    expect(sortMenuProductsForAllView(products).map((product) => product.id)).toEqual([
      'sweet-a',
      'sweet-b',
      'sweet-z',
    ]);
  });

  it('groups the Todos view by visual category and keeps each group sorted', () => {
    const groups = groupMenuProductsForAllView([
      createMenuProduct('drink-1', 'Cafe', 'bebidas', { sort_order: 0 }),
      createMenuProduct('toast-2', 'Tostada 2', 'tostadas', { sort_order: 2 }),
      createMenuProduct('toast-1', 'Tostada 1', 'tostadas', { sort_order: 1 }),
      createMenuProduct('sweet-z', 'Zeta Dulce', 'bolleria'),
      createMenuProduct('sweet-a', 'Alfa Dulce', 'bolleria'),
    ]);

    expect(groups.map((group) => group.category)).toEqual([
      'tostadas',
      'bolleria-dulce',
      'bebidas',
    ]);

    expect(groups.find((group) => group.category === 'tostadas')?.products.map((product) => product.id)).toEqual([
      'toast-1',
      'toast-2',
    ]);

    expect(groups.find((group) => group.category === 'bolleria-dulce')?.products.map((product) => product.id)).toEqual([
      'sweet-a',
      'sweet-z',
    ]);
  });
});
