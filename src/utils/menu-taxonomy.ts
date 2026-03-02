import { MENU_SHELL_CATEGORIES } from '../constants/menu-shell';

export type BeverageSubcategoryId = 'cafes' | 'infusiones' | 'cacao' | (string & {});

export interface MenuProductTaxonomyShape {
  name?: string;
  category?: string;
  subcategory?: string | null;
}

const foldText = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const slugify = (value: string): string => foldText(value).replace(/\s+/g, '_');

const MENU_CATEGORY_ALIASES: Record<string, string> = {
  all: 'all',
  tostada: 'tostadas',
  tostadas: 'tostadas',
  toast: 'tostadas',
  bolleria: 'bolleria_dulce',
  bolleria_dulce: 'bolleria_dulce',
  pastry: 'bolleria_dulce',
  coca: 'bolleria_salada',
  cocas: 'bolleria_salada',
  empanadilla: 'bolleria_salada',
  empanadillas: 'bolleria_salada',
  bolleria_salada: 'bolleria_salada',
  bizcocho: 'pasteleria',
  bizcochos: 'pasteleria',
  pastel: 'pasteleria',
  pasteles: 'pasteleria',
  pasteleria: 'pasteleria',
  oferta: 'ofertas',
  ofertas: 'ofertas',
  cafe: 'bebidas',
  cafes: 'bebidas',
  coffee: 'bebidas',
  bebida: 'bebidas',
  bebidas: 'bebidas',
  drink: 'bebidas',
  drinks: 'bebidas',
};

const toTitleCase = (value: string): string =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const resolveMenuCategoryId = (value: string): string => {
  const slug = slugify(value);
  if (!slug) return '';
  return MENU_CATEGORY_ALIASES[slug] ?? slug;
};

const getMenuCategoryLabel = (id: string, fallbackLabel?: string): string => {
  const shellCategory = MENU_SHELL_CATEGORIES.find((category) => category.id === id);
  if (shellCategory) {
    return shellCategory.label;
  }

  const cleanedLabel = typeof fallbackLabel === 'string' ? fallbackLabel.trim() : '';
  if (cleanedLabel) {
    return cleanedLabel;
  }

  return toTitleCase(id.replace(/_/g, ' '));
};

export const deriveBeverageSubcategoryFromName = (name: string): BeverageSubcategoryId => {
  const key = foldText(name);
  if (key === 'infusion' || key === 'infusion especial') return 'infusiones';
  if (key === 'zumo de naranja' || key.startsWith('zumo ')) return 'zumos';
  if (key === 'cola cao') return 'cacao';
  return 'cafes';
};

export const normalizeMenuProductTaxonomy = <T extends MenuProductTaxonomyShape>(product: T): T => {
  const currentCategory = String(product.category ?? '').trim();
  const nextCategory = resolveMenuCategoryId(currentCategory) || currentCategory;

  let nextSubcategory = product.subcategory ?? null;
  if (typeof nextSubcategory === 'string') {
    nextSubcategory = slugify(nextSubcategory) || null;
  }

  if (nextCategory === 'bebidas' && !nextSubcategory) {
    nextSubcategory = deriveBeverageSubcategoryFromName(String(product.name ?? ''));
  }

  return {
    ...product,
    category: nextCategory,
    subcategory: nextSubcategory,
  };
};

export const normalizeMenuCategories = <T extends { id?: string; label?: string }>(categories: T[]): T[] => {
  const normalizedCategories = MENU_SHELL_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
  })) as T[];

  const seen = new Set<string>(MENU_SHELL_CATEGORIES.map((category) => category.id));

  categories.forEach((category) => {
    const normalizedId = resolveMenuCategoryId(String(category?.id ?? ''));
    if (!normalizedId || seen.has(normalizedId)) {
      return;
    }

    normalizedCategories.push({
      ...category,
      id: normalizedId,
      label: getMenuCategoryLabel(normalizedId, String(category?.label ?? '')),
    });
    seen.add(normalizedId);
  });

  return normalizedCategories;
};

export const BEVERAGE_SUBCATEGORY_LABELS: Record<string, string> = {
  cafes: 'CafÃ©s',
  infusiones: 'Infusiones',
  cacao: 'Cacao',
  zumos: 'Zumos',
};

export const getBeverageSubcategoryLabel = (id: string): string => {
  if (!id) return 'Sin subcategorÃ­a';
  return BEVERAGE_SUBCATEGORY_LABELS[id] ?? id.replace(/_/g, ' ');
};
