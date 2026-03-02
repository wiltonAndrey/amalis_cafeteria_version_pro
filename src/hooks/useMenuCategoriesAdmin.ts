import { useCallback, useEffect, useMemo, useState } from 'react';
import { MENU_CATEGORIES } from '../constants/menu-categories';
import type { MenuCategoryAdminItem } from '../types';

export interface MenuCategoryCreateInput {
  label: string;
  slug?: string;
  sort_order?: number;
  active?: boolean;
  visible_in_menu?: boolean;
}

export interface MenuCategoryUpdateInput extends MenuCategoryCreateInput {
  id: string;
}

export interface MenuCategoryReorderItem {
  id: string;
  sort_order: number;
}

export interface UseMenuCategoriesAdminResult {
  categories: MenuCategoryAdminItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createCategory: (input: MenuCategoryCreateInput) => Promise<MenuCategoryAdminItem>;
  updateCategory: (input: MenuCategoryUpdateInput) => Promise<MenuCategoryAdminItem>;
  reorderCategories: (items: MenuCategoryReorderItem[]) => Promise<MenuCategoryAdminItem[]>;
}

const sortCategories = (items: MenuCategoryAdminItem[]): MenuCategoryAdminItem[] =>
  items
    .slice()
    .sort((a, b) => {
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;
      const aOrder = typeof a.sort_order === 'number' ? a.sort_order : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.sort_order === 'number' ? b.sort_order : Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return String(a.id).localeCompare(String(b.id));
    });

const toFallbackAdminCategories = (): MenuCategoryAdminItem[] =>
  sortCategories(
    MENU_CATEGORIES.map((category) => ({
      ...category,
      slug: String(category.id),
      active: category.active ?? true,
      visible_in_menu: category.visible_in_menu ?? true,
      is_system: category.id === 'all',
      product_count_total: null,
      product_count_active: null,
    })),
  );

const normalizeCategory = (raw: any): MenuCategoryAdminItem => {
  const id = String(raw?.id ?? raw?.slug ?? '').trim();
  return {
    id,
    slug: String(raw?.slug ?? id),
    label: String(raw?.label ?? ''),
    sort_order: Number.isFinite(Number(raw?.sort_order)) ? Number(raw.sort_order) : undefined,
    active: raw?.active !== false,
    visible_in_menu: raw?.visible_in_menu !== false,
    is_system: Boolean(raw?.is_system ?? id === 'all'),
    product_count_total: raw?.product_count_total == null ? null : Number(raw.product_count_total),
    product_count_active: raw?.product_count_active == null ? null : Number(raw.product_count_active),
  };
};

const parseJson = async (response: Response): Promise<any> => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export const useMenuCategoriesAdmin = (): UseMenuCategoriesAdminResult => {
  const [categories, setCategories] = useState<MenuCategoryAdminItem[]>(() => toFallbackAdminCategories());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories/list.php', {
        credentials: 'same-origin',
      });
      const payload = await parseJson(response);
      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? 'list_failed');
      }

      const next = Array.isArray(payload?.categories)
        ? sortCategories((payload.categories as any[]).map(normalizeCategory))
        : [];

      if (next.length > 0) {
        setCategories(next);
      }
      setError(null);
    } catch (_error) {
      setError('No se pudieron cargar las categorías.');
      setCategories(toFallbackAdminCategories());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createCategory = useCallback(async (input: MenuCategoryCreateInput) => {
    setSaving(true);
    try {
      const response = await fetch('/api/categories/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(input),
      });
      const payload = await parseJson(response);
      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? 'create_failed');
      }

      const created = normalizeCategory(payload?.category ?? input);
      setCategories((prev) => sortCategories([...prev.filter((item) => item.id !== created.id), created]));
      setError(null);
      return created;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateCategory = useCallback(async (input: MenuCategoryUpdateInput) => {
    setSaving(true);
    try {
      const response = await fetch('/api/categories/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(input),
      });
      const payload = await parseJson(response);
      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? 'update_failed');
      }

      const updated = normalizeCategory(payload?.category ?? { ...input, slug: input.slug ?? input.id });
      setCategories((prev) => {
        const withoutOld = prev.filter((item) => item.id !== input.id && item.id !== updated.id);
        return sortCategories([...withoutOld, updated]);
      });
      setError(null);
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  const reorderCategories = useCallback(async (items: MenuCategoryReorderItem[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/categories/reorder.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ items }),
      });
      const payload = await parseJson(response);
      if (!response.ok || payload?.ok === false) {
        throw new Error(payload?.error ?? 'reorder_failed');
      }

      const next = Array.isArray(payload?.categories)
        ? sortCategories((payload.categories as any[]).map(normalizeCategory))
        : categories;
      setCategories(next);
      setError(null);
      return next;
    } finally {
      setSaving(false);
    }
  }, [categories]);

  return useMemo(() => ({
    categories,
    loading,
    saving,
    error,
    refresh,
    createCategory,
    updateCategory,
    reorderCategories,
  }), [categories, loading, saving, error, refresh, createCategory, updateCategory, reorderCategories]);
};

export default useMenuCategoriesAdmin;
