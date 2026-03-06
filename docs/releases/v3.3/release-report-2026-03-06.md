# Release Report v3.3 (Produccion)

Fecha de corte: 2026-03-06  
Entorno auditado: `https://amaliscafeteria.com`

## 1) Resumen de estado en produccion

- Frontend en produccion actualizado con el fix de modal movil.
- Estado funcional actual:
  - Home: operativa.
  - Carta: operativa.
  - Admin: operativa (ruta accesible para login/admin).
- Fix validado en produccion:
  - Problema: el boton de cerrar del modal de producto quedaba por detras del navbar en movil.
  - Resultado actual: modal por encima del navbar y boton de cierre accesible/clicable.

## 2) Cambios aplicados

- Commit tecnico desplegado:
  - `264475c` - `fix(menu): keep mobile product modal above fixed navbar`
- Cambios de codigo:
  - `src/components/ProductModal.tsx`
    - capa del contenedor modal de `z-50` a `z-[80]`.
  - `src/test/ProductModal.test.tsx`
    - test de regresion para asegurar que el modal queda por encima del navbar fijo.

## 3) Despliegue realizado

- Build de frontend generado con `npm run build`.
- Subida por FTP a Hostinger:
  - `index.html`
  - `assets/*` (24 archivos del build)
- Verificacion posterior en produccion:
  - lectura remota de `index.html` y presencia de assets nuevos
  - validacion E2E de modal en movil con Playwright CLI

## 4) Lighthouse en produccion

Fuente de datos: ejecucion Lighthouse CLI sobre produccion (6 corridas: 3 rutas x movil/desktop).  
Archivo consolidado: `output/lighthouse-2026-03-06/lighthouse-summary.json`.

### Movil

| Ruta | Performance | Accessibility | Best Practices | SEO | LCP (ms) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 1318 | 0.000 | 0 |
| `/carta` | 99 | 96 | 100 | 100 | 2047 | 0.000 | 62 |
| `/admin` | 74 | 95 | 96 | 100 | 1925 | 2.013 | 0 |

### Desktop (PC)

| Ruta | Performance | Accessibility | Best Practices | SEO | LCP (ms) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 | 381 | 0.000 | 0 |
| `/carta` | 100 | 96 | 100 | 100 | 552 | 0.000 | 0 |
| `/admin` | 77 | 95 | 96 | 100 | 469 | 0.671 | 0 |

## 5) Evidencia tecnica generada

- Lighthouse (JSON bruto):
  - `output/lighthouse-2026-03-06/prod-mobile-home.json`
  - `output/lighthouse-2026-03-06/prod-mobile-carta.json`
  - `output/lighthouse-2026-03-06/prod-mobile-admin.json`
  - `output/lighthouse-2026-03-06/prod-desktop-home.json`
  - `output/lighthouse-2026-03-06/prod-desktop-carta.json`
  - `output/lighthouse-2026-03-06/prod-desktop-admin.json`
- Consolidado:
  - `output/lighthouse-2026-03-06/lighthouse-summary.json`
- Verificacion visual/funcional modal en produccion:
  - `.playwright-cli/page-2026-03-06T12-27-33-152Z.yml`
  - `.playwright-cli/page-2026-03-06T12-27-45-027Z.yml`

## 6) Riesgos y observaciones abiertas

- El objetivo 100/100 en todas las rutas no se cumple en `/admin` (movil y desktop) ni en accesibilidad de `/carta`.
- `CLS` en `/admin` es alto (movil: `2.013`, desktop: `0.671`) y requiere un pase de optimizacion especifico en esa ruta.
- Durante la ejecucion de Lighthouse CLI en Windows aparecio `EPERM` al limpiar carpeta temporal de Chrome; los reportes JSON se generaron correctamente y se usaron como evidencia.

## 7) Trazabilidad Git de esta documentacion

- Rama: `feature/optimization-pass-1`
- Base previa: `v3.2`
- Release documentada para version: `v3.3`
