import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMenuProducts } from '../hooks/useMenuProducts';
import { MENU_CRITICAL_PRODUCTS } from '../constants/menu-critical';
import { MENU_PRODUCTS } from '../constants/menu-fallback';
import { MENU_SHELL_CATEGORIES } from '../constants/menu-shell';
import { normalizeMenuProductTaxonomy } from '../utils/menu-taxonomy';

describe('useMenuProducts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps the lightweight menu shell visible immediately while the remote menu is still loading', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));

    const { result } = renderHook(() => useMenuProducts());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.menuCategories).toEqual(MENU_SHELL_CATEGORIES);
    expect(result.current.menuProducts).toEqual(
      MENU_CRITICAL_PRODUCTS.map((product) => normalizeMenuProductTaxonomy(product)),
    );
  });

  it('falls back to the full local carta dataset when the API payload is not usable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('invalid-json');
        },
      }),
    );

    const { result } = renderHook(() => useMenuProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('cms_unavailable');
    expect(result.current.menuCategories).toEqual(MENU_SHELL_CATEGORIES);
    expect(result.current.menuProducts).toEqual(
      MENU_PRODUCTS.map((product) => normalizeMenuProductTaxonomy(product)),
    );
  });
});
