
import { Product, Testimonial, GalleryItem, MenuCategoryItem, MenuProduct, PromotionCard, FeatureCard, LocationInfo, CoffeeExperienceData } from './types';

export const HERO_CONTENT = {
  title: 'Panadería, cafetería y pastelería en Santa Pola',
  highlight: '(a dos calles del Castillo)',
  subtitle: 'Pan y bollería recién horneados cada mañana, dulces de vitrina y café para tu paseo.',
  ctaPrimary: 'Ver carta',
  ctaSecondary: 'Cómo llegar',
  microcopy: 'Abierto desde primera hora · Para llevar y para disfrutar aquí'
};

export const HISTORY_SECTION = {
  eyebrow: 'Esencia de obrador',
  title: 'Nuestra',
  highlight: 'historia',
  description: 'Nos gusta lo simple bien hecho: pan y bollería recién horneados, café y pastelería para el día a día. Sin prisas y sin atajos. Y sí: estamos en Santa Pola, a dos calles del Castillo.',
  footer: 'Si vienes al Castillo, te cae un café. Si vienes por el café, te llevas un pastel. Así de simple.',
  ctaButton: 'Ver carta completa'
};

export const FEATURED_PRODUCTS_SECTION = {
  eyebrow: 'Lo que más se pide',
  title: 'Los 4',
  highlight: 'Pilares',
  description: 'Pan, salado y dulce del día, recién horneado y listo para disfrutar. Estamos en Santa Pola, a dos calles del Castillo.',
  ctaFooter: 'Ver carta completa'
};

export const PROMOTIONS_SECTION_CONTENT = {
  eyebrow: 'Promociones · L–V',
  title: 'Packs del',
  highlight: 'Día',
  description: 'Tres packs a precio cerrado para acertar sin pensar demasiado. Solo de lunes a viernes.',
  note: 'Elige tu momento: mañanas, mediodía o tardes.',
  ctaFooter: 'Ver carta completa'
};

export const TESTIMONIALS_SECTION = {
  title: 'Lo que se dice de nosotros en',
  highlight: 'Santa Pola',
  description: 'Reseñas reales en Google. Sin filtros. Sin inventos.'
};

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
    image: '/images/los_4_pilares/cocas_variedad.webp',
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
    badge: 'MAÑANAS · L–V · Hasta 12:00',
    image: '/images/sections/editada-04.webp',
    image_alt: 'Desayuno completo con café, zumo y tostada artesanal',
    image_title: 'Pack desayuno completo Amalis',
    title: 'Desayuno completo',
    price: 3.5,
    description: 'Tu clásico bien hecho: café + zumo + tostada. Arrancas el día como toca.',
    items: ['Café', 'Zumo de naranja', 'Tostada'],
    availability_text: 'Hasta 12:00',
    cta_url: '/carta',
    cta_label: 'Ver desayuno',
  },
  {
    id: 'promo-lunch',
    badge: 'MEDIODÍA · L–V',
    image: '/images/products/pizza-york.webp',
    image_alt: 'Almuerzo con bocadillo artesanal y bebida fría',
    image_title: 'Pack almuerzo Amalis',
    title: 'Almuerzo',
    price: 5,
    description: 'Pausa rápida y rica: bocadillo en pan recién horneado + bebida fría.',
    items: ['Bocadillo', 'Cerveza o refresco'],
    availability_text: 'Lun - Vie',
    cta_url: '/carta',
    cta_label: 'Ver almuerzo',
  },
  {
    id: 'promo-snack',
    badge: 'TARDES · L–V',
    image: '/images/products/Bizcocho.webp',
    image_alt: 'Merienda dulce con granizado natural y fartons',
    image_title: 'Pack merienda dulce Amalis',
    title: 'Merienda dulce',
    price: 4,
    description: 'Dulce + fresquito: granizado de limón y compañía para la tarde.',
    items: ['Granizado de limón', '3 fartones tiernos'],
    availability_text: 'Tardes',
    cta_url: '/carta',
    cta_label: 'Ver merienda',
  },
];


export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pan del día',
    description: 'Corteza dorada, miga tierna y pan recién horneado para llevar o acompañar el café. En vitrina, todos los días: barra tradicional, barras caseras, pan de agua, cereales, integral y bambis.',
    price: 'Consultar',
    category: 'Bread',
    imageUrl: '/images/sections/editada-09.webp',
    imageAlt: 'Hogaza de pan de masa madre artesanal con corteza rústica dorada',
    badge: 'PAN',
    ctaLabel: 'Ver panes'
  },
  {
    id: '2',
    name: 'Cocas de Santa Pola',
    description: 'El “sí o sí” de la casa: mollitas con sardina, jamón york y queso, verduras y coca rellena de atún y pisto. Salado de vitrina… y muy de aquí.',
    price: 'Consultar',
    category: 'Pastry',
    imageUrl: '/images/los_4_pilares/cocas_varieda.webp',
    imageAlt: 'Coca artesana tradicional con verduras frescas y sardinas',
    badge: 'BOLLERÍA SALADA',
    ctaLabel: 'Ver cocas'
  },
  {
    id: '3',
    name: 'Dulces para el café',
    description: 'Piezas dulces y bizcochos para desayunar o merendar. Los más pedidos: naranja, piña, canela, zanahoria, pistacho, chocolate con almendra, pepitas de chocolate y bizcocho de donuts.',
    price: 'Consultar',
    category: 'Pastry',
    imageUrl: '/images/editada-1458-2.webp',
    imageAlt: 'Rollos tradicionales de anís y naranja recién hechos',
    badge: 'BOLLERÍA DULCE',
    ctaLabel: 'Ver bollería dulce'
  },
  {
    id: '4',
    name: 'Pasteles y tartas',
    description: 'Porciones para hoy y tartas por encargo. En vitrina suelen volar: pastel de almendra, borrachos, tetas y medias lunas. El final perfecto… o el motivo principal.',
    price: 'Consultar',
    category: 'Cake',
    imageUrl: '/images/products/Bizcocho.webp',
    imageAlt: 'Bizcocho casero esponjoso de naranja y chocolate',
    badge: 'PASTELERÍA',
    ctaLabel: 'Ver pastelería'
  },
];

