import { useState, useEffect, useCallback } from 'react';
import {
  HeroData,
  Feature,
  PhilosophyData,
  Testimonial,
  GlobalSettings,
  MenuCategoryItem,
  MenuProduct,
  Product,
} from '../types';

// Default Fallback Data (prevent white screen if API fails)
const DEFAULT_HERO: HeroData = {
  title: '',
  subtitle: '',
  quote: '',
  backgroundImage: '',
};

const DEFAULT_SETTINGS: GlobalSettings = {
  siteName: '',
  logoUrl: '',
  footerText: '',
  address: '',
  phone: '',
  email: '',
  socialLinks: {},
  openingHours: '',
};

export const useHero = () => {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch('/api/hero.php')
      .then(res => res.json())
      .then(apiData => {
        if (apiData) setData(apiData);
      })
      .catch(err => console.error("Failed to load Hero data", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateHero = async (newData: HeroData) => {
    try {
      const res = await fetch('/api/hero.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error('Failed to update hero');
      setData(newData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, loading, updateHero, refresh };
};

export const useFeatures = () => {
  const [data, setData] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch('/api/features.php')
      .then(res => res.json())
      .then(apiData => {
        if (Array.isArray(apiData)) setData(apiData);
      })
      .catch(err => console.error("Failed to load Features", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateFeatures = async (newData: Feature[]) => {
    try {
      const res = await fetch('/api/features.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error('Failed to update features');
      setData(newData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, loading, updateFeatures, refresh };
};

export const usePhilosophy = () => {
  const [data, setData] = useState<PhilosophyData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch('/api/philosophy.php')
      .then(res => res.json())
      .then(apiData => {
        if (apiData) setData(apiData);
      })
      .catch(err => console.error("Failed to load Philosophy", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updatePhilosophy = async (newData: PhilosophyData) => {
    try {
      const res = await fetch('/api/philosophy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error('Failed to update philosophy');
      setData(newData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, loading, updatePhilosophy, refresh };
};

export const useTestimonials = () => {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch('/api/testimonials.php')
      .then(res => res.json())
      .then(apiData => {
        if (Array.isArray(apiData)) setData(apiData);
      })
      .catch(err => console.error("Failed to load Testimonials", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateTestimonials = async (newData: Testimonial[]) => {
    try {
      const res = await fetch('/api/testimonials.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error('Failed to update testimonials');
      setData(newData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, loading, updateTestimonials, refresh };
};

export const useSettings = () => {
  const [data, setData] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch('/api/settings.php')
      .then(res => res.json())
      .then(apiData => {
        if (apiData) setData(apiData);
      })
      .catch(err => console.error("Failed to load Settings", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = async (newData: GlobalSettings) => {
    try {
      const res = await fetch('/api/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error('Failed to update settings');
      setData(newData);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, loading, updateSettings, refresh };
};

export const useCMS = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategoryItem[]>([]);
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (typeof fetch !== 'function') {
      setLoading(false);
      setError('fetch_unavailable');
      return;
    }

    setLoading(true);
    setError(null);

    fetch('/api/get_products.php')
      .then(res => {
        if (!res.ok) {
          throw new Error('fetch_failed');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data?.menuCategories)) setMenuCategories(data.menuCategories);
        if (Array.isArray(data?.menuProducts)) setMenuProducts(data.menuProducts);
        if (Array.isArray(data?.featuredProducts)) setFeaturedProducts(data.featuredProducts);
      })
      .catch(err => {
        console.error('Failed to load CMS data', err);
        setError('fetch_failed');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    menuCategories,
    menuProducts,
    featuredProducts,
    loading,
    error,
    refresh,
  };
};
