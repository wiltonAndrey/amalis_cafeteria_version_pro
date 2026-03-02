import { describe, expect, it } from 'vitest';
import type { MenuProduct } from '../types';
import {
  buildBeverageDisplayFilterOptions,
  matchesBeverageDisplayFilter,
  orderBeverageProductsForDisplay,
} from '../utils/menu-beverage-display';

const makeDrink = (overrides: Partial<MenuProduct>): MenuProduct => ({
  id: 'tmp',
  name: 'Cafe Solo',
  price: 1.4,
  category: 'bebidas',
  subcategory: 'cafes',
  description: 'Test',
  image: '/images/products/test.webp',
  ingredients: ['Cafe'],
  allergens: ['Ninguno'],
  ...overrides,
});

describe('menu beverage display order', () => {
  it('builds subcategory filters in fixed order and groups unknown items as resto', () => {
    const products: MenuProduct[] = [
      makeDrink({ id: '1', name: 'Batido', subcategory: 'batidos' }),
      makeDrink({ id: '2', name: 'Zumo de Naranja', subcategory: 'zumos' }),
      makeDrink({ id: '3', name: 'Cola Cao', subcategory: 'cacao' }),
      makeDrink({ id: '4', name: 'Cafe Solo', subcategory: 'cafes' }),
      makeDrink({ id: '5', name: 'Infusion', subcategory: 'infusiones' }),
      makeDrink({ id: '6', name: 'Agua', subcategory: null }),
    ];

    const options = buildBeverageDisplayFilterOptions(products);

    expect(options.map((option) => option.id)).toEqual([
      'cafes',
      'infusiones',
      'cacao',
      'zumos',
      'resto',
    ]);
    expect(options.find((option) => option.id === 'resto')?.label).toBe('Resto de bebidas');
  });

  it('orders bebidas by fixed groups while preserving current order inside each group', () => {
    const products: MenuProduct[] = [
      makeDrink({ id: '1', name: 'Batido de Chocolate', subcategory: 'batidos' }),
      makeDrink({ id: '2', name: 'Cafe Solo', subcategory: 'cafes' }),
      makeDrink({ id: '3', name: 'Zumo de Naranja', subcategory: 'zumos' }),
      makeDrink({ id: '4', name: 'Infusion', subcategory: 'infusiones' }),
      makeDrink({ id: '5', name: 'Bombon', subcategory: 'cafes' }),
      makeDrink({ id: '6', name: 'Agua', subcategory: null }),
      makeDrink({ id: '7', name: 'Cola Cao', subcategory: 'cacao' }),
      makeDrink({ id: '8', name: 'Infusion Especial', subcategory: 'infusiones' }),
      makeDrink({ id: '9', name: 'Refresco', subcategory: '' }),
    ];

    const ordered = orderBeverageProductsForDisplay(products);

    expect(ordered.map((product) => product.name)).toEqual([
      'Cafe Solo',
      'Bombon',
      'Infusion',
      'Infusion Especial',
      'Cola Cao',
      'Zumo de Naranja',
      'Batido de Chocolate',
      'Agua',
      'Refresco',
    ]);
  });

  it('matches unknown or missing subcategories under resto filter', () => {
    expect(matchesBeverageDisplayFilter(makeDrink({ subcategory: 'batidos' }), 'resto')).toBe(true);
    expect(matchesBeverageDisplayFilter(makeDrink({ subcategory: null }), 'resto')).toBe(true);
    expect(matchesBeverageDisplayFilter(makeDrink({ subcategory: 'cafes' }), 'resto')).toBe(false);
    expect(matchesBeverageDisplayFilter(makeDrink({ subcategory: 'zumos' }), 'zumos')).toBe(true);
  });
});
