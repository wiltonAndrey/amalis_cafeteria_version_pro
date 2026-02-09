# Hostinger Productos Admin Stabilization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dejar la carta conectada a MySQL y habilitar un panel admin estable para que el cliente cree, edite y elimine productos sin ayuda tecnica.

**Architecture:** Se mantiene la arquitectura actual (React + API PHP + MySQL). La carta publica lee `menu_products` via `api/get_products.php`. El panel admin usa sesion PHP y consume `api/products/create.php`, `api/products/update.php`, `api/products/delete.php` y `api/upload.php`. Se restaura UI admin desde el backup existente y se corrigen inconsistencias reales del backend.

**Tech Stack:** PHP 8.x, MySQL (PDO), React + Vite, Vitest, tests PHP por scripts.

---

## Approach Decision (already selected in this plan)

1. Repair existing implementation (recommended): fastest, reuses API and backup admin files, lowest risk on Hostinger.
2. Rebuild from zero: cleaner architecture, but slower and more regression risk.
3. Manual DB editing only: fastest short-term, but poor UX for client and high operational risk.

This plan uses option 1.

---

### Task 1: Establish failing baseline for product update bug

**Files:**
- Modify: `api/tests/products_update.test.php`

**Step 1: Write the failing test**

Add an assertion that updates `image`, `alt_text`, and `image_title` in one request and expects `ok = true`.

**Step 2: Run test to verify it fails**

Run: `php api/tests/products_update.test.php`  
Expected: FAIL with `db_error` or `invalid parameter number` behavior from current endpoint.

**Step 3: Commit test-only change**

```bash
git add api/tests/products_update.test.php
git commit -m "test(api): reproduce products update image-field failure"
```

---

### Task 2: Fix root cause in `api/products/update.php`

**Files:**
- Modify: `api/products/update.php`

**Step 1: Write minimal implementation**

Fix the `image` branch so it actually appends SQL field assignment before adding params:

```php
if (array_key_exists('image', $input)) {
  $image = Validator::string_trim($input['image']);
  if ($image === '') {
    $image = '/images/sections/editada-01.webp';
  }
  $fields[] = 'image = ?';
  $params[] = $image;
}
```

**Step 2: Run failing test again**

Run: `php api/tests/products_update.test.php`  
Expected: PASS.

**Step 3: Run related API tests**

Run:
- `php api/tests/products_create.test.php`
- `php api/tests/products_delete.test.php`
- `php api/tests/get_products.test.php`

Expected: all PASS.

**Step 4: Commit**

```bash
git add api/products/update.php
git commit -m "fix(api): restore image update binding in products endpoint"
```

---

### Task 3: Align schema and endpoint contract for optional SEO image fields

**Files:**
- Modify: `api/schema.sql`
- Modify: `api/tests/schema.test.php`

**Step 1: Write failing schema test**

Ensure `menu_products` has columns:
- `alt_text` (nullable varchar)
- `image_title` (nullable varchar)

**Step 2: Run test to verify it fails**

Run: `php api/tests/schema.test.php`  
Expected: FAIL when columns are absent.

**Step 3: Minimal schema update**

Add missing columns to `CREATE TABLE menu_products`:

```sql
alt_text VARCHAR(255) DEFAULT NULL,
image_title VARCHAR(255) DEFAULT NULL,
```

Also include safe migration block (idempotent) for existing DBs:

```sql
ALTER TABLE menu_products ADD COLUMN alt_text VARCHAR(255) DEFAULT NULL;
ALTER TABLE menu_products ADD COLUMN image_title VARCHAR(255) DEFAULT NULL;
```

(Guard with `IF NOT EXISTS` if server version allows it; otherwise handle in migration script.)

**Step 4: Re-run schema test**

Run: `php api/tests/schema.test.php`  
Expected: PASS.

**Step 5: Commit**

```bash
git add api/schema.sql api/tests/schema.test.php
git commit -m "feat(db): align menu_products with alt_text and image_title fields"
```

---

### Task 4: Ensure admin bootstrap exists (first user creation)

