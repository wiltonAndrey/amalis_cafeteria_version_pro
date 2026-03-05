# Produccion v3 - Importacion completa de catalogo

Fecha de ejecucion: 2026-03-05

## Scope
- Dominio validado: `https://amaliscafeteria.com`
- API validada: `https://amaliscafeteria.com/api/get_products.php`
- Objetivo: reemplazar semilla de 7 productos por catalogo real v2 en `menu_products`.

## Source of truth
- Fuente elegida: `v2.0.1:docs/exports/menu_products_copy_active_2026-03-02.json`
- Copia local timestamped (ignorada por git): `docs/exports/menu_products_copy_active_source_v2.0.1_20260305_105143.json`
- Total esperado: 48 productos activos
- Distribucion esperada:
  - `tostadas`: 10
  - `bolleria-salada`: 9
  - `bolleria-dulce`: 9
  - `pasteleria`: 8
  - `bebidas`: 12

## Backup pre-import
- Backup timestamped pre-import (ignorado por git): `docs/exports/menu_products_copy_active_prod_preimport_20260305_105210.json`
- Contenido: `menuCategories`, `menuProducts`, `featuredProducts` de produccion antes del cambio.
- Rollback operativo:
  - El script `scripts/import_catalog_via_admin_api.ps1` acepta archivos con formato `{ menuProducts: [...] }`.
  - Puede restaurarse desde el backup anterior ejecutando el mismo script contra ese archivo.

## Importacion ejecutada
- Script permanente usado: `scripts/import_catalog_via_admin_api.ps1`
- Modo: autenticado por admin API, upsert por `nombre+categoria`, orden por categoria, desactivacion de sobrantes.
- Resultado de ejecucion en produccion:
  - `inserted=47`
  - `updated=1`
  - `deactivated=6`
  - `omitted=0`
  - `errors=0`
  - `after_products=48`
- Reporte local timestamped (ignorado por git): `docs/exports/menu_products_import_report_20260305_105218.json`

## Validacion estricta
- API:
  - `GET /api/get_products.php` -> HTTP 200
  - Conteo final: 48
  - Categorias finales de `menuProducts`: `tostadas`, `bolleria-salada`, `bolleria-dulce`, `pasteleria`, `bebidas`
- Navegador (`/carta`):
  - Carga correcta del listado completo.
  - Filtro `BEBIDAS` muestra 12 productos.
  - Filtro `TOSTADAS` muestra 10 productos.
  - Filtro `OFERTAS` muestra estado vacio controlado (`Proximamente...`) sin errores.
- Canary CRUD admin:
  - Login admin: 200
  - Create canary: 201 (`id=57`)
  - Update canary: 200
  - Delete canary: 200
  - Verificacion delete: 404 `not_found` (limpieza confirmada)

## Limpieza de seguridad
- No se subieron scripts temporales al hosting.
- No se crearon endpoints temporales en produccion.
- Canary de prueba eliminado.
