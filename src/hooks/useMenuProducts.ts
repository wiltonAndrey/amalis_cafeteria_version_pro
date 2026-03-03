import { useEffect, useMemo, useState } from 'react';
import { MENU_CATEGORIES } from '../constants';
import type { MenuProduct } from '../types';
import { sortMenuProductsForAllView } from '../utils/menu-products';

const parseJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useMenuProducts = () => {
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>([]);
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

        if (Array.isArray(data?.menuProducts)) {
          setMenuProducts(data.menuProducts as MenuProduct[]);
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

  const normalizedMenuProducts = useMemo(
    () => sortMenuProductsForAllView(menuProducts),
    [menuProducts]
  );

  return useMemo(
    () => ({
      menuCategories: MENU_CATEGORIES,
      menuProducts: normalizedMenuProducts,
      loading,
      error,
    }),
    [normalizedMenuProducts, loading, error]
  );
};

