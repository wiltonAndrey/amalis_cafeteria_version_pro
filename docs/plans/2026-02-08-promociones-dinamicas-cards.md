# Gestion Dinamica de Tarjetas de Promocion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Permitir editar desde Admin, de forma individual, todos los campos de cada tarjeta de promociones sin cambiar la estructura visual actual de la web.

**Architecture:** Crear un modelo CMS dedicado para promociones (`promotion_cards`) y conectarlo a frontend/home + panel admin. Mantener el diseno existente de `PromotionsSection` y sustituir unicamente la fuente de datos (de hardcoded a API con fallback local). Separar este flujo del CRUD de productos para evitar acoplamiento y regresiones.

**Tech Stack:** React + TypeScript + Vitest + PHP + MySQL.

---

## 1) Brainstorming resumido (opciones y decision)

### Opcion A (rapida): reutilizar `menu_products` categoria `ofertas`
- Pros: menos tablas nuevas.
- Contras: mezcla promociones con productos de carta; faltan campos propios (`badge`, `availability_text`, `cta_url`, SEO de imagen); mas deuda tecnica.

### Opcion B (recomendada): tabla dedicada `promotion_cards`
- Pros: modelo claro, editable por card, escalable, sin romper `menu_products`.
- Contras: requiere endpoints y UI admin nuevos.

### Opcion C (minima): JSON en `settings`
- Pros: migracion rapida.
- Contras: validacion pobre, peor mantenibilidad, testing mas fragil.

**Decision:** Opcion B.

---

## 2) Alcance funcional exacto

Cada tarjeta de promocion gestionara estos campos:
- `badge` (etiqueta superior)
- `image` (imagen del pack, con subida)
- `image_alt` (texto ALT SEO de la imagen)
- `image_title` (atributo TITLE SEO de la imagen)
- `title` (nombre de promocion)
- `price` (numerico)
- `description` (texto)
- `items` (lista dinamica de componentes)
- `availability_text` (footer horario/dias)
- `cta_url` (enlace del boton)
- `cta_label` (texto del boton)

No entra en alcance:
- Rediseno visual de `PromotionsSection`.
- Cambios en flujo de productos de carta.

---

## 3) Habilidades a usar (obligatorio por fase)

- Proceso: `brainstorming` -> `writing-plans` -> `test-driven-development` -> `verification-before-completion`.
- SQL y modelo de datos: `mysql-best-practices`.
- API y validaciones backend: `php-best-practices` + `manejando-errores`.
- Ejecucion de cada bloque: `test-driven-development` (test primero).
- Si aparece un fallo no esperado: `systematic-debugging` antes de tocar codigo.

---

## 4) Plan en microtareas (2-5 min) con test despues de cada bloque

### Task 1: Contrato de datos frontend

**Skill principal:** `test-driven-development`

**Files:**
- Modify: `src/types.ts`
- Modify: `src/constants.tsx`
- Create: `src/test/usePromotionCards.test.tsx`

**Microtareas:**
1.1 Escribir test que falle para shape `PromotionCard` + fallback con 3 cards.
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: FAIL.

1.2 Crear tipo `PromotionCard` en `src/types.ts` con campos SEO (`image_alt`, `image_title`).
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: FAIL parcial.

1.3 Crear `PROMOTION_CARDS` en `src/constants.tsx` con las 3 promociones actuales.
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: PASS.

1.4 Commit task.
- Run: `git add src/types.ts src/constants.tsx src/test/usePromotionCards.test.tsx && git commit -m "test+feat: define promotion card contract and fallback"`

---

### Task 2: Persistencia DB promociones

**Skill principal:** `mysql-best-practices` + `test-driven-development`

**Files:**
- Modify: `api/schema.sql`
- Modify: `api/tests/schema.test.php`

**Microtareas:**
2.1 Extender `api/tests/schema.test.php` para exigir `promotion_cards` + columnas SEO.
- Run: `php api/tests/schema.test.php`
- Expected: FAIL.

