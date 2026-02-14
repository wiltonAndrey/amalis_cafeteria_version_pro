import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { vi, afterEach } from 'vitest';
import { PROMOTION_CARDS } from '../constants';
import type { PromotionCard } from '../types';
import { usePromotionCards } from '../hooks/usePromotionCards';

describe('promotion cards contract', () => {
  it('exposes four fallback cards matching PromotionCard shape', () => {
    const cards: PromotionCard[] = PROMOTION_CARDS;

    expect(cards).toHaveLength(4);
    cards.forEach((card) => {
      expect(typeof card.badge).toBe('string');
      expect(typeof card.image).toBe('string');
      expect(typeof card.image_alt).toBe('string');
      expect(typeof card.image_title).toBe('string');
      expect(typeof card.title).toBe('string');
      expect(typeof card.price).toBe('number');
      expect(typeof card.description).toBe('string');
      expect(Array.isArray(card.items)).toBe(true);
      expect(typeof card.availability_text).toBe('string');
      expect(typeof card.cta_url).toBe('string');
      expect(typeof card.cta_label).toBe('string');
    });
  });
});

describe('usePromotionCards', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('loads promotion cards from API payload', async () => {
    const apiCards: PromotionCard[] = [
      {
        ...PROMOTION_CARDS[0],
        id: 'remote-1',
        title: 'Remota',
      },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ promotionCards: apiCards }),
      }),
    );

    const { result } = renderHook(() => usePromotionCards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(null);
    expect(result.current.cards).toEqual(apiCards);
  });

  it('falls back to static cards when API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    const { result } = renderHook(() => usePromotionCards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('promotions_unavailable');
    expect(result.current.cards).toEqual(PROMOTION_CARDS);
  });

  it('uses cached cards when API fails', async () => {
    const cachedCards: PromotionCard[] = [
      {
        ...PROMOTION_CARDS[0],
        title: 'Manana editada',
      },
    ];
    localStorage.setItem('amalis_promotion_cards_v1', JSON.stringify(cachedCards));
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    const { result } = renderHook(() => usePromotionCards());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.cards).toEqual(cachedCards);
  });
});
