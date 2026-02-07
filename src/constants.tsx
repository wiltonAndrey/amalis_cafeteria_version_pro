
import { Product, Testimonial, GalleryItem, MenuCategoryItem, MenuProduct } from './types';

export const MENU_CATEGORIES: MenuCategoryItem[] = [
  { id: 'all', label: 'Todos' },
  { id: 'cocas', label: 'Cocas' },
  { id: 'empanadillas', label: 'Empanadillas' },
  { id: 'bolleria', label: 'Bollería' },
  { id: 'bizcochos', label: 'Bizcochos' },
  { id: 'pasteles', label: 'Pasteles' },
  { id: 'tostadas', label: 'Tostadas' },
  { id: 'ofertas', label: 'Ofertas' },
];

export const MENU_PRODUCTS: MenuProduct[] = [
  {
    id: '1',
    name: 'Coca de Mollitas',
    price: 1.50,
    category: 'cocas',
    description: 'La clásica coca alicantina con su característica capa crujiente de harina y aceite.',
    image: '/images/products/Coca-Sardina.webp',
    ingredients: ['Harina de trigo', 'Aceite de oliva', 'Vino blanco', 'Sal'],
    allergens: ['Gluten'],
    featured: true
  },
  {
    id: '2',
    name: 'Coca de Verdura',
    price: 2.50,
    category: 'cocas',
    description: 'Deliciosa masa artesanal cubierta con pimiento, tomate y cebolla asada.',
    image: '/images/products/Coca-Pisto.webp',
    ingredients: ['Harina', 'Pimiento rojo', 'Tomate', 'Cebolla', 'Aceite'],
    allergens: ['Gluten'],
    featured: true
  },
  {
    id: '3',
    name: 'Empanadilla de Pisto',
    price: 1.80,
    category: 'empanadillas',
    description: 'Rellena de nuestro pisto casero elaborado a fuego lento.',
    image: '/images/products/Empanada-Pisto.webp',
    ingredients: ['Tomate', 'Pimiento', 'Huevo duro', 'Atún'],
    allergens: ['Gluten', 'Pescado', 'Huevo']
  },
  {
    id: '4',
    name: 'Croissant de Mantequilla',
    price: 1.40,
    category: 'bolleria',
    description: 'Hojaldre artesanal con auténtica mantequilla, crujiente por fuera y tierno por dentro.',
    image: '/images/products/Croissant-Mantequilla.webp',
    ingredients: ['Harina', 'Mantequilla', 'Leche', 'Azúcar'],
    allergens: ['Gluten', 'Lácteos']
  },
  {
    id: '5',
    name: 'Bizcocho de Yogur y Limón',
    price: 12.00,
    category: 'bizcochos',
    description: 'Bizcocho esponjoso ideal para compartir en desayunos o meriendas.',
    image: '/images/products/Bizcocho.webp',
    ingredients: ['Huevo', 'Yogur', 'Limón', 'Azúcar', 'Harina'],
    allergens: ['Gluten', 'Huevo', 'Lácteos']
  },
  {
    id: '6',
    name: 'Tostada de Tomate y AOVE',
    price: 2.80,
    category: 'tostadas',
    description: 'Pan artesanal tostado con tomate natural rallado y aceite de oliva virgen extra.',
    image: '/images/products/Tostada-Tomate.webp',
    ingredients: ['Pan artesanal', 'Tomate', 'Aceite de oliva', 'Sal'],
    allergens: ['Gluten']
  },
  {
    id: '7',
    name: 'Pack Desayuno Amalis',
    price: 4.50,
    category: 'ofertas',
    description: 'Café + Zumo de Naranja Natural + Tostada o Pieza de Bollería.',
    image: '/images/sections/editada-04.webp',
    ingredients: ['Varios según elección'],
    allergens: ['Varios según elección'],
    featured: true
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pan de Masa Madre',
    description: 'Pan honesto. Harina, agua, y el ingrediente secreto: paciencia. Fermentación lenta para una corteza dorada y miga tierna.',
    price: 'Consultar', // Price not in copy, keeping placeholder or remove if needed. Kept generic.
    category: 'Bread',
    imageUrl: '/images/sections/editada-09.webp',
    imageAlt: 'Hogaza de pan de masa madre artesanal con corteza rústica dorada',
  },
  {
    id: '2',
    name: 'Cocas Artesanas "De la Terreta"',
    description: 'Nuestras reinas. Desde la clásica de sardinas hasta las de verduras frescas sobre masa fina. Sabor tradicional de Santa Pola.',
    price: 'Desde 3,50 €',
    category: 'Pastry',
    imageUrl: '/images/Coca-Sardina.webp', // Need a coca image, using a placeholder savory tart/pizza style
    imageAlt: 'Coca artesana tradicional con verduras frescas y sardinas',
  },
  {
    id: '3',
    name: 'Rollos Tradicionales',
    description: 'El dulce que nos define. Receta heredada, hecha a mano. Anís, Vino, Naranja y Huevo. El acompañante perfecto.',
    price: '1,50 €',
    category: 'Pastry',
    imageUrl: '/images/editada-1458-2.webp', // Rollos/Donut style
    imageAlt: 'Rollos tradicionales de anís y naranja recién hechos',
  },
  {
    id: '4',
    name: 'Bizcochos Caseros',
    description: 'Merendar como antes. Naranja, Chocolate con Nuez, Canela... Sin conservantes. Solo ingredientes reales.',
    price: '3,50 €',
    category: 'Cake',
    imageUrl: '/images/products/Bizcocho.webp',
    imageAlt: 'Bizcocho casero esponjoso de naranja y chocolate',
  },
];