2.2 Crear tabla `promotion_cards`:
- `id`, `badge`, `title`, `price DECIMAL(10,2)`, `description`, `image`, `image_alt`, `image_title`, `items JSON`, `availability_text`, `cta_label`, `cta_url`, `active`, `sort_order`.
- Run: `php api/tests/schema.test.php`
- Expected: FAIL parcial o PASS parcial.

2.3 Agregar seed inicial (Desayuno/Almuerzo/Merienda) con `sort_order`.
- Run: `php api/tests/schema.test.php`
- Expected: PASS.

2.4 Commit task.
- Run: `git add api/schema.sql api/tests/schema.test.php && git commit -m "feat(db): add promotion_cards schema with seo fields"`

---

### Task 3: API PHP promociones (list + update)

**Skill principal:** `php-best-practices` + `manejando-errores` + `test-driven-development`

**Files:**
- Create: `api/promotions/list.php`
- Create: `api/promotions/update.php`
- Modify: `api/get_products.php`
- Create: `api/tests/promotions_list.test.php`
- Create: `api/tests/promotions_update.test.php`

**Microtareas:**
3.1 Escribir test de listado (`promotionCards`, parse de `items`, campos SEO).
- Run: `php api/tests/promotions_list.test.php`
- Expected: FAIL.

3.2 Implementar `api/promotions/list.php` (cards activas y ordenadas).
- Run: `php api/tests/promotions_list.test.php`
- Expected: PASS.

3.3 Escribir test de update autenticado (id requerido, validacion de price y cta_url).
- Run: `php api/tests/promotions_update.test.php`
- Expected: FAIL.

3.4 Implementar `api/promotions/update.php` con validacion/sanitizacion y errores consistentes.
- Run: `php api/tests/promotions_update.test.php`
- Expected: PASS.

3.5 Incluir `promotionCards` en `api/get_products.php` para frontend unificado.
- Run: `php api/tests/get_products.test.php`
- Expected: PASS.

3.6 Commit task.
- Run: `git add api/promotions api/get_products.php api/tests/promotions_*.test.php && git commit -m "feat(api): add promotions endpoints with seo image fields"`

---

### Task 4: Hook frontend `usePromotionCards`

**Skill principal:** `test-driven-development`

**Files:**
- Create: `src/hooks/usePromotionCards.ts`
- Modify: `src/test/usePromotionCards.test.tsx`

**Microtareas:**
4.1 Escribir test de exito API (`promotionCards`).
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: FAIL.

4.2 Implementar hook base (`loading`, `error`, `cards`).
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: PASS parcial.

4.3 Escribir test de fallback por API caida/payload invalido.
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: FAIL.

4.4 Implementar fallback robusto a `PROMOTION_CARDS`.
- Run: `npm test -- src/test/usePromotionCards.test.tsx`
- Expected: PASS.

4.5 Commit task.
- Run: `git add src/hooks/usePromotionCards.ts src/test/usePromotionCards.test.tsx && git commit -m "feat(front): add resilient promotions hook"`

---

### Task 5: Conectar Home sin tocar layout

**Skill principal:** `test-driven-development`

**Files:**
- Modify: `src/components/sections/PromotionsSection.tsx`
- Create: `src/test/PromotionsSection.test.tsx`

**Microtareas:**
5.1 Escribir test de render: cards, precio, CTA y SEO (`alt`/`title`).
- Run: `npm test -- src/test/PromotionsSection.test.tsx`
- Expected: FAIL.

5.2 Cambiar hardcoded por `usePromotionCards`, manteniendo clases/estructura visual.
- Run: `npm test -- src/test/PromotionsSection.test.tsx`
- Expected: PASS parcial.

5.3 Ajustar formato de precio y fallback de `alt/title`.
- Run: `npm test -- src/test/PromotionsSection.test.tsx`
- Expected: PASS.

5.4 Commit task.
- Run: `git add src/components/sections/PromotionsSection.tsx src/test/PromotionsSection.test.tsx && git commit -m "feat(home): promotions section from cms data"`

