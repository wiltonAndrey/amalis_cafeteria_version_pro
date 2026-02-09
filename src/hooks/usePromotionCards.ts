import { useEffect, useMemo, useState } from 'react';
import { PROMOTION_CARDS } from '../constants';
import type { PromotionCard } from '../types';
import { readPromotionCardsFromStorage, writePromotionCardsToStorage } from '../utils/promotion-storage';

interface UsePromotionCardsResult {
  cards: PromotionCard[];
  loading: boolean;
  error: string | null;
}

export const usePromotionCards = (): UsePromotionCardsResult => {
  const [cards, setCards] = useState<PromotionCard[]>(() => readPromotionCardsFromStorage(PROMOTION_CARDS));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (typeof fetch !== 'function') {
        setCards(readPromotionCardsFromStorage(PROMOTION_CARDS));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/promotions/list.php');
        if (!response.ok) {
          throw new Error('request_failed');
        }

        const payload = await response.json();
        if (!Array.isArray(payload?.promotionCards)) {
          throw new Error('invalid_payload');
        }

        if (!cancelled) {
          const remoteCards = payload.promotionCards as PromotionCard[];
          setCards(remoteCards);
          writePromotionCardsToStorage(remoteCards);
          setError(null);
        }
      } catch (_error) {
        if (!cancelled) {
          setCards(readPromotionCardsFromStorage(PROMOTION_CARDS));
          setError('promotions_unavailable');
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
  }, []);

  return useMemo(
    () => ({
      cards,
      loading,
      error,
    }),
    [cards, loading, error],
  );
};
