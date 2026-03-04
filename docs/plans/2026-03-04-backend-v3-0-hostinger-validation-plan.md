# Backend v3.0 Hostinger Validation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finalizar y validar el backend PHP + MySQL en el hosting real de Hostinger sin afectar el frontend publico, y dejar una base documentada lista para guardarse en GitHub como version 3.0.

**Architecture:** El frontend actual sigue consumiendo los endpoints existentes (`api/get_products.php`, `api/get_settings.php`, `api/features.php`, `api/hero.php`, `api/testimonials.php`, `api/philosophy.php`, `api/promotions/list.php`) sin cambios en `src/`, `public/` ni `dist/`. La validacion real en hosting se apoya en tres capas: preflight local con tests ya existentes, chequeo aislado en servidor con un unico archivo temporal, y smoke test final desde las rutas publicas y el admin. Los snapshots de base de datos se exportan con utilidades ya presentes y quedan fuera de Git por `.gitignore`.

**Tech Stack:** Hostinger Shared Hosting (LiteSpeed), PHP 8.x, MySQL, phpMyAdmin, React + Vite, GitHub, browser automation para la verificacion final.

---

## Guardrails (no negociables)

- No modificar `src/`, `public/` ni `dist/` durante esta fase.
- No crear nuevas carpetas de tests.
- No ampliar `api/tests/`; esa carpeta se usa solo como referencia local.
- No desplegar una bateria de tests al hosting.
- Usar un solo archivo temporal de chequeo en el servidor: `api/system_check.php`.
- Todo CRUD de validacion debe usar datos canary invisibles (`active = 0`) o limpieza inmediata.
- Antes de tocar la base de datos: exportar snapshot completo y copia de `menu_products`.
- Al terminar: borrar `api/system_check.php` del hosting y confirmar que no quedan registros canary.

## Approach Decision

1. Validacion en el hosting real con un unico chequeo temporal y smoke tests controlados (recomendado).
2. Validacion en subdominio staging separado, si Hostinger lo ofrece.
3. Validacion solo en local.

Este plan usa la opcion 1. Si mas adelante tienes staging, se reutiliza el mismo flujo primero en staging y luego en produccion.

---

### Task 1: Congelar el punto de partida y levantar respaldo antes de probar

**Files:**
- Reference: `.gitignore`
- Reference: `api/utils/export_database_snapshot.php`
- Reference: `api/utils/export_menu_products_copy.php`
- Reference: `api/tests/connection.test.php`
- Reference: `api/tests/get_products.test.php`
- Reference: `api/tests/auth.test.php`
- Reference: `api/tests/products_create.test.php`
- Reference: `api/tests/products_update.test.php`
- Reference: `api/tests/products_delete.test.php`
- Reference: `api/tests/upload.test.php`

**Step 1: Ejecutar preflight local minimo sin crear mas tests**

Run:

```bash
php api/tests/connection.test.php
php api/tests/get_products.test.php
php api/tests/auth.test.php
php api/tests/products_create.test.php
php api/tests/products_update.test.php
php api/tests/products_delete.test.php
php api/tests/upload.test.php
```

Expected: PASS en todos. Si alguno falla, se corrige localmente antes de tocar Hostinger.

**Step 2: Exportar snapshot completo de la base actual**

Run:

```bash
php api/utils/export_database_snapshot.php docs/exports/database_snapshot_pre_v3_0.json
```

Expected: JSON con `ok = true`. El archivo queda fuera de Git porque `docs/exports/database_snapshot_*.json` ya esta ignorado.

**Step 3: Exportar copia funcional de `menu_products`**

Run:

```bash
php api/utils/export_menu_products_copy.php docs/exports/menu_products_copy_pre_v3_0.json
```

Expected: JSON con `ok = true`. Esto deja un respaldo rapido de la carta por si hay que restaurar datos.

**Step 4: Registrar el rollback funcional**

Anotar en la documentacion operativa que ya existe una base estable previa:
- commit `988d5cb`
- tag `stable-pre-optimization-2026-03-04`

Ese tag no se toca. Es el punto de retorno si algo falla antes de cerrar v3.0.

---

### Task 2: Auditar la conexion y el entorno real en Hostinger

**Files:**
- Verify: `api/db_config.php`
- Verify: `api/db_config.local.php.example`
- Create on server only: `api/db_config.local.php`
- Verify: `api/bootstrap.php`
- Reference: `api/schema.sql`

**Step 1: Bloquear la version de PHP en hPanel**

Configurar Hostinger con una version PHP 8.x estable y mantenerla fija durante toda la ventana de pruebas. La regla practica es: usar la misma version que supere el smoke test inicial y no cambiarla a mitad del proceso.

**Step 2: Crear `api/db_config.local.php` solo en el servidor**

El archivo ya esta contemplado por `api/db_config.php` y esta ignorado por Git. Debe contener solo las credenciales reales de Hostinger.

