
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'Bread' | 'Pastry' | 'Cake' | 'Coffee';
  imageUrl: string;
  imageAlt?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
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

// CMS Types
export interface HeroData {
  title: string;
  subtitle: string;
  quote?: string;
  backgroundImage: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export interface PhilosophyData {
  title: string;
  content: string;
  image: string;
}

export interface GlobalSettings {
  siteName: string;
  logoUrl: string;
  footerText: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  openingHours: string;
}
