import type { PromotionCard } from '../types';

export const PROMOTION_STORAGE_KEY = 'amalis_promotion_cards_v1';

const isPromotionCard = (value: unknown): value is PromotionCard => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.badge === 'string' &&
    typeof candidate.image === 'string' &&
    typeof candidate.image_alt === 'string' &&
    typeof candidate.image_title === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.description === 'string' &&
    Array.isArray(candidate.items) &&
    typeof candidate.availability_text === 'string' &&
    typeof candidate.cta_url === 'string' &&
    typeof candidate.cta_label === 'string'
  );
};

const normalizeCards = (cards: PromotionCard[]): PromotionCard[] =>
  cards.map((card) => ({
    ...card,
    price: Number(card.price),
    items: card.items.map((item) => String(item).trim()).filter(Boolean),
  }));

export const readPromotionCardsFromStorage = (fallback: PromotionCard[]): PromotionCard[] => {
  if (typeof localStorage === 'undefined') {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(PROMOTION_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return fallback;
    }

    const cards = parsed.filter(isPromotionCard);
    if (cards.length === 0) {
      return fallback;
    }

    return normalizeCards(cards);
  } catch {
    return fallback;
  }
};

export const writePromotionCardsToStorage = (cards: PromotionCard[]): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(PROMOTION_STORAGE_KEY, JSON.stringify(normalizeCards(cards)));
  } catch {
    // No-op: storage quota or browser restrictions.
  }
};
