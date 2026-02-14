
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'Bread' | 'Pastry' | 'Cake' | 'Coffee';
  imageUrl: string;
  imageAlt?: string;
  badge?: string;
  ctaLabel?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
  avatarAlt?: string;
  avatarTitle?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  title?: string;
  span?: string;
}

// Menu Specific Types
export type MenuCategory = 'all' | 'cocas' | 'empanadillas' | 'bolleria' | 'bizcochos' | 'pasteles' | 'tostadas' | 'ofertas';

export interface MenuProduct {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
  image: string;
  alt_text?: string;
  image_title?: string;
  ingredients: string[];
  allergens: string[];
  featured?: boolean;
}

export interface MenuCategoryItem {
  id: MenuCategory;
  label: string;
}

export interface PromotionCard {
  id: string;
  badge: string;
  image: string;
  image_alt: string;
  image_title: string;
  title: string;
  price: number;
  description: string;
  items: string[];
  availability_text: string;
  cta_url: string;
  cta_label: string;
}

export interface FeatureCard {
  title: string;
  desc: string;
  img: string;
  imgAlt: string;
}

export interface LocationInfo {
  title: string;
  description: string;
  ctaLabel: string;
  address: string[];
  reference: string;
  mapUrl: string;
  hours: string;
  phone: string;
  contactCard: {
    title: string;
    description: string;
    ctaLabel: string;
  };
}

export interface CoffeeExperienceData {
  badge: string;
  title: string;
  highlight: string;
  description: string[];
  temperature: string;
  image: string;
  imageAlt: string;
}
