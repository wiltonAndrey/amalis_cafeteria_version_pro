import { describe, expect, it } from 'vitest';
import {
  formatBizcochoPricePer100g,
  formatBizcochoPriceReference,
  formatStandardPublicPrice,
  getPublicMenuDescription,
  getPublicMenuPriceDisplay,
  isWeightPricedBizcocho,
} from '../utils/menu-pricing';

describe('menu-pricing', () => {
  const publicBizcocho = {
    id: '73',
    name: 'Bizcocho de Pistacho',
    price: 26,
    price_unit: 'kg' as const,
    category: 'bolleria-dulce' as const,
    description: 'Nuestro bizcocho de pistacho 100% tostado destaca por su sabor intenso y elegante.',
  };

  const publicBizcochoUnderscore = {
    ...publicBizcocho,
    category: 'bolleria_dulce' as const,
  };

  const publicBizcochoAlias = {
    ...publicBizcocho,
    category: 'bolleria' as const,
    price: '26.00',
    price_unit: undefined,
  };

  const publicBizcochoPasteleria = {
    ...publicBizcocho,
    category: 'pasteleria' as const,
  };

  const publicBizcochoPasteles = {
    ...publicBizcocho,
    category: 'pasteles' as const,
    price: '26.00',
    price_unit: undefined,
  };

  const publicBizcochoLegacyPasteleriaAlias = {
    ...publicBizcocho,
    category: 'bizcochos' as const,
    price: '26.00',
    price_unit: undefined,
  };

  const publicBizcochoWithoutCanonicalUnit = {
    ...publicBizcocho,
    price_unit: undefined,
  };

  const canonicalUnitBizcocho = {
    ...publicBizcocho,
    price_unit: 'unit' as const,
  };

  const canonicalKgToast = {
    id: 'kg-toast',
    name: 'Tostada por peso',
    price: 18,
    price_unit: 'kg' as const,
    category: 'tostadas' as const,
    description: 'Formato especial.',
  };

  const publicSweetPastry = {
    id: '4',
    name: 'Croissant de Mantequilla',
    price: 1.4,
    category: 'bolleria-dulce' as const,
    description: 'Hojaldre artesanal con auténtica mantequilla.',
  };

  const publicLegacyPasteleriaAliasWithoutBizcochoName = {
    ...publicSweetPastry,
    category: 'bizcochos' as const,
  };

  const tostada = {
    id: '51',
    name: '½ Tostada Catalana',
    price: 3.25,
    category: 'tostadas' as const,
    description: 'Pan tostado con tomate',
  };

  const tostadaFromApi = {
    ...tostada,
    price: '3.25',
  };

  it('detecta bizcochos por la forma real del payload público', () => {
    expect(isWeightPricedBizcocho(publicBizcocho)).toBe(true);
    expect(isWeightPricedBizcocho(publicBizcochoWithoutCanonicalUnit)).toBe(true);
    expect(isWeightPricedBizcocho(publicBizcochoUnderscore)).toBe(true);
    expect(isWeightPricedBizcocho(publicBizcochoAlias as any)).toBe(true);
    expect(isWeightPricedBizcocho(publicBizcochoPasteleria)).toBe(true);
    expect(isWeightPricedBizcocho(publicBizcochoPasteles as any)).toBe(true);
    expect(isWeightPricedBizcocho(publicBizcochoLegacyPasteleriaAlias as any)).toBe(true);
    expect(isWeightPricedBizcocho(canonicalUnitBizcocho)).toBe(false);
    expect(isWeightPricedBizcocho(canonicalKgToast)).toBe(true);
    expect(isWeightPricedBizcocho(publicLegacyPasteleriaAliasWithoutBizcochoName as any)).toBe(false);
    expect(isWeightPricedBizcocho(publicSweetPastry)).toBe(false);
    expect(isWeightPricedBizcocho(tostada)).toBe(false);
  });

  it('convierte el precio visible de bizcocho a 100 gramos', () => {
    expect(formatBizcochoPricePer100g(26)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(publicBizcocho)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(publicBizcochoUnderscore)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(publicBizcochoPasteleria)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(publicBizcochoAlias as any)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(publicBizcochoPasteles as any)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(publicBizcochoLegacyPasteleriaAlias as any)).toBe('2,60 €/100 g');
    expect(getPublicMenuPriceDisplay(canonicalUnitBizcocho)).toBe('26.00 EUR');
    expect(getPublicMenuPriceDisplay(canonicalKgToast)).toBe('1,80 €/100 g');
    expect(getPublicMenuPriceDisplay(publicLegacyPasteleriaAliasWithoutBizcochoName as any)).toBe('1.40 EUR');
  });

  it('agrega la referencia por kilo en la descripción pública de bizcochos', () => {
    expect(formatBizcochoPriceReference(26)).toBe('Precio por peso · 26,00 €/kg');
    expect(getPublicMenuDescription(publicBizcocho)).toBe(
      'Nuestro bizcocho de pistacho 100% tostado destaca por su sabor intenso y elegante. Precio por peso · 26,00 €/kg'
    );
    expect(getPublicMenuDescription(publicBizcochoUnderscore)).toContain('Precio por peso · 26,00 €/kg');
    expect(getPublicMenuDescription(publicBizcochoPasteleria)).toContain('Precio por peso · 26,00 €/kg');
    expect(getPublicMenuDescription(publicBizcochoAlias as any)).toContain('Precio por peso · 26,00 €/kg');
    expect(getPublicMenuDescription(publicBizcochoPasteles as any)).toContain('Precio por peso · 26,00 €/kg');
    expect(getPublicMenuDescription(publicBizcochoLegacyPasteleriaAlias as any)).toContain('Precio por peso · 26,00 €/kg');
    expect(getPublicMenuDescription(canonicalUnitBizcocho)).toBe(
      'Nuestro bizcocho de pistacho 100% tostado destaca por su sabor intenso y elegante.'
    );
    expect(getPublicMenuDescription(canonicalKgToast)).toContain('Precio por peso · 18,00 €/kg');
    expect(getPublicMenuDescription(publicLegacyPasteleriaAliasWithoutBizcochoName as any)).toBe(
      'Hojaldre artesanal con auténtica mantequilla.'
    );
    expect(getPublicMenuDescription(publicSweetPastry)).toBe('Hojaldre artesanal con auténtica mantequilla.');
    expect(getPublicMenuDescription(tostada)).toBe('Pan tostado con tomate');
  });

  it('usa el mismo formateo público estándar para productos no pesados', () => {
    expect(formatStandardPublicPrice(3.25)).toBe('3.25 EUR');
    expect(getPublicMenuPriceDisplay(tostada)).toBe('3.25 EUR');
    expect(formatStandardPublicPrice('3.25')).toBe('3.25 EUR');
    expect(getPublicMenuPriceDisplay(tostadaFromApi as any)).toBe('3.25 EUR');
  });
});
