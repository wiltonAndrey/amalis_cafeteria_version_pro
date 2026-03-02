import type { MenuCategoryItem } from '../types';

export const MENU_CATEGORIES: MenuCategoryItem[] = [
  { id: 'all', label: 'Todos', sort_order: 0, active: true, visible_in_menu: true },
  { id: 'tostadas', label: 'Tostadas', sort_order: 1, active: true, visible_in_menu: true },
  { id: 'bolleria_dulce', label: 'Bollería Dulce', sort_order: 2, active: true, visible_in_menu: true },
  { id: 'bolleria_salada', label: 'Bollería Salada', sort_order: 3, active: true, visible_in_menu: true },
  { id: 'pasteleria', label: 'Pastelería', sort_order: 4, active: true, visible_in_menu: true },
  { id: 'ofertas', label: 'Ofertas', sort_order: 5, active: false, visible_in_menu: false },
  { id: 'bebidas', label: 'Bebidas', sort_order: 6, active: true, visible_in_menu: true },
];