**Files:**
- Create: `api/setup_admin.php`
- Modify: `api/tests/auth.test.php`

**Step 1: Write failing auth test case**

Add test path that:
1. Creates temp admin email/password hash.
2. Calls login flow.
3. Verifies session auth.

**Step 2: Implement one-time admin setup script**

`api/setup_admin.php` should:
- Accept email + password from POST or CLI args.
- Use `password_hash`.
- Insert with `INSERT ... ON DUPLICATE KEY UPDATE`.
- Return JSON `ok`.

**Step 3: Run test**

Run: `php api/tests/auth.test.php`  
Expected: PASS.

**Step 4: Commit**

```bash
git add api/setup_admin.php api/tests/auth.test.php
git commit -m "feat(auth): add admin bootstrap script and auth coverage"
```

---

### Task 5: Move DB password out of tracked default config

**Files:**
- Modify: `api/db_config.php`
- Create: `api/db_config.local.php.example`

**Step 1: Write failing config expectation test (optional script)**

Ensure production config does not ship with hardcoded secret in git.

**Step 2: Implement config loading**

`db_config.php` should:
1. Load env vars first.
2. If missing, try `db_config.local.php` (gitignored).
3. Final fallback only for local development placeholders.

**Step 3: Add local template**

`db_config.local.php.example` with clear keys and comments.

**Step 4: Commit**

```bash
git add api/db_config.php api/db_config.local.php.example
git commit -m "chore(config): remove hardcoded db secret from tracked config"
```

---

### Task 6: Restore product admin UI from backup (minimal scope)

**Files:**
- Create: `src/components/admin/AdminProductModal.tsx` (from backup, cleaned)
- Create: `src/components/admin/ProductCRUD.tsx` (from backup, cleaned)
- Create: `src/hooks/useProducts.ts` (from backup, cleaned)
- Create: `src/context/ToastContext.tsx` (from backup, minimal)
- Modify: `src/types.ts`

**Step 1: Write failing frontend tests**

Create:
- `src/test/ProductCRUD.test.tsx`
- `src/test/useProducts.test.tsx`

Cover:
- Empty state.
- Skeleton loading.
- Optimistic create/update/delete rollback behavior.

**Step 2: Run tests to verify RED**

Run:
- `npm test -- src/test/ProductCRUD.test.tsx`
- `npm test -- src/test/useProducts.test.tsx`

Expected: FAIL (components/hooks missing).

**Step 3: Implement minimal code from backup**

Keep only product CRUD flow. Do not include other editors yet.

**Step 4: Re-run tests (GREEN)**

Run same two commands; expected PASS.

**Step 5: Commit**

```bash
git add src/components/admin src/hooks/useProducts.ts src/context/ToastContext.tsx src/types.ts src/test/ProductCRUD.test.tsx src/test/useProducts.test.tsx
git commit -m "feat(admin): restore product CRUD UI and hooks from backup"
```

---

### Task 7: Add admin page + route guard

**Files:**
- Create: `src/pages/Admin.tsx`
- Create: `src/pages/AdminLogin.tsx`
- Create: `src/hooks/useAdminAuth.ts`
- Modify: `src/App.tsx`

**Step 1: Write failing integration tests**

Create:
- `src/test/AdminAuthFlow.test.tsx`

Scenarios:
- `/admin` without session redirects to `/admin/login`.
- Successful login displays `ProductCRUD`.

**Step 2: Run tests to verify RED**

