
import { Product, Testimonial, GalleryItem, MenuCategoryItem, MenuProduct, PromotionCard, FeatureCard, LocationInfo, CoffeeExperienceData } from './types';

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

export const PROMOTION_CARDS: PromotionCard[] = [
  {
    id: 'promo-breakfast',
    badge: 'Mananas',
    image: '/images/sections/editada-04.webp',
    image_alt: 'Desayuno completo con cafe, zumo y tostada artesanal',
    image_title: 'Pack desayuno completo Amalis',
    title: 'Desayuno Completo',
    price: 3.5,
    description: 'Empieza el dia con energia. Cafe de especialidad y zumo natural.',
    items: ['Cafe de especialidad', 'Zumo de naranja', 'Tostada artesana'],
    availability_text: 'Hasta 12:00',
    cta_url: '/carta',
    cta_label: 'Ver desayuno',
  },
  {
    id: 'promo-lunch',
    badge: 'Mediodia',
    image: '/images/products/pizza-york.webp',
    image_alt: 'Almuerzo con bocadillo artesanal y bebida fria',
    image_title: 'Pack almuerzo Amalis',
    title: 'Almuerzo',
    price: 5,
    description: 'La pausa perfecta con bocadillo en pan artesano y bebida fria.',
    items: ['Bocadillo artesano', 'Cerveza o Refresco'],
    availability_text: 'Lun - Vie',
    cta_url: '/carta',
    cta_label: 'Ver almuerzo',
  },
  {
    id: 'promo-snack',
    badge: 'Tardes',
    image: '/images/products/Bizcocho.webp',
    image_alt: 'Merienda dulce con granizado natural y fartons',
    image_title: 'Pack merienda dulce Amalis',
    title: 'Merienda Dulce',
    price: 4,
    description: 'Granizado de limon natural con una seleccion dulce para la tarde.',
    items: ['Granizado natural', '3 Fartons tiernos'],
    availability_text: 'Tardes',
    cta_url: '/carta',
    cta_label: 'Ver merienda',
  },
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

export const WHY_CHOOSE_US_FEATURES: FeatureCard[] = [
  {
    title: 'Tradicion',
    desc: 'Creemos que la tradicion merece un lugar privilegiado. Aqui huele a pan recien hecho desde bien temprano.',
    img: '/images/filosofia/filosofia_tradicion.png',
    imgAlt: 'Panadero artesano trabajando la masa tradicional',
  },
  {
    title: 'Sin Atajos',
    desc: 'Cero procesos industriales. La verdadera artesania no tiene modo rapido.',
    img: '/images/filosofia/filosofia_horno_panadero.png',
    imgAlt: 'Proceso manual de amasado sin maquinaria industrial',
  },
  {
    title: '100% Manos Vecinas',
    desc: 'Amasamos, horneamos y servimos cada dia para que recuperes el placer honesto de lo autentico.',
    img: '/images/filosofia/filosofia_cafe_barista.png',
    imgAlt: 'Manos artesanas preparando cafe y reposteria',
  },
  {
    title: 'Placer Honesto',
    desc: 'Lejos de lo industrial. Ingredientes reales para un sabor que conecta con lo local.',
    img: '/images/filosofia/filosofia_bodegon_honesto.png',
    imgAlt: 'Cliente disfrutando de un producto artesanal honesto',
  },
];

export const LOCATION_INFO: LocationInfo = {
  address: [
    'Carrer Almirante Antequera, 11',
    'Santa Pola, Alicante, 03130'
  ],
  mapUrl: 'https://www.google.com/maps?q=38.19156,-0.55558',
  hours: '7:00 AM - 9:00 PM'
};

export const COFFEE_EXPERIENCE_DATA: CoffeeExperienceData = {
  badge: 'Sensory experience',
  title: 'La pausa',
  highlight: 'Perfecta.',
  description: [
    'El cafe no es solo una bebida, es un ritual. Trabajamos exclusivamente con <strong className="text-white font-medium">grano 100% Arabica</strong> de origen unico, molido segundos antes de la extraccion.',
    'Notas de chocolate negro, una crema densa y avellana, y la temperatura exacta para despertar tus sentidos sin quemarlos.'
  ],
  temperature: '93°C',
  image: '/images/sections/editada-15.webp',
  imageAlt: 'Arte latte en proceso'
};

