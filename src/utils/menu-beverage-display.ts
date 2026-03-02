import type { MenuProduct } from '../types';
import { getBeverageSubcategoryLabel } from './menu-taxonomy';

const KNOWN_BEVERAGE_DISPLAY_GROUPS = ['cafes', 'infusiones', 'cacao', 'zumos'] as const;
export const BEVERAGE_DISPLAY_GROUP_ORDER = [...KNOWN_BEVERAGE_DISPLAY_GROUPS, 'resto'] as const;

type KnownBeverageDisplayGroupId = (typeof KNOWN_BEVERAGE_DISPLAY_GROUPS)[number];
export type BeverageDisplayGroupId = (typeof BEVERAGE_DISPLAY_GROUP_ORDER)[number];
export type BeverageDisplayFilterId = 'all' | BeverageDisplayGroupId;

const KNOWN_BEVERAGE_DISPLAY_GROUP_SET = new Set<string>(KNOWN_BEVERAGE_DISPLAY_GROUPS);

export interface BeverageDisplayFilterOption {
  id: BeverageDisplayGroupId;
  label: string;
}

export const getBeverageDisplayGroupId = (subcategory?: string | null): BeverageDisplayGroupId => {
  const normalizedSubcategory = typeof subcategory === 'string' ? subcategory.trim() : '';
  if (normalizedSubcategory && KNOWN_BEVERAGE_DISPLAY_GROUP_SET.has(normalizedSubcategory)) {
    return normalizedSubcategory as KnownBeverageDisplayGroupId;
  }

  return 'resto';
};

export const getBeverageDisplayFilterLabel = (id: BeverageDisplayGroupId): string => {
  if (id === 'resto') return 'Resto de bebidas';
  return getBeverageSubcategoryLabel(id);
};

export const buildBeverageDisplayFilterOptions = (products: MenuProduct[]): BeverageDisplayFilterOption[] => {
  const presentGroups = new Set<BeverageDisplayGroupId>();

  products.forEach((product) => {
    if (product.category !== 'bebidas') return;
    presentGroups.add(getBeverageDisplayGroupId(product.subcategory));
  });

  return BEVERAGE_DISPLAY_GROUP_ORDER
    .filter((id) => presentGroups.has(id))
    .map((id) => ({ id, label: getBeverageDisplayFilterLabel(id) }));
};

export const matchesBeverageDisplayFilter = (
  product: Pick<MenuProduct, 'subcategory'>,
  filterId: BeverageDisplayFilterId,
): boolean => {
  if (filterId === 'all') return true;
  return getBeverageDisplayGroupId(product.subcategory) === filterId;
};

export const orderBeverageProductsForDisplay = (products: MenuProduct[]): MenuProduct[] => {
  if (products.length <= 1) return products;

  const groupedProducts = new Map<BeverageDisplayGroupId, MenuProduct[]>();

  products.forEach((product) => {
    const groupId = getBeverageDisplayGroupId(product.subcategory);
    const bucket = groupedProducts.get(groupId);
    if (bucket) {
      bucket.push(product);
      return;
    }

    groupedProducts.set(groupId, [product]);
  });

  const orderedProducts: MenuProduct[] = [];
  BEVERAGE_DISPLAY_GROUP_ORDER.forEach((groupId) => {
    const bucket = groupedProducts.get(groupId);
    if (bucket) {
      orderedProducts.push(...bucket);
    }
  });

  return orderedProducts;
};
