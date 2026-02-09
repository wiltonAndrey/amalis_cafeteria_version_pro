import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePromotionAdmin } from '../hooks/usePromotionAdmin';
import { PROMOTION_CARDS } from '../constants';

describe('usePromotionAdmin', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('falls back to static cards when promotions endpoint returns php source', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('invalid_json');
        },
      }),
    );

    const { result } = renderHook(() => usePromotionAdmin());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.cards).toEqual(PROMOTION_CARDS);
    expect(result.current.error).toBe(null);
  });

  it('uses cached cards when cms endpoint is unavailable', async () => {
    const cachedCards = [{ ...PROMOTION_CARDS[0], title: 'Manana cacheada' }];
    localStorage.setItem('amalis_promotion_cards_v1', JSON.stringify(cachedCards));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('invalid_json');
        },
      }),
    );

    const { result } = renderHook(() => usePromotionAdmin());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.cards).toEqual(cachedCards);
  });
});
