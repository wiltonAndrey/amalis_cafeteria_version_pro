import type { MenuProduct } from '../types';

const foldText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const BEVERAGE_IMAGE_BY_NAME: Record<string, string> = {
  'cafe solo': '/images/products/cafe_solo.webp',
  'cafe cortado': '/images/products/cafe_cortado.webp',
  'cafe con leche': '/images/products/cafe_con_leche.webp',
  bombon: '/images/products/cafe_bombon.webp',
  americano: '/images/products/cafe_americano.webp',
  carajillo: '/images/products/cafe_carajillo.webp',
  belmonte: '/images/products/cafe_belmonte.webp',
  capuchino: '/images/products/capuchino.webp',
};

const ORANGE_JUICE_PRODUCT: MenuProduct = {
  id: '48-local-zumo',
  name: 'Zumo de Naranja',
  price: 2.5,
  category: 'bebidas',
  subcategory: 'zumos',
  description:
    'Zumo de naranja natural recién exprimido, fresco y con sabor cítrico intenso. Ideal para desayunos y pausas refrescantes.',
  image: '/images/products/zumo_de_naranja.webp',
  alt_text: 'Vaso de zumo de naranja natural recién exprimido en Amalis Cafetería.',
  image_title: 'Zumo de Naranja Natural - Fresco y Recién Exprimido',
  chef_suggestion: 'Perfecto con tostadas, bollería o como acompañamiento de un desayuno completo.',
  ingredients: ['Naranjas naturales recién exprimidas.'],
  allergens: ['Ninguno'],
};

export const applyMenuBeverageAssetOverrides = (products: MenuProduct[]): MenuProduct[] => {
  const nextProducts = products.map((product) => {
    if (product.category !== 'bebidas') {
      return product;
    }

    const imageOverride = BEVERAGE_IMAGE_BY_NAME[foldText(product.name)];
    if (!imageOverride || product.image === imageOverride) {
      return product;
    }

    return {
      ...product,
      image: imageOverride,
    };
  });

  const hasOrangeJuice = nextProducts.some(
    (product) => product.category === 'bebidas' && foldText(product.name) === 'zumo de naranja'
  );

  if (hasOrangeJuice) {
    return nextProducts;
  }

  return [...nextProducts, ORANGE_JUICE_PRODUCT];
};

