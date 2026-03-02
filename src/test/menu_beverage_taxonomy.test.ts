import { describe, expect, it } from 'vitest';
import {
  deriveBeverageSubcategoryFromName,
  normalizeMenuCategories,
  normalizeMenuProductTaxonomy,
  type MenuProductTaxonomyShape,
} from '../utils/menu-taxonomy';

describe('menu beverage taxonomy utils', () => {
  it('derives beverage subcategory from product name using agreed rules', () => {
    expect(deriveBeverageSubcategoryFromName('Infusion')).toBe('infusiones');
    expect(deriveBeverageSubcategoryFromName('Infusion Especial')).toBe('infusiones');
    expect(deriveBeverageSubcategoryFromName('Cola Cao')).toBe('cacao');
    expect(deriveBeverageSubcategoryFromName('Capuchino')).toBe('cafes');
  });

  it('normalizes legacy cafes category into bebidas + cafes subcategory', () => {
    const legacyProduct: MenuProductTaxonomyShape = {
      name: 'CafÃ© Solo',
      category: 'cafes',
    };

    expect(normalizeMenuProductTaxonomy(legacyProduct)).toMatchObject({
      category: 'bebidas',
      subcategory: 'cafes',
    });
  });

  it('preserves existing non-beverage categories', () => {
    const product: MenuProductTaxonomyShape = {
      name: 'Coca de Mollitas',
      category: 'bolleria_salada',
    };

    expect(normalizeMenuProductTaxonomy(product)).toMatchObject({
      category: 'bolleria_salada',
      name: 'Coca de Mollitas',
      subcategory: null,
    });
  });

  it('normalizes backend category payloads into a stable display order and labels', () => {
    const categories = [
      { id: 'bebidas', label: 'Drinks' },
      { id: 'pasteleria', label: '' },
      { id: 'cafes', label: 'CafÃ©s' },
      { id: 'bolleria_salada', label: 'Salado' },
      { id: 'tostadas', label: 'Toast' },
      { id: 'temporada', label: 'Temporada' },
    ];

    expect(normalizeMenuCategories(categories)).toEqual([
      { id: 'all', label: 'Todos' },
      { id: 'tostadas', label: 'Tostadas' },
      { id: 'bolleria_dulce', label: 'BollerÃ­a Dulce' },
      { id: 'bolleria_salada', label: 'BollerÃ­a Salada' },
      { id: 'pasteleria', label: 'PastelerÃ­a' },
      { id: 'ofertas', label: 'Ofertas' },
      { id: 'bebidas', label: 'Bebidas' },
      { id: 'temporada', label: 'Temporada' },
    ]);
  });
});
