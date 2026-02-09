# Baseline y QA visual (desktop)

Fecha: 2026-02-09
Alcance: Home desktop-only (sin ajustes mobile).

## Baseline tecnico antes de cambios

- `npm run test:run -- src/test/components.test.tsx src/test/PromotionsSection.test.tsx`: 82/82 tests OK.
- `npm run build`: OK.
- Estado Git inicial detectado: `D src/components/ProductCard.tsx` (cambio previo no generado en esta sesion).

## Verificacion tecnica al cierre

- `npm run test:run`: 124/124 tests OK.
- `npm run build`: OK.

## Checklist de QA visual desktop

- Hero y Navbar legibles en primer pantallazo.
- CTAs principales con destino real a `/carta`.
- Tarjetas de `FeaturedProducts` sin precio en landing.
- `PromotionsSection` con descripciones clamp y cards estables.
- `CoffeeExperience` con card flotante legible sobre fondo.
- `Testimonials` con grid desktop de 3 columnas.
- `LocationSection` con enlaces reales de Google Maps.

## Pendientes manuales

- Captura de screenshots baseline/final en 1440px y 1920px.
- Validacion visual manual final en navegador real (desktop).
