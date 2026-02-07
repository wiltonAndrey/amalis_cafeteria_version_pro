import { useEffect, useMemo, useState } from 'react';
import { MENU_CATEGORIES, MENU_PRODUCTS, PRODUCTS, CMS_DEFAULT_SETTINGS } from '../constants';

type CmsSettings = typeof CMS_DEFAULT_SETTINGS;

export const useCMS = () => {
  const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
  const [menuCategories, setMenuCategories] = useState(MENU_CATEGORIES);
  const [menuProducts, setMenuProducts] = useState(MENU_PRODUCTS);
  const [featuredProducts, setFeaturedProducts] = useState(PRODUCTS);
  const [settings, setSettings] = useState<CmsSettings>(CMS_DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isTestEnv) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      if (typeof fetch !== 'function') {
        setLoading(false);
        return;
      }

      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch('/api/get_products.php'),
          fetch('/api/get_settings.php')
        ]);

        if (!productsRes.ok || !settingsRes.ok) {
          throw new Error('CMS fetch failed');
        }

        const productsJson = await productsRes.json();
        const settingsJson = await settingsRes.json();

        if (cancelled) return;

        if (Array.isArray(productsJson.menuCategories)) {
          setMenuCategories(productsJson.menuCategories);
        }
        if (Array.isArray(productsJson.menuProducts)) {
          setMenuProducts(productsJson.menuProducts);
        }
        if (Array.isArray(productsJson.featuredProducts)) {
          setFeaturedProducts(productsJson.featuredProducts);
        }
        if (settingsJson) {
          setSettings({
            seo: settingsJson.seo ?? CMS_DEFAULT_SETTINGS.seo,
            hero: settingsJson.hero ?? CMS_DEFAULT_SETTINGS.hero,
            contact: settingsJson.contact ?? CMS_DEFAULT_SETTINGS.contact,
            social: settingsJson.social ?? CMS_DEFAULT_SETTINGS.social,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError('cms_unavailable');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isTestEnv]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (settings?.seo?.title) {
      document.title = settings.seo.title;
    }
    const description = settings?.seo?.description;
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) {
        tag.setAttribute('content', description);
      }
    }
  }, [settings]);

  return useMemo(() => ({
    menuCategories,
    menuProducts,
    featuredProducts,
    settings,
    loading,
    error
  }), [menuCategories, menuProducts, featuredProducts, settings, loading, error]);
};
