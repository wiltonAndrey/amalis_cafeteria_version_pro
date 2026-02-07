
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
  ingredients: string[];
  allergens: string[];
  featured?: boolean;
}

export interface MenuCategoryItem {
  id: MenuCategory;
  label: string;
}
