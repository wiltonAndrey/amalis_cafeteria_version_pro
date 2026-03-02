import { useEffect, useMemo, useState } from 'react';
import { MENU_CRITICAL_PRODUCTS } from '../constants/menu-critical';
import { MENU_SHELL_CATEGORIES } from '../constants/menu-shell';
import type { MenuCategoryItem, MenuProduct } from '../types';
import { normalizeMenuCategories, normalizeMenuProductTaxonomy } from '../utils/menu-taxonomy';

const parseJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useMenuProducts = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategoryItem[]>(MENU_SHELL_CATEGORIES);
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>(
    MENU_CRITICAL_PRODUCTS.map((product) => normalizeMenuProductTaxonomy(product as MenuProduct) as MenuProduct)
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let frameId: number | null = null;

    const load = async () => {
      if (typeof fetch !== 'function') {
        setMenuProducts(
          MENU_CRITICAL_PRODUCTS.map((product) => normalizeMenuProductTaxonomy(product as MenuProduct) as MenuProduct)
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/get_products.php');
        const data = await parseJson(response);

        if (!response.ok) {
          throw new Error('fetch_failed');
        }

        if (!Array.isArray(data?.menuProducts)) {
          throw new Error('invalid_payload');
        }

        if (cancelled) {
          return;
        }

        if (Array.isArray(data?.menuCategories)) {
          setMenuCategories(normalizeMenuCategories(data.menuCategories as MenuCategoryItem[]) as MenuCategoryItem[]);
        }

        setMenuProducts(
          (data.menuProducts as MenuProduct[]).map(
            (product) => normalizeMenuProductTaxonomy(product as MenuProduct) as MenuProduct
          )
        );
      } catch {
        if (!cancelled) {
          const { MENU_PRODUCTS: fallbackProducts } = await import('../constants/menu-fallback');
          if (Array.isArray(fallbackProducts) && fallbackProducts.length > 0) {
            setMenuProducts(
              (fallbackProducts as MenuProduct[]).map(
                (product) => normalizeMenuProductTaxonomy(product as MenuProduct) as MenuProduct
              )
            );
          }
          setError('cms_unavailable');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      frameId = window.requestAnimationFrame(() => {
        void load();
      });
    } else {
      void load();
    }

    return () => {
      cancelled = true;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
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
