import type { AdminMenuCategory, MenuCategory, VisibleMenuCategory } from '../types';

const CATEGORY_GROUPS: Record<AdminMenuCategory, readonly MenuCategory[]> = {
  ofertas: ['ofertas'],
  tostadas: ['tostadas'],
  'bolleria-salada': ['bolleria-salada', 'bolleria_salada', 'cocas', 'empanadillas'],
  'bolleria-dulce': ['bolleria-dulce', 'bolleria_dulce', 'bolleria'],
  pasteleria: ['pasteleria', 'bizcochos', 'pasteles'],
  bebidas: ['bebidas'],
};

export const ADMIN_MENU_CATEGORY_OPTIONS: ReadonlyArray<{ id: AdminMenuCategory; label: string }> = [
  { id: 'tostadas', label: 'Tostadas' },
  { id: 'bolleria-salada', label: 'Bolleria salada' },
  { id: 'bolleria-dulce', label: 'Bolleria dulce' },
  { id: 'pasteleria', label: 'Pasteleria' },
  { id: 'ofertas', label: 'Ofertas' },
  { id: 'bebidas', label: 'Bebidas' },
];

export const normalizeMenuCategory = (
  category: MenuCategory | VisibleMenuCategory | undefined | null
): VisibleMenuCategory | null => {
  if (!category || category === 'all') {
    return category ?? null;
  }

  for (const [visibleCategory, aliases] of Object.entries(CATEGORY_GROUPS) as Array<
    [AdminMenuCategory, readonly MenuCategory[]]
  >) {
    if (visibleCategory === 'bebidas') {
      continue;
    }

    if (aliases.includes(category as MenuCategory)) {
      return visibleCategory as VisibleMenuCategory;
    }
  }

  return null;
};

export const matchesVisibleMenuCategory = (
  productCategory: MenuCategory,
  activeCategory: VisibleMenuCategory
): boolean => {
  if (activeCategory === 'all') {
    return true;
  }

  return normalizeMenuCategory(productCategory) === activeCategory;
};

export const normalizeAdminMenuCategory = (
  category: MenuCategory | undefined,
  fallback: AdminMenuCategory
): AdminMenuCategory => {
  if (category === 'bebidas') {
    return 'bebidas';
  }

  const normalized = normalizeMenuCategory(category);
  if (normalized && normalized !== 'all') {
    return normalized;
  }

  return fallback;
};
