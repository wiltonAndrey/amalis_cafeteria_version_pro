import type { MenuProduct } from '../types';

export const MENU_CRITICAL_PRODUCTS: MenuProduct[] = [
  {
    id: '93',
    name: '½ Tostada de Atún, Aceite y Tomate',
    price: 3.35,
    category: 'tostadas',
    description: 'Media tostada de pan rústico con aceite de oliva, tomate triturado y atún. Una opción mediterránea, saciante y muy práctica para desayuno o almuerzo.',
    image: '/images/products/Tostada-Tomate-Atun.webp',
    alt_text: 'Media tostada rústica con tomate natural triturado, atún y aceite de oliva virgen en Amalis Cafetería.',
    ingredients: [
      'Pan rústico tostado (harina de trigo y levadura)',
      'generoso chorrito de aceite de oliva',
      'tomate natural triturado y una excelente combinación de atún.',
    ],
    allergens: ['Gluten (Trigo)', 'Pescado'],
  },
  {
    id: '94',
    name: '½ Tostada de Queso Fresco y Aceite',
    price: 2.55,
    category: 'tostadas',
    description: 'Media tostada de pan crujiente con queso fresco y aceite de oliva virgen. Una opción ligera, suave y equilibrada para empezar la mañana.',
    image: '/images/products/Tostada-QuesoFresco.webp',
    alt_text: 'Media tostada de pan rústico con queso fresco y aceite de oliva en Amalis Cafetería.',
    ingredients: [
      'Media rebanada de pan rústico recién tostado (harina de trigo y levadura)',
      'aderezada con un buen chorrito de aceite de oliva y coronada con suave queso fresco.',
    ],
    allergens: ['Gluten (Trigo)', 'Leche'],
  },
];
