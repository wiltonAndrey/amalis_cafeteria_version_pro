import { describe, expect, it } from 'vitest';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../constants';
import { normalizeAdminMenuCategory, normalizeMenuCategory } from '../utils/menu-categories';

describe('menu data contract', () => {
  it('keeps the exact visible categories for the carta rail', () => {
    expect(MENU_CATEGORIES.map((item) => item.id)).toEqual([
      'all',
      'tostadas',
      'bolleria-salada',
      'bolleria-dulce',
      'pasteleria',
      'ofertas',
      'bebidas',
    ]);

    const espresso = MENU_PRODUCTS.find((item) => item.id === 'b1');

    expect(espresso).toBeDefined();
    expect(espresso?.category).toBe('bebidas');
    expect(espresso?.badge).toBeTruthy();
  });

  it('normalizes persisted categories from MySQL safely', () => {
    expect(normalizeMenuCategory('bolleria_salada' as any)).toBe('bolleria-salada');
    expect(normalizeMenuCategory('bolleria_dulce' as any)).toBe('bolleria-dulce');
    expect(normalizeAdminMenuCategory('bebidas' as any, 'tostadas' as any)).toBe('bebidas');
  });
});
