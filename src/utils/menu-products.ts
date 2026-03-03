import { MENU_CATEGORIES } from '../constants';
import type { MenuCategoryItem, MenuProduct, PublicMenuCategory } from '../types';
import { normalizeMenuCategory } from './menu-categories';

export interface MenuProductGroup {
  category: PublicMenuCategory;
  label: string;
  products: MenuProduct[];
}

type GroupCategoryItem = MenuCategoryItem & { id: PublicMenuCategory };
type SortableMenuProduct = { product: MenuProduct; originalIndex: number };

const isGroupCategoryItem = (category: MenuCategoryItem): category is GroupCategoryItem => category.id !== 'all';

const ALL_VIEW_CATEGORIES = MENU_CATEGORIES.filter(isGroupCategoryItem);
const CATEGORY_ORDER = new Map(ALL_VIEW_CATEGORIES.map((category, index) => [category.id, index]));
const DEFAULT_SORT_ORDER = Number.MAX_SAFE_INTEGER;

const getCategoryRank = (product: MenuProduct): number => {
  const normalizedCategory = normalizeMenuCategory(product.category);

  if (!normalizedCategory || normalizedCategory === 'all') {
    return ALL_VIEW_CATEGORIES.length;
  }

  return CATEGORY_ORDER.get(normalizedCategory) ?? ALL_VIEW_CATEGORIES.length;
};

const getProductSortOrder = (product: MenuProduct): number => {
  return typeof product.sort_order === 'number' ? product.sort_order : DEFAULT_SORT_ORDER;
};

const compareProductName = (left: MenuProduct, right: MenuProduct): number => {
  const nameDiff = left.name.localeCompare(right.name, 'es', { sensitivity: 'base' });

  if (nameDiff !== 0) {
    return nameDiff;
  }

  return left.id.localeCompare(right.id);
};

const compareProductsWithinCategory = (left: SortableMenuProduct, right: SortableMenuProduct): number => {
  const sortDiff = getProductSortOrder(left.product) - getProductSortOrder(right.product);
  if (sortDiff !== 0) {
    return sortDiff;
  }

  const nameDiff = compareProductName(left.product, right.product);
  if (nameDiff !== 0) {
    return nameDiff;
  }

  return left.originalIndex - right.originalIndex;
};

const toSortableMenuProducts = (products: MenuProduct[]): SortableMenuProduct[] => {
  return products.map((product, originalIndex) => ({ product, originalIndex }));
};

export const sortMenuProductsWithinCategory = (products: MenuProduct[]): MenuProduct[] => {
  return toSortableMenuProducts(products)
    .sort(compareProductsWithinCategory)
    .map(({ product }) => product);
};

export const sortMenuProductsForAllView = (products: MenuProduct[]): MenuProduct[] => {
  return toSortableMenuProducts(products)
    .sort((left, right) => {
      const categoryDiff = getCategoryRank(left.product) - getCategoryRank(right.product);
      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      return compareProductsWithinCategory(left, right);
    })
    .map(({ product }) => product);
};

export const groupMenuProductsForAllView = (products: MenuProduct[]): MenuProductGroup[] => {
  const buckets = new Map<PublicMenuCategory, MenuProduct[]>(
    ALL_VIEW_CATEGORIES.map((category) => [category.id, []])
  );

  for (const product of sortMenuProductsForAllView(products)) {
    const normalizedCategory = normalizeMenuCategory(product.category);

    if (!normalizedCategory || normalizedCategory === 'all') {
      continue;
    }

    buckets.get(normalizedCategory)?.push(product);
  }

  return ALL_VIEW_CATEGORIES.flatMap((category) => {
    const productsForCategory = buckets.get(category.id) ?? [];

    if (productsForCategory.length === 0) {
      return [];
    }

    return [
      {
        category: category.id,
        label: category.label,
        products: productsForCategory,
      },
    ];
  });
};
