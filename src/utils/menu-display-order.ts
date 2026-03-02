import type { MenuCategoryItem, MenuProduct } from '../types';

const FALLBACK_ORDER = Number.MAX_SAFE_INTEGER;

export const orderMenuProductsForDisplay = (
  products: MenuProduct[],
  categories: MenuCategoryItem[],
): MenuProduct[] => {
  const categoryOrder = new Map<string, number>();

  categories.forEach((category, index) => {
    if (category.id === 'all') {
      return;
    }

    categoryOrder.set(category.id, index);
  });

  return products
    .map((product, index) => ({
      product,
      index,
      order: categoryOrder.get(product.category) ?? FALLBACK_ORDER,
    }))
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.index - right.index;
    })
    .map((entry) => entry.product);
};
