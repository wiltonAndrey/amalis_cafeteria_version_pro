import { describe, expect, it } from 'vitest';
import type { MenuProduct } from '../types';
import { applyMenuBeverageAssetOverrides } from '../utils/menu-beverage-assets';

const makeDrink = (overrides: Partial<MenuProduct>): MenuProduct => ({
  id: 'tmp',
  name: 'Café Solo',
  price: 1.4,
  category: 'bebidas',
  subcategory: 'cafes',
  description: 'Test',
  image: '/images/productos/placeholder.webp',
  ingredients: ['Café'],
  allergens: ['Ninguno'],
  ...overrides,
});

describe('menu beverage asset overrides', () => {
  it('replaces coffee image paths with available files in /images/products', () => {
    const products = [
      makeDrink({ id: '39', name: 'Café Solo', image: '/images/productos/cafe-solo.webp' }),
      makeDrink({ id: '40', name: 'Café Cortado', image: '/images/products/cafe-cortado.webp' }),
      makeDrink({ id: '41', name: 'Café con Leche', image: '/images/productos/cafe-con-leche.webp' }),
      makeDrink({ id: '42', name: 'Bombón', image: '/images/productos/cafe-bombon.webp' }),
      makeDrink({ id: '43', name: 'Americano', image: '/images/productos/cafe-americano.webp' }),
      makeDrink({ id: '45', name: 'Carajillo', image: '/images/productos/carajillo.webp' }),
      makeDrink({ id: '46', name: 'Belmonte', image: '/images/productos/belmonte.webp' }),
      makeDrink({ id: '47', name: 'Capuchino', image: '/images/productos/capuchino.webp' }),
    ];

    const normalized = applyMenuBeverageAssetOverrides(products);

    const imageByName = Object.fromEntries(normalized.map((product) => [product.name, product.image]));

    expect(imageByName).toMatchObject({
      'Café Solo': '/images/products/cafe_solo.webp',
      'Café Cortado': '/images/products/cafe_cortado.webp',
      'Café con Leche': '/images/products/cafe_con_leche.webp',
      Bombón: '/images/products/cafe_bombon.webp',
      Americano: '/images/products/cafe_americano.webp',
      Carajillo: '/images/products/cafe_carajillo.webp',
      Belmonte: '/images/products/cafe_belmonte.webp',
      Capuchino: '/images/products/capuchino.webp',
    });
  });

  it('adds orange juice to bebidas when missing', () => {
    const normalized = applyMenuBeverageAssetOverrides([
      makeDrink({ id: '39', name: 'Café Solo' }),
    ]);

    const orangeJuice = normalized.find((product) => product.name === 'Zumo de Naranja');

    expect(orangeJuice).toBeTruthy();
    expect(orangeJuice).toMatchObject({
      category: 'bebidas',
      subcategory: 'zumos',
      image: '/images/products/zumo_de_naranja.webp',
    });
  });

  it('does not duplicate orange juice when it already exists', () => {
    const normalized = applyMenuBeverageAssetOverrides([
      makeDrink({ id: '90', name: 'Zumo de Naranja', subcategory: 'zumos', image: '/images/products/zumo_de_naranja.webp' }),
    ]);

    expect(normalized.filter((product) => product.name === 'Zumo de Naranja')).toHaveLength(1);
  });
});