export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  Bread: 'Pan',
  Coffee: 'Café',
  Pastry: 'Bollería',
  Cake: 'Tartas'

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
    title: 'Tradición',
    desc: 'Respetamos el oficio de siempre: harina, manos y tiempo. Aquí el pan sale temprano y se nota desde la primera mordida.',
    img: '/images/filosofia/filosofia_tradicion.png',
    imgAlt: 'Panadero artesano trabajando la masa tradicional',
  },
  {
    title: 'Sin atajos',
    desc: 'Lo bueno no se corre: horneado en su punto, tiempos bien medidos y el mimo de hacerlo cada día, sin prisa',
    img: '/images/filosofia/filosofia_horno_panadero.png',
    imgAlt: 'Proceso manual de amasado sin maquinaria industrial',
  },
  {
    title: 'Manos vecinas',
    desc: 'Somos de aquí y trabajamos para los de aquí. Lo preparamos cada mañana y lo servimos cada día para que Santa Pola empiece el día con buen pan.',
    img: '/images/filosofia/filosofia_cafe_barista.png',
    imgAlt: 'Manos artesanas preparando cafe y reposteria',
  },
  {
    title: 'Placer honesto',
    desc: 'Sin postureo: recetas cuidadas, equilibrio y ese dulce “uno más y ya” que te llevas de paseo (o te comes antes).',
    img: '/images/filosofia/filosofia_bodegon_honesto.png',
    imgAlt: 'Cliente disfrutando de un producto artesanal honesto',
  },
];

export const LOCATION_INFO: LocationInfo = {
  title: 'Encuéntranos en Santa Pola',
  description: 'Activa tu ubicación y te abrimos la ruta más rápida hasta nuestra puerta. Estamos en el centro, a dos calles del Castillo de Santa Pola.',
  ctaLabel: 'Descubre nuestra ubicación',
  address: [
    'Carrer Almirante Antequera, 11',
    '03130 Santa Pola, Alicante'
  ],
  reference: 'A 2 calles del Castillo de Santa Pola',
  mapUrl: 'https://www.google.com/maps?q=38.19156,-0.55558',
  hours: '7:00–21:00',
  phone: '656 91 35 39',
  contactCard: {
    title: '¿Necesitas un encargo?',
    description: 'Llámanos y te confirmamos disponibilidad al momento.',
    ctaLabel: 'Llamar ahora'
  }
};

export const COFFEE_EXPERIENCE_DATA: CoffeeExperienceData = {
  badge: 'EXPERIENCIA DE CAFÉ',
  title: 'La pausa',
  highlight: 'Perfecta.',
  description: [
    'Tu momento del día. Café con cuerpo y crema, servido a 93°C para que lo disfrutes con calma.',
    'Siéntate un minuto y acompáñalo con algo de vitrina: bizcocho, pastel o ese “uno más y ya” que siempre cae.'
  ],
  temperature: '93°C',
  image: '/images/sections/editada-15.webp',
  imageAlt: 'Arte latte en proceso'
};


export const GALLERY_SECTION = {
  eyebrow: 'Nuestra Galería',
  title: 'Sumérgete en nuestra atmósfera'
};

export const FOOTER_CONTENT = {
  slogan: 'No dejes que te lo cuenten. Ven a probar la diferencia de lo recién hecho.',
  copyright: 'Amalis Cafetería. Todos los derechos reservados.',
  links: {
    explora: {
      title: 'Explora',
      items: [
        { name: 'Carta', href: '/carta' },
        { name: 'Sobre Nosotros', href: '/#about' },
        { name: 'Galería', href: '/#gallery' },
        { name: 'Ubicación', href: '/#location' }
      ]
    },
    contacto: {
      title: 'Contacto',
      items: [
        { name: 'Visítanos en Santa Pola', href: '/#location' },
        { name: 'Contacto', href: '/#location' }
      ]
    },
    horario: {
      title: 'Horario',
      dia: 'Lunes - Domingo',
      hora: '07:00 - 21:00'
    }
  }
};

export const NAV_LINKS = [
  { name: 'Inicio', href: '/#home' },
  { name: 'Carta', href: '/carta' },
  { name: 'Nosotros', href: '/#about' },
  { name: 'Galería', href: '/#gallery' },
  { name: 'Contacto', href: '/#location' },
];
