import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MenuCategory, MenuProduct } from '../types';

export interface ProductPayload {
  id?: string;
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
  image: string;
  alt_text?: string;
  image_title?: string;
  ingredients: string[];
  allergens: string[];
  featured: boolean;
  active?: boolean;
  sort_order?: number;
}

interface UseProductsOptions {
  autoRefresh?: boolean;
}

const DEFAULT_IMAGE = '/images/sections/editada-01.webp';

const buildProduct = (payload: ProductPayload, id: string): MenuProduct => ({
  id,
  name: payload.name,
  price: payload.price,
  category: payload.category,
  description: payload.description,
  image: payload.image || DEFAULT_IMAGE,
  alt_text: payload.alt_text,
  image_title: payload.image_title,
  ingredients: payload.ingredients ?? [],
  allergens: payload.allergens ?? [],
  featured: payload.featured ?? false,
});

export const useProducts = (initialProducts: MenuProduct[] = [], options: UseProductsOptions = {}) => {
  const [items, setItems] = useState<MenuProduct[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    setItems(initialProducts);
  }, [initialProducts]);

  const refresh = useCallback(async () => {
    if (typeof fetch !== 'function') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/get_products.php');
      if (!response.ok) {
        throw new Error('fetch_failed');
      }

      const data = await response.json().catch(() => ({}));
      if (Array.isArray(data?.menuProducts)) {
        setItems(data.menuProducts);
      }
    } catch (err) {
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options.autoRefresh) {
      refresh();
    }
  }, [options.autoRefresh, refresh]);

  const createProduct = useCallback(async (payload: ProductPayload) => {
    if (typeof fetch !== 'function') {
      throw new Error('fetch_unavailable');
    }

    setIsMutating(true);
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const optimistic = buildProduct(payload, tempId);
    setItems(prev => [...prev, optimistic]);

    try {
      const response = await fetch('/api/products/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'save_failed');
      }

      const newId = String(data?.id ?? tempId);
      setItems(prev => prev.map(item => (item.id === tempId ? { ...item, id: newId } : item)));
      return newId;
    } catch (err) {
      setItems(prev => prev.filter(item => item.id !== tempId));
      setError('No se pudo guardar el producto.');
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateProduct = useCallback(async (payload: ProductPayload) => {
    if (!payload.id) {
      throw new Error('missing_id');
    }
    if (typeof fetch !== 'function') {
      throw new Error('fetch_unavailable');
    }

    setIsMutating(true);
    setError(null);

    const previous = itemsRef.current.find(item => item.id === payload.id);
    const optimistic = buildProduct(payload, payload.id);
    setItems(prev => prev.map(item => (item.id === payload.id ? optimistic : item)));

    try {
      const response = await fetch('/api/products/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'save_failed');
      }
    } catch (err) {
      if (previous) {
        setItems(prev => prev.map(item => (item.id === previous.id ? previous : item)));
      }
      setError('No se pudo actualizar el producto.');
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    if (typeof fetch !== 'function') {
      throw new Error('fetch_unavailable');
    }

    setIsMutating(true);
    setError(null);

    const previous = itemsRef.current;
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      const response = await fetch('/api/products/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id: Number(id) }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'delete_failed');
      }
    } catch (err) {
      setItems(previous);
      setError('No se pudo eliminar el producto.');
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return useMemo(() => ({
    items,
    loading,
    isMutating,
    error,
    refresh,
    createProduct,
    updateProduct,
    deleteProduct,
  }), [items, loading, isMutating, error, refresh, createProduct, updateProduct, deleteProduct]);
};