export const CMS_DEFAULT_SETTINGS = {
  seo: {
    title: 'Amalis Cafetería | Pan artesanal en Santa Pola',
    description: 'Panadería y cafetería artesanal en Santa Pola. Cocas tradicionales, bollería casera y café de especialidad.'
  },
  hero: {
    title: 'El Corazón de Santa Pola, Sin Atajos.',
    subtitle: 'Aquí huele a pan recién hecho desde bien temprano.',
    quote: 'La verdadera artesanía no tiene modo rápido.'
  },
  contact: {
    address: 'Visítanos en Santa Pola',
    hours: 'Lunes - Domingo · 07:00 - 21:00'
  },
  social: {
    instagram: 'https://instagram.com/amaliscafeteria',
    facebook: 'https://facebook.com/amaliscafeteria',
    twitter: 'https://twitter.com/amaliscafeteria'
  }
};

export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Bread: 'Pan',
  Pastry: 'Bollería',
  Cake: 'Tartas',
  Coffee: 'Café'
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'María Gómez',
    role: 'Cliente Habitual',
    content: 'Me encanta este sitio: el trato amable y el ambiente acogedor lo convierten en un imprescindible en Santa Pola. Sus bocadillos son tremendos.',
    avatarUrl: '/images/testimonials/editada-1407-2.webp',
  },
  {
    id: '2',
    name: 'Jorge Rocamora',
    role: 'Primera Visita',
    content: 'Cafetería Amalis superó todas mis expectativas. Buscaba un desayuno sencillo pero delicioso, y encontré un ambiente acogedor y un servicio tan amable que sin duda repetiré.',
    avatarUrl: '/images/testimonials/editada-1415-3.webp',
  },
  {
    id: '3',
    name: 'Laura Jiménez',
    role: 'Local Guide',
    content: 'Cada mañana es un auténtico placer; su variada oferta de pastelería artesanal dulce y salada, junto a un café de calidad, hacen de este rincón el lugar perfecto.',
    avatarUrl: '/images/testimonials/editada-1421-2.webp',
  },
  {
    id: '4',
    name: 'BJ N',
    role: 'Cliente',
    content: 'Tiene un ambiente limpio y espacioso, un personal muy amable y una excelente selección de pastelería artesanal. Ideal tanto para disfrutar en el local o para llevar.',
    avatarUrl: '/images/testimonials/editada-1424-2.webp',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', url: '/images/sections/editada-01.webp', alt: 'Pan recién horneado', span: 'md:col-span-2 md:row-span-2' },
  { id: 'g2', url: '/images/sections/editada-07.webp', alt: 'Vertido de café', span: 'md:col-span-1 md:row-span-1' },
  { id: 'g3', url: '/images/sections/editada-10.webp', alt: 'Expositor de tartas', span: 'md:col-span-1 md:row-span-1' },
  { id: 'g4', url: '/images/sections/editada-12.webp', alt: 'Interior de la panadería', span: 'md:col-span-1 md:row-span-2' },
  { id: 'g5', url: '/images/products/Croissant-Choco.webp', alt: 'Croissants dorados', span: 'md:col-span-1 md:row-span-1' },
  { id: 'g6', url: '/images/products/Bizcocho-Canela.webp', alt: 'Rollos de canela', span: 'md:col-span-1 md:row-span-1' },
  { id: 'g7', url: '/images/products/Bizcocho-Chocolate-Pepitas.webp', alt: 'Muffins de arándanos', span: 'md:col-span-1 md:row-span-1' },
  { id: 'g8', url: '/images/sections/editada-15.webp', alt: 'Café latte art', span: 'md:col-span-1 md:row-span-1' },
];