**Step 3: Confirmar extensiones minimas**

Verificar que el entorno tiene al menos:
- `PDO`
- `pdo_mysql`
- `json`
- `mbstring`

Sin esas extensiones, el backend no debe pasar a la siguiente fase.

**Step 4: Confirmar que `get_pdo()` conecta sin errores**

La primera prueba real en Hostinger es confirmar que `api/bootstrap.php` puede inicializar PDO con `db_config.local.php` sin errores fatales.

---

### Task 3: Crear un chequeo temporal e invisible en el servidor

**Files:**
- Create temporarily on server only: `api/system_check.php`
- Reference: `api/bootstrap.php`
- Reference: `api/schema.sql`
- Reference: `api/utils/list_tables.php`
- Reference: `api/utils/read_table.php`

**Step 1: Crear un unico script temporal**

`api/system_check.php` debe existir solo durante la validacion en hosting. No se deja permanente en el repo ni en produccion.

**Step 2: Proteger el acceso**

El script debe exigir un token secreto por query string o por variable de entorno. Si no hay token valido:
- responder `403`
- no mostrar credenciales
- no mostrar stack traces

**Step 3: Validar conexion, tablas y columnas criticas**

El script debe comprobar:
- conexion PDO correcta
- existencia de tablas clave definidas en `api/schema.sql`
  - `menu_categories`
  - `menu_products`
  - `products`
  - `settings`
  - `admins`
  - `hero`
  - `features`
  - `promotion_cards`
  - `philosophy`
  - `testimonials`
- columnas criticas para la carta
  - `menu_products.alt_text`
  - `menu_products.image_title`
  - `menu_products.sort_order`

**Step 4: Validar permisos de escritura solo donde aplica**

Si se va a probar subida de imagen, el script debe confirmar que la carpeta de uploads existe y es escribible antes de usar `api/upload.php`.

**Step 5: Salida limpia**

La respuesta del script debe ser un JSON corto:
- `ok`
- `checks`
- `warnings`
- `timestamp`

Nada de HTML, nada de debug visual, nada reutilizable por terceros.

---

### Task 4: Validar endpoints de lectura sin tocar el frontend

**Files:**
- Verify: `api/get_products.php`
- Verify: `api/get_settings.php`
- Verify: `api/features.php`
- Verify: `api/hero.php`
- Verify: `api/philosophy.php`
- Verify: `api/testimonials.php`
- Verify: `api/promotions/list.php`

**Step 1: Probar cada endpoint por URL directa**

No se navega la UI para esto. Se llama cada endpoint directamente por su URL publica en Hostinger.

**Step 2: Comprobar contrato minimo**

Cada endpoint debe devolver:
- estado HTTP `200`
- `Content-Type` JSON
- cuerpo valido sin warnings PHP

**Step 3: Confirmar claves minimas que consume el frontend**

Chequeos minimos:
- `api/get_products.php` devuelve `menuCategories`, `menuProducts`, `featuredProducts`, `promotionCards`
- `api/get_settings.php` devuelve el payload esperado por la home
- `api/promotions/list.php` devuelve `promotionCards`

**Step 4: Si algo falla, no se toca el frontend**

Todo ajuste se hace en `api/` o en la base de datos. `src/` sigue congelado durante esta fase.

---

### Task 5: Validar escritura real sin contaminar la web publica

**Files:**
- Verify: `api/auth/login.php`
- Verify: `api/auth/verify.php`
- Verify: `api/products/create.php`
- Verify: `api/products/update.php`
- Verify: `api/products/delete.php`
- Verify: `api/promotions/update.php`
- Verify: `api/upload.php`
- Reference: `api/setup_admin.php`

**Step 1: Entrar con un usuario admin real**

Si no existe un admin utilizable en Hostinger, crear uno con `api/setup_admin.php` antes de seguir.

**Step 2: Crear un registro canary oculto para productos**

La prueba de creacion debe usar un nombre prefijado, por ejemplo `__SYSTEM_CHECK__`, y enviar `active = 0`. Esto es clave porque `api/get_products.php` solo expone `menu_products.active = 1`, asi que el frontend no lo mostrara.

**Step 3: Probar update sobre ese mismo registro oculto**

Actualizar:
- `name`
- `price`
- `description`
- `image`
- `alt_text`
- `image_title`
- `sort_order`

El registro sigue oculto al mantenerse con `active = 0` o al eliminarse al terminar.

**Step 4: Probar delete sobre el canary**

Ejecutar la eliminacion y confirmar que el registro queda fuera del flujo operativo. Al final no debe quedar ningun producto `__SYSTEM_CHECK__`.

**Step 5: Probar promociones sin tocar tarjetas visibles**

