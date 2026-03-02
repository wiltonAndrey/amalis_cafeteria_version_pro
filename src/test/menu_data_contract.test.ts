import { describe, expect, it } from 'vitest';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../constants';

describe('menu data contract', () => {
  it('keeps the canonical carta category order and fallback beverages', () => {
    expect(MENU_CATEGORIES.map((item) => item.id)).toEqual([
      'all',
      'ofertas',
      'tostadas',
      'bolleria',
      'bizcochos',
      'pasteles',
      'cocas',
      'empanadillas',
      'bebidas',
    ]);

    const espresso = MENU_PRODUCTS.find((item) => item.id === 'b1');

    expect(espresso).toBeDefined();
    expect(espresso?.category).toBe('bebidas');
    expect(espresso?.badge).toBe('CAFÉS');
  });
});
