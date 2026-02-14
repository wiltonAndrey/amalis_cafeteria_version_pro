
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
  eyebrow: 'Hecho cada día',
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
  description: 'Cuatro packs exclusivos diseñados para acompañar cada momento de tu jornada. Calidad y frescura a un precio cerrado.',
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
    description: 'Deliciosa masa clásica cubierta con pimiento, tomate y cebolla asada.',
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
    description: 'Hojaldre de calidad con auténtica mantequilla, crujiente por fuera y tierno por dentro.',
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
    description: 'Pan de la casa tostado con tomate natural rallado y aceite de oliva virgen extra.',
    image: '/images/products/Tostada-Tomate.webp',
    ingredients: ['Pan de la casa', 'Tomate', 'Aceite de oliva', 'Sal'],
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
    badge: 'TODOS LOS DÍAS',
    image: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    image_alt: 'Desayuno completo con café, zumo de naranja natural y tostada recién hecha',
    image_title: 'Desayuno Completo Amalis',
    title: 'Desayuno Completo',
    price: 3.5,
    description: 'Un despertar con el mejor sabor. Café de especialidad, zumo de naranja recién exprimido y nuestra clásica tostada de pan del día.',
    items: ['Café de especialidad', 'Zumo de naranja natural', 'Tostada o Bollería'],
    availability_text: 'Válido todos los días',
    cta_url: '/carta',
    cta_label: 'Ver desayuno',
  },
  {
    id: 'promo-lunch',
    badge: 'L-V · TODO EL DÍA',
    image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    image_alt: 'Bocadillo de la casa con tomate, atún y aceituna junto a una cerveza fría',
    image_title: 'Pack Almuerzo Amalis',
    title: 'Bocadillo + Cerveza',
    price: 5,
    description: 'El almuerzo perfecto para tu pausa. Bocadillo crujiente con tomate natural, atún y aceitunas, acompañado de una cerveza bien fría.',
    items: ['Bocadillo (Atún, Tomate, Aceituna)', 'Bote de cerveza'],
    availability_text: 'Lunes a viernes todo el día',
    cta_url: '/carta',
    cta_label: 'Ver almuerzo',
  },
  {
    id: 'promo-coffee-time',
    badge: 'L-V · HORA DEL CAFÉ',
    image: 'https://images.pexels.com/photos/3671151/pexels-photo-3671151.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    image_alt: 'Café con leche cremoso y un dulce de vitrina',
    image_title: 'La Hora del Café Amalis',
    title: 'La Hora del Café',
    price: 3.5,
    description: 'Disfruta de un momento de calma. La suavidad de un café con leche cremoso junto a uno de nuestros dulces seleccionados de vitrina.',
    items: ['Cremoso café con leche', 'Dulce de vitrina'],
    availability_text: 'De lunes a viernes',
    cta_url: '/carta',
    cta_label: 'Ver pausa',
  },
  {
    id: 'promo-snack',
    badge: 'L-V · MERIENDA',
    image: 'https://images.pexels.com/photos/5946635/pexels-photo-5946635.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    image_alt: 'Granizado de limón refrescante con tres fartons',
    image_title: 'Pack Merienda Amalis',
    title: 'Granizado + Fartons',
    price: 4,
    description: 'La merienda más fresca de Santa Pola. Granizado de limón natural y tres fartons tiernos servidos al momento.',
    items: ['Granizado de limón', '3 Fartons tiernos'],
    availability_text: 'De lunes a viernes',
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
    imageUrl: '/images/los-4-pilares/pan-artesano-santa-pola.webp',
    imageAlt: 'Variedad de pan recién horneado en los estantes de Amalis Cafetería en Santa Pola',
    badge: 'PAN',
    ctaLabel: 'Ver panes'
  },
  {
    id: '2',
    name: 'Cocas de Santa Pola',
    description: 'El “sí o sí” de la casa: mollitas con sardina, jamón york y queso, verduras y coca rellena de atún y pisto. Salado de vitrina… y muy de aquí.',
    price: 'Consultar',
    category: 'Pastry',
    imageUrl: '/images/los-4-pilares/cocas-saladas-santapoleras.webp',
    imageAlt: 'Surtido de cocas tradicionales de Santa Pola, incluyendo coca de verduras y mollitas',
    badge: 'BOLLERÍA SALADA',
    ctaLabel: 'Ver cocas'
  },
  {
    id: '3',
    name: 'Dulces para el café',
    description: 'Piezas dulces y bizcochos para desayunar o merendar. Los más pedidos: naranja, piña, canela, zanahoria, pistacho, chocolate con almendra, pepitas de chocolate y bizcocho de donuts.',
    price: 'Consultar',
    category: 'Pastry',
    imageUrl: '/images/los-4-pilares/bolleria-dulce-artesana.webp',
    imageAlt: 'Selección de bollería dulce: croissants, donuts y pasteles recién hechos',
    badge: 'BOLLERÍA DULCE',
    ctaLabel: 'Ver bollería dulce'
  },
  {
    id: '4',
    name: 'Pasteles y tartas',
    description: 'Porciones para hoy y tartas por encargo. En vitrina suelen volar: pastel de almendra, borrachos, tetas y medias lunas. El final perfecto… o el motivo principal.',
    price: 'Consultar',
    category: 'Cake',
    imageUrl: '/images/los-4-pilares/pasteleria-fina-y-tartas.webp',
    imageAlt: 'Exposición de pastelería fina, tartas individuales y café cappuccino',
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
    avatarUrl: '/images/testimonials/testimonio-maria-gomez.webp',
    avatarAlt: 'María Gómez, cliente habitual disfrutando en Amalis Cafetería',
    avatarTitle: 'Testimonio de María Gómez - Amalis Cafetería'
  },
  {
    id: '2',
    name: 'Jorge Rocamora',
    role: 'Primera Visita',
    content: 'Cafetería Amalis superó todas mis expectativas. Buscaba un desayuno sencillo pero delicioso, y encontré un ambiente acogedor y un servicio tan amable que sin duda repetiré.',
    avatarUrl: '/images/testimonials/testimonio-jorge-rocamora.webp',
    avatarAlt: 'Jorge Rocamora en su primera visita a Amalis Cafetería Santa Pola',
    avatarTitle: 'Opinión de Jorge Rocamora sobre Amalis'
  },
  {
    id: '3',
    name: 'Laura Jiménez',
    role: 'Local Guide',
    content: 'Cada mañana es un auténtico placer; su variada oferta de pastelería dulce y salada, junto a un café de calidad, hacen de este rincón el lugar perfecto.',
    avatarUrl: '/images/testimonials/testimonio-laura-jimenez.webp',
    avatarAlt: 'Laura Jiménez, Local Guide de Santa Pola, recomendando Amalis Cafetería',
    avatarTitle: 'Reseña de Laura Jiménez - Pastelería Amalis',
  },
  {
    id: '4',
    name: 'BJ N',
    role: 'Cliente',
    content: 'Tiene un ambiente limpio y espacioso, un personal muy amable y una excelente selección de pastelería. Ideal tanto para disfrutar en el local o para llevar.',
    avatarUrl: '/images/testimonials/testimonio-bj-n.webp',
    avatarAlt: 'Cliente BJ N destacando el ambiente y la pastelería de Amalis',
    avatarTitle: 'Comentario de BJ N sobre el servicio en Amalis'
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    url: '/images/gallery/mini-croissant-chocolate-azucar-glass.webp',
    alt: 'Mini croissants rellenos de chocolate y espolvoreados con azúcar',
    title: 'Mini Croissants de Chocolate',
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 'g2',
    url: '/images/gallery/bizcocho-doble-chocolate-artesano.webp',
    alt: 'Bizcocho de chocolate con pepitas de chocolate y chocolate blanco',
    title: 'Bizcocho Doble Chocolate',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g3',
    url: '/images/gallery/empanadilla-pisto-artesana-santa-pola.webp',
    alt: 'Empanadillas rellenas de pisto casero',
    title: 'Empanadilla de Pisto Casero',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g4',
    url: '/images/gallery/bizcocho-naranja-confitada-santa-pola.webp',
    alt: 'Bizcocho de naranja con azúcar perlado y naranja confitada',
    title: 'Bizcocho de Naranja Confitada',
    span: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 'g5',
    url: '/images/gallery/media-luna-crema-santa-pola.webp',
    alt: 'Media luna rellena de crema pastelera',
    title: 'Media Luna de Crema',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g6',
    url: '/images/gallery/ensaimada-tradicional-santa-pola.webp',
    alt: 'Ensaimada tradicional espolvoreada con azúcar glass',
    title: 'Ensaimada Tradicional',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g7',
    url: '/images/gallery/napolitana-chocolate-artesana.webp',
    alt: 'Napolitana de chocolate artesana recién horneada',
    title: 'Napolitana de Chocolate',
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g8',
    url: '/images/gallery/tetas-de-monja-crema-santa-pola.webp',
    alt: 'Pastel tradicional Tetas de Monja relleno de crema',
    title: 'Tetas de Monja',
    span: 'md:col-span-1 md:row-span-1'
  },
];

