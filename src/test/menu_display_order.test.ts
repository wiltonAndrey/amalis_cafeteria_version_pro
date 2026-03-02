import { describe, expect, it } from 'vitest';
import type { MenuCategoryItem, MenuProduct } from '../types';
import { orderMenuProductsForDisplay } from '../utils/menu-display-order';

const makeProduct = (id: string, category: MenuProduct['category'], name: string): MenuProduct => ({
  id,
  name,
  price: 1,
  category,
  description: `${name} desc`,
  image: '/images/products/test.webp',
  ingredients: ['Test'],
  allergens: ['Test'],
});

describe('menu display order', () => {
  it('shows tostadas first in the all category and then follows visible category order', () => {
    const categories: MenuCategoryItem[] = [
      { id: 'all', label: 'Todos' },
      { id: 'tostadas', label: 'Tostadas' },
      { id: 'bolleria_dulce', label: 'Bolleria Dulce' },
      { id: 'bolleria_salada', label: 'Bolleria Salada' },
      { id: 'pasteleria', label: 'Pasteleria' },
      { id: 'ofertas', label: 'Ofertas' },
      { id: 'bebidas', label: 'Bebidas' },
    ];

    const products: MenuProduct[] = [
      makeProduct('1', 'bebidas', 'Cafe Solo'),
      makeProduct('2', 'pasteleria', 'Almojabena'),
      makeProduct('3', 'tostadas', 'Media Tostada'),
      makeProduct('4', 'bolleria_salada', 'Coca de Verdura'),
      makeProduct('5', 'bolleria_dulce', 'Croissant'),
      makeProduct('6', 'tostadas', 'Tostada Catalana'),
    ];

    const ordered = orderMenuProductsForDisplay(products, categories);

    expect(ordered.map((product) => product.name)).toEqual([
      'Media Tostada',
      'Tostada Catalana',
      'Croissant',
      'Coca de Verdura',
      'Almojabena',
      'Cafe Solo',
    ]);
  });

  it('keeps unknown categories after the known visible groups', () => {
    const categories: MenuCategoryItem[] = [
      { id: 'all', label: 'Todos' },
      { id: 'tostadas', label: 'Tostadas' },
      { id: 'bebidas', label: 'Bebidas' },
    ];

    const products: MenuProduct[] = [
      makeProduct('1', 'temporada', 'Especial'),
      makeProduct('2', 'bebidas', 'Cafe'),
      makeProduct('3', 'tostadas', 'Tostada'),
    ];

    const ordered = orderMenuProductsForDisplay(products, categories);

    expect(ordered.map((product) => product.name)).toEqual([
      'Tostada',
      'Cafe',
      'Especial',
    ]);
  });
});
