import { useCallback, useEffect, useMemo, useState } from 'react';
import { PROMOTION_CARDS } from '../constants';
import type { PromotionCard } from '../types';
import { readPromotionCardsFromStorage, writePromotionCardsToStorage } from '../utils/promotion-storage';

export type PromotionUpdateInput = PromotionCard;

interface UsePromotionAdminResult {
  cards: PromotionCard[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  reload: () => Promise<void>;
  updatePromotion: (input: PromotionUpdateInput) => Promise<PromotionCard>;
}

const isPromotionCardArray = (value: unknown): value is PromotionCard[] =>
  Array.isArray(value);

export const usePromotionAdmin = (): UsePromotionAdminResult => {
  const [cards, setCards] = useState<PromotionCard[]>(() => readPromotionCardsFromStorage(PROMOTION_CARDS));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/promotions/list.php');
      if (!response.ok) {
        throw new Error('list_failed');
      }
      const payload = await response.json();
      if (!isPromotionCardArray(payload?.promotionCards)) {
        throw new Error('invalid_list_payload');
      }
      setCards(payload.promotionCards);
      writePromotionCardsToStorage(payload.promotionCards);
      setError(null);
    } catch (_error) {
      setCards(readPromotionCardsFromStorage(PROMOTION_CARDS));
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const updatePromotion = useCallback(async (input: PromotionUpdateInput) => {
    const optimisticCard: PromotionCard = {
      ...input,
      items: input.items.map((item) => item.trim()).filter(Boolean),
      price: Number(input.price),
    };

    setSaving(true);
    setCards((prev) => {
      const next = prev.map((card) => (card.id === optimisticCard.id ? optimisticCard : card));
      writePromotionCardsToStorage(next);
      return next;
    });
    setError(null);

    try {
      const response = await fetch('/api/promotions/update.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimisticCard),
      });

      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload?.promotionCard) {
        const updatedCard = payload.promotionCard as PromotionCard;
        setCards((prev) => {
          const next = prev.map((card) => (card.id === updatedCard.id ? updatedCard : card));
          writePromotionCardsToStorage(next);
          return next;
        });
        return updatedCard;
      }
    } catch (_error) {
      // In local Vite dev, PHP endpoints may be unavailable; keep optimistic update.
    } finally {
      setSaving(false);
    }

    return optimisticCard;
  }, []);

  return useMemo(
    () => ({
      cards,
      loading,
      saving,
      error,
      reload,
      updatePromotion,
    }),
    [cards, loading, saving, error, reload, updatePromotion],
  );
};
