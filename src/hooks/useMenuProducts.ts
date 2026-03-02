import { useEffect, useMemo, useState } from 'react';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../constants';
import type { MenuCategoryItem, MenuProduct } from '../types';

const mergeById = <T extends { id: string }>(fallback: T[], incoming: T[]): T[] => {
  const fallbackIds = new Set(fallback.map((item) => item.id));
  const incomingById = new Map(incoming.map((item) => [item.id, item]));

  const merged = fallback.map((item) => {
    const next = incomingById.get(item.id);
    return next ? { ...item, ...next } : item;
  });

  for (const item of incoming) {
    if (!fallbackIds.has(item.id)) {
      merged.push(item);
    }
  }

  return merged;
};

const parseJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useMenuProducts = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategoryItem[]>(MENU_CATEGORIES);
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>(MENU_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (typeof fetch !== 'function') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/get_products.php');
        const data = await parseJson(response);

        if (!response.ok) {
          throw new Error('fetch_failed');
        }

        if (cancelled) {
          return;
        }

        if (Array.isArray(data?.menuCategories) && data.menuCategories.length > 0) {
          setMenuCategories((current) => mergeById(current, data.menuCategories as MenuCategoryItem[]));
        }

        if (Array.isArray(data?.menuProducts) && data.menuProducts.length > 0) {
          setMenuProducts((current) => mergeById(current, data.menuProducts as MenuProduct[]));
        }
      } catch {
        if (!cancelled) {
          setError('cms_unavailable');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      menuCategories,
      menuProducts,
      loading,
      error,
    }),
    [menuCategories, menuProducts, loading, error]
  );
};