Run: `npm test -- src/test/AdminAuthFlow.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal auth flow**

- `useAdminAuth.ts` wraps `/api/auth/verify.php`, `/api/auth/login.php`.
- `AdminLogin.tsx` form with email/password.
- `Admin.tsx` renders `ProductCRUD` only.
- Add routes:
  - `/admin/login`
  - `/admin`

**Step 4: Run test to verify GREEN**

Run: `npm test -- src/test/AdminAuthFlow.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/pages/Admin.tsx src/pages/AdminLogin.tsx src/hooks/useAdminAuth.ts src/App.tsx src/test/AdminAuthFlow.test.tsx
git commit -m "feat(admin): add login-protected admin routes"
```

---

### Task 8: Connect public menu to DB response (with safe fallback)

**Files:**
- Create: `src/hooks/useMenuProducts.ts`
- Modify: `src/pages/Menu.tsx`
- Modify: `src/test/integration.test.tsx`

**Step 1: Write failing integration tests**

Add two tests:
1. Uses API payload from `/api/get_products.php` when available.
2. Falls back to `MENU_PRODUCTS` if fetch fails.

**Step 2: Run RED**

Run: `npm run test:run -- src/test/integration.test.tsx`  
Expected: FAIL.

**Step 3: Implement minimal hook**

`useMenuProducts.ts`:
- `fetch('/api/get_products.php')`
- reads `menuProducts` and `menuCategories`
- on failure uses constants fallback.

`Menu.tsx` consumes this hook instead of hardcoded constants directly.

**Step 4: Run GREEN**

Run: `npm run test:run -- src/test/integration.test.tsx`  
Expected: PASS.

**Step 5: Commit**

```bash
git add src/hooks/useMenuProducts.ts src/pages/Menu.tsx src/test/integration.test.tsx
git commit -m "feat(menu): load menu products from api with fallback"
```

---

### Task 9: Harden upload endpoint for Hostinger runtime

**Files:**
- Modify: `api/upload.php`
- Modify: `api/tests/upload.test.php`

**Step 1: Add failing cases**

Test:
- Reject >5MB.
- Reject non-image MIME.
- Accept jpg/png/webp and return `201` with `url`.

**Step 2: Run RED**

Run: `php api/tests/upload.test.php`  
Expected: FAIL for at least one case.

**Step 3: Implement minimal fixes**

Keep current logic and add:
- explicit writable directory checks.
- clearer JSON errors for client toast mapping.

**Step 4: Run GREEN**

Run: `php api/tests/upload.test.php`  
Expected: PASS.

**Step 5: Commit**

```bash
git add api/upload.php api/tests/upload.test.php
git commit -m "fix(api): harden image upload for hostinger constraints"
```

---

### Task 10: Full verification gate before deployment

**Files:**
- Modify: `README.md` (deployment section)
- Create: `docs/plans/hostinger-deploy-checklist.md`

**Step 1: Run complete backend test suite**

Run:
- `php api/tests/connection.test.php`
- `php api/tests/schema.test.php`
- `php api/tests/get_products.test.php`
- `php api/tests/products_create.test.php`
- `php api/tests/products_update.test.php`
- `php api/tests/products_delete.test.php`
- `php api/tests/auth.test.php`
- `php api/tests/upload.test.php`

Expected: all PASS.

**Step 2: Run frontend tests**

Run: `npm run test:run`  
Expected: PASS.

**Step 3: Build frontend**

Run: `npm run build`  
Expected: exit code 0.

**Step 4: Write deploy checklist**

`docs/plans/hostinger-deploy-checklist.md`:
- Upload build + api folders.
- Configure DB credentials.
- Run `api/setup_db.php`.
- Run `api/setup_admin.php`.
- Verify `/api/get_products.php`.
- Verify `/admin/login`.
- Create, edit, delete one product and confirm appears in `/carta`.

**Step 5: Commit**

```bash
git add README.md docs/plans/hostinger-deploy-checklist.md
git commit -m "docs: add hostinger deployment and validation checklist"
```

---

## Definition of Done

1. Carta publica muestra productos de MySQL via API.
2. Cliente puede iniciar sesion en `/admin/login`.
3. Cliente puede crear, editar, borrar productos sin tocar codigo.
4. Subida de imagenes funciona y queda en `/images/uploads`.
5. Todos los tests backend/frontend pasan antes de despliegue.
6. Checklist Hostinger ejecutado en staging/produccion con evidencia.

---

## Risk Controls

1. No cambios en diseno global fuera del admin.
2. No refactor masivo durante estabilizacion.
3. No claims de "listo" sin comandos de verificacion ejecutados en esa misma sesion.
4. Si aparece un nuevo fallo, aplicar `systematic-debugging` antes de parchear.