export const WHY_CHOOSE_US_FEATURES: FeatureCard[] = [
  {
    title: 'Tradición',
    desc: 'Respetamos el oficio de siempre: harina, manos y tiempo. Aquí el pan sale temprano y se nota desde la primera mordida.',
    img: '/images/nuestra_historia/panaderia-artesana-santa-pola-amasando.webp',
    imgAlt: 'Panadero preparando pan tradicional en Santa Pola',
  },
  {
    title: 'Sin atajos',
    desc: 'horneado en su punto, tiempos bien medidos y el mimo de hacerlo cada día, sin prisa.',
    img: '/images/nuestra_historia/pan-recien-horneado-santa-pola.webp',
    imgAlt: 'Barras de pan recién horneadas con corteza crujiente en Santa Pola',
  },
  {
    title: 'Manos vecinas',
    desc: 'Somos de aquí y trabajamos para los de aquí. Lo preparamos cada mañana y lo servimos cada día para que Santa Pola empiece el día con buen pan.',
    img: '/images/nuestra_historia/cafeteria-especialidad-santa-pola-barista.webp',
    imgAlt: 'Barista preparando café de especialidad en cafetería Amalis de Santa Pola',
  },
  {
    title: 'Placer honesto',
    desc: 'Sin postureo: recetas cuidadas, equilibrio y ese dulce “uno más y ya” que te llevas de paseo (o te comes antes).',
    img: '/images/nuestra_historia/pasteleria-artesanal-tarta-cafe-santa-pola.webp',
    imgAlt: 'Merienda de pastelería con tarta casera y café en Santa Pola',
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
  image: '/images/sections/latte-art-cafe-especialidad.webp',
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
