import { describe, expect, it } from 'vitest';
import {
  COFFEE_EXPERIENCE_DATA,
  FEATURED_PRODUCTS_SECTION,
  GALLERY_ITEMS,
  GALLERY_SECTION,
  HISTORY_SECTION,
  MENU_CATEGORIES,
  MENU_PRODUCTS,
  PRODUCTS,
  PROMOTION_CARDS,
  PROMOTIONS_SECTION_CONTENT,
  TESTIMONIALS,
  TESTIMONIALS_SECTION,
  WHY_CHOOSE_US_FEATURES,
} from '../constants';
import { FOOTER_CONTENT, HERO_CONTENT, NAV_LINKS } from '../constants/core';
import { LOCATION_INFO } from '../constants/location';
import { ADMIN_MENU_CATEGORY_OPTIONS } from '../utils/menu-categories';

describe('public copy encoding', () => {
  it('keeps public content free of mojibake characters', () => {
    const publicContent = JSON.stringify({
      hero: HERO_CONTENT,
      footer: FOOTER_CONTENT,
      nav: NAV_LINKS,
      location: LOCATION_INFO,
      sections: {
        HISTORY_SECTION,
        FEATURED_PRODUCTS_SECTION,
        PROMOTIONS_SECTION_CONTENT,
        TESTIMONIALS_SECTION,
        GALLERY_SECTION,
        COFFEE_EXPERIENCE_DATA,
      },
      menu: {
        categories: MENU_CATEGORIES,
        products: MENU_PRODUCTS,
      },
      promotions: PROMOTION_CARDS,
      highlights: PRODUCTS,
      testimonials: TESTIMONIALS,
      gallery: GALLERY_ITEMS,
      whyChooseUs: WHY_CHOOSE_US_FEATURES,
    });

    expect(publicContent).not.toMatch(/[\u00C2\u00C3\u00E2]/);
  });

  it('keeps visible category labels accented', () => {
    expect(ADMIN_MENU_CATEGORY_OPTIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'bolleria-salada', label: 'Bollería salada' }),
        expect.objectContaining({ id: 'bolleria-dulce', label: 'Bollería dulce' }),
        expect.objectContaining({ id: 'pasteleria', label: 'Pastelería' }),
      ])
    );
  });

  it('preserves key accent-sensitive strings used in the public UI', () => {
    expect(HERO_CONTENT.title).toContain('Panadería');
    expect(HERO_CONTENT.ctaSecondary).toBe('Cómo llegar');
    expect(LOCATION_INFO.title).toBe('Encuéntranos en Santa Pola');
    expect(LOCATION_INFO.hours).toBe('7:00–21:00');
  });
});
