import type { MenuProduct } from '../types';
import { normalizeMenuCategory } from './menu-categories';

const EURO_FORMATTER = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const NAME_MATCH_WEIGHT_PRICED_BIZCOCHO_CATEGORIES = new Set(['bolleria-dulce', 'pasteleria']);
const BIZCOCHO_NAME_PREFIX = 'bizcocho';

type PublicMenuPrice = number | string;
type CanonicalPriceUnit = NonNullable<MenuProduct['price_unit']>;
type MenuPricingProduct = Pick<MenuProduct, 'category' | 'name' | 'price_unit'> & { price: PublicMenuPrice };

const normalizePublicMenuPrice = (price: PublicMenuPrice): number | null => {
  if (typeof price === 'number') {
    return Number.isFinite(price) ? price : null;
  }

  const normalizedPrice = Number.parseFloat(price.trim());
  return Number.isFinite(normalizedPrice) ? normalizedPrice : null;
};

export const formatStandardPublicPrice = (price: PublicMenuPrice): string => {
  const normalizedPrice = normalizePublicMenuPrice(price);
  return normalizedPrice === null ? `${price} EUR` : `${normalizedPrice.toFixed(2)} EUR`;
};

const hasCanonicalPriceUnit = (priceUnit?: string): priceUnit is CanonicalPriceUnit => {
  return priceUnit === 'unit' || priceUnit === 'kg';
};

const isLegacyWeightPricedBizcocho = (
  product: Pick<MenuProduct, 'category' | 'name'> & { price: PublicMenuPrice }
): boolean => {
  const normalizedCategory = normalizeMenuCategory(product.category);

  if (!normalizedCategory || !NAME_MATCH_WEIGHT_PRICED_BIZCOCHO_CATEGORIES.has(normalizedCategory)) {
    return false;
  }

  return product.name.trim().toLocaleLowerCase('es-ES').startsWith(BIZCOCHO_NAME_PREFIX);
};

const getResolvedPriceUnit = (product: MenuPricingProduct): CanonicalPriceUnit => {
  if (hasCanonicalPriceUnit(product.price_unit)) {
    return product.price_unit;
  }

  return isLegacyWeightPricedBizcocho(product) ? 'kg' : 'unit';
};

export const isWeightPricedBizcocho = (
  product: MenuPricingProduct
): boolean => {
  if (normalizePublicMenuPrice(product.price) === null) {
    return false;
  }

  return getResolvedPriceUnit(product) === 'kg';
};

export const formatBizcochoPricePer100g = (pricePerKg: number): string => {
  return `${EURO_FORMATTER.format(pricePerKg / 10)} €/100 g`;
};

export const formatBizcochoPriceReference = (pricePerKg: number): string => {
  return `Precio por peso · ${EURO_FORMATTER.format(pricePerKg)} €/kg`;
};

export const getPublicBizcochoPriceReference = (
  product: MenuPricingProduct
): string | null => {
  if (!isWeightPricedBizcocho(product)) {
    return null;
  }

  return formatBizcochoPriceReference(normalizePublicMenuPrice(product.price)!);
};

export const getPublicMenuPriceDisplay = (
  product: MenuPricingProduct
): string => {
  const normalizedPrice = normalizePublicMenuPrice(product.price);

  if (isWeightPricedBizcocho(product)) {
    return formatBizcochoPricePer100g(normalizedPrice!);
  }

  return formatStandardPublicPrice(normalizedPrice ?? product.price);
};

export const getPublicMenuDescription = (
  product: Pick<MenuProduct, 'category' | 'description' | 'name' | 'price_unit'> & { price: PublicMenuPrice }
): string => {
  const priceReference = getPublicBizcochoPriceReference(product);

  if (!priceReference) {
    return product.description;
  }

  return `${product.description} ${priceReference}`.trim();
};