No se modifica una promo publica activa. Para probar `api/promotions/update.php` se crea primero una fila canary en `promotion_cards` con `active = 0` desde phpMyAdmin o desde el chequeo temporal, y solo entonces se prueba el update sobre esa fila oculta.

**Step 6: Probar upload con un archivo pequeno**

Subir una imagen de prueba ligera, confirmar que:
- la respuesta es correcta
- el archivo queda en la carpeta esperada
- el archivo de prueba se elimina al terminar

**Step 7: Limpiar todo**

Al cierre de esta tarea:
- no quedan productos canary
- no quedan promociones canary
- no quedan archivos de prueba

---

### Task 6: Verificar la integridad de la base de datos en phpMyAdmin

**Files:**
- Verify: `api/schema.sql`
- Verify: `api/migration_cms.php`
- Verify: `api/update_schema_alt.php`
- Verify: `api/update_schema_title.php`
- Verify: `api/update_schema_chef.php`
- Verify: `api/update_menu_product_sort_orders.php`

**Step 1: Revisar estructura real contra `api/schema.sql`**

Confirmar que la base en Hostinger coincide con la estructura esperada. Si hay desajustes, se aplica primero la migracion y luego se vuelve a chequear.

**Step 2: Confirmar llaves y orden**

Validar al menos:
- llaves primarias activas
- `AUTO_INCREMENT` donde aplica
- tipos numericos correctos para precios y orden
- `sort_order` consistente en `menu_products`

**Step 3: Ejecutar solo migraciones necesarias**

No correr scripts por costumbre. Solo los que hagan falta tras comparar la base real:
- `api/migration_cms.php`
- `api/update_schema_alt.php`
- `api/update_schema_title.php`
- `api/update_schema_chef.php`
- `api/update_menu_product_sort_orders.php`

**Step 4: Repetir snapshot despues de cambios**

Run:

```bash
php api/utils/export_database_snapshot.php docs/exports/database_snapshot_post_v3_validation.json
```

Expected: `ok = true`. Esto deja respaldo antes y despues.

---

### Task 7: Documentar la version 3.0 y dejar el repositorio limpio

**Files:**
- Modify: `README.md`
- Verify: `.gitignore`
- Keep as source of truth: `docs/plans/2026-03-04-backend-v3-0-hostinger-validation-plan.md`

**Step 1: Actualizar `README.md`**

Agregar:
- requisitos de Hostinger
- forma correcta de configurar `api/db_config.local.php`
- orden de despliegue
- forma de restaurar desde snapshots
- que archivos no deben subirse al repo

**Step 2: Confirmar que `.gitignore` bloquea temporales**

Debe seguir ignorando:
- `api/db_config.local.php`
- logs
- exports bajo `docs/exports/`

Si `api/system_check.php` se llega a crear tambien en local, se agrega a `.gitignore` antes de cualquier commit.

**Step 3: No subir basura de pruebas**

No se suben:
- capturas temporales
- dumps manuales fuera de `docs/exports/`
- tokens
- credenciales
- `api/system_check.php`

---

### Task 8: Hacer la verificacion final de integridad del frontend

**Files:**
- Verify only: `src/`
- Verify only: `public/`
- Verify only: `dist/`

**Step 1: Navegacion rapida final**

Revisar:
- `/`
- `/carta`
- `/admin/login`

**Step 2: Confirmar que la carta sigue viva**

Validar visualmente:
- las categorias cargan
- los productos cargan
- no aparecen productos canary
- no hay saltos visuales nuevos

**Step 3: Confirmar que el admin sigue operativo**

Login correcto, sin errores de sesion, sin respuestas 500.

**Step 4: Criterio de cierre**

Solo se considera lista la v3.0 si:
- backend validado en Hostinger
- base de datos coherente
- frontend intacto
- sin archivos temporales en servidor
- con documentacion actualizada

---

## Release Gate para GitHub v3.0

Solo cuando las 8 tareas esten cerradas:

1. Crear commit final de backend validado.
2. Crear tag anotado `v3.0`.
3. Subir commit y tag al remoto.
4. Mantener tambien el tag `stable-pre-optimization-2026-03-04` como rollback historico.

## Riesgos controlados por este plan

- Romper el frontend mientras se prueba backend: evitado al no tocar `src/`, `public/` ni `dist/`.
- Ensuciar el proyecto con tests nuevos: evitado al reutilizar `api/tests/` solo en local y usar un unico chequeo temporal en servidor.
- Exponer datos o credenciales: evitado al usar `api/db_config.local.php`, `.gitignore` y snapshots ignorados.
- Alterar contenido visible al probar CRUD: evitado usando registros canary ocultos con `active = 0`.

## Resultado esperado

Al terminar este plan tendras:
- backend comprobado en el hosting real
- base de datos auditada y respaldada
- frontend blindado
- una ruta de rollback clara
- una base limpia para publicar GitHub v3.0 y seguir luego con mejoras de interfaz