---

### Task 6: Admin editor por tarjeta

**Skill principal:** `test-driven-development` + `php-best-practices` (consumo API validada)

**Files:**
- Create: `src/components/admin/PromotionCRUD.tsx`
- Create: `src/components/admin/AdminPromotionModal.tsx`
- Create: `src/hooks/usePromotionAdmin.ts`
- Modify: `src/pages/Admin.tsx`
- Create: `src/test/PromotionCRUD.test.tsx`

**Microtareas:**
6.1 Escribir test de listado admin + abrir modal.
- Run: `npm test -- src/test/PromotionCRUD.test.tsx`
- Expected: FAIL.

6.2 Implementar `PromotionCRUD` + `usePromotionAdmin` (load/update).
- Run: `npm test -- src/test/PromotionCRUD.test.tsx`
- Expected: PASS parcial.

6.3 Implementar modal con campos completos:
- `badge`, `image`, `image_alt`, `image_title`, `title`, `price`, `description`, `items`, `availability_text`, `cta_label`, `cta_url`.
- Run: `npm test -- src/test/PromotionCRUD.test.tsx`
- Expected: PASS parcial o PASS.

6.4 Integrar bloque promociones en `src/pages/Admin.tsx`.
- Run: `npm test -- src/test/PromotionCRUD.test.tsx`
- Expected: PASS.

6.5 Commit task.
- Run: `git add src/components/admin src/hooks/usePromotionAdmin.ts src/pages/Admin.tsx src/test/PromotionCRUD.test.tsx && git commit -m "feat(admin): editable promotion cards panel"`

---

### Task 7: Regresion y cierre con evidencia

**Skill principal:** `verification-before-completion` (+ `systematic-debugging` si falla algo)

**Files:**
- Modify: `src/test/integration.test.tsx` (si aplica)
- Optional doc: `README.md`

**Microtareas:**
7.1 Correr tests frontend completos.
- Run: `npm run test:run`
- Expected: PASS.

7.2 Correr tests backend relacionados.
- Run: `php api/tests/get_products.test.php`
- Run: `php api/tests/promotions_list.test.php`
- Run: `php api/tests/promotions_update.test.php`
- Expected: PASS.

7.3 Correr build de produccion.
- Run: `npm run build`
- Expected: PASS.

7.4 Si falla algo: aplicar `systematic-debugging`, corregir y repetir 7.1-7.3.

7.5 Commit final.
- Run: `git add src/test/integration.test.tsx README.md && git commit -m "test: verify promotions cms end-to-end stability"`

---

## 5) Validaciones de aceptacion (checklist)

- [ ] Cada tarjeta se puede editar de forma individual en Admin.
- [ ] Se puede cambiar badge, imagen, titulo, precio y descripcion.
- [ ] Lista de componentes soporta alta/baja de items.
- [ ] Footer de disponibilidad editable.
- [ ] Enlace del boton configurable y renderizado en Home.
- [ ] Texto SEO `image_alt` y `image_title` editable por tarjeta.
- [ ] `PromotionsSection` conserva la misma estructura visual.
- [ ] Si CMS falla, Home usa fallback estatico sin romper UI.
- [ ] El CRUD de productos actual sigue operando igual.

---

## 6) Riesgos y mitigacion

- Riesgo: codificacion de tildes/ene en DB.
  - Mitigacion: `utf8mb4` + `JSON_UNESCAPED_UNICODE`.
- Riesgo: enlaces CTA invalidos.
  - Mitigacion: validar formato URL/ruta antes de guardar.
- Riesgo: estado de repo ya modificado (dirty worktree).
  - Mitigacion: aislar commits por task y no mezclar cambios ajenos.

---

## 7) Estimacion pragmatica

- Backend schema + API: 2-3 h
- Frontend hooks + seccion home: 1.5-2 h
- Admin UI promociones: 2-3 h
- Testing + regresion: 1.5-2 h
- Total: 7-10 h efectivas

