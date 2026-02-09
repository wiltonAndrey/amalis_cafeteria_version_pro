# Hostinger Go-Live Task (DB + Admin + Validación)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dejar el despliegue de Hostinger listo para producción con base de datos conectada, admin operativo y validación completa de endpoints/CRUD/uploads.

**Architecture:** Se usa backend PHP + MySQL existente. El frontend consume `/api/get_products.php` para la carta y el panel admin autenticado usa `/api/auth/*`, `/api/products/*` y `/api/upload.php`.

**Tech Stack:** Hostinger (PHP 8 + MySQL), phpMyAdmin, React/Vite build.

---

### Task 1: Configurar credenciales DB en servidor

**Files:**
- Create (server): `api/db_config.local.php` (si no usas variables de entorno)
- Reference: `api/db_config.local.php.example`

**Step 1: Elegir método de configuración**

1. `ENV` en Hostinger:
   - `DB_HOST`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
2. Archivo local en servidor:
   - Crear `api/db_config.local.php` (NO commitear).

**Step 2: Validar conexión**

Run:
- `GET /api/get_products.php`

Expected:
- JSON válido.
- Sin errores `Access denied` o `PDOException`.

---

### Task 2: Aplicar base de datos (schema + migration)

**Files:**
- Apply: `api/schema.sql`
- Run: `api/migration_cms.php`
- Optional: `api/update_schema_alt.php`, `api/update_schema_title.php`

**Step 1: Aplicar esquema**

Desde phpMyAdmin:
- Ejecutar `api/schema.sql`.

**Step 2: Ejecutar migración CMS**

Si hay CLI:
- `php api/migration_cms.php`

Si no hay CLI:
- Ejecutar el contenido equivalente desde panel SQL.

**Step 3: Validación de tablas y columnas**

Expected:
- `menu_products` existe.
- Columnas `alt_text` e `image_title` existen.
- Tablas CMS (`hero`, `features`, `philosophy`, `testimonials`, `settings`) existen.

---

### Task 3: Crear/actualizar admin con setup script

**Files:**
- Run: `api/setup_admin.php`

**Step 1: Ejecutar bootstrap admin**

CLI:
- `php api/setup_admin.php --email=admin@tu-dominio.com --password=TuPasswordSegura123!`

HTTP (si no hay CLI):
- `POST /api/setup_admin.php` con `email` y `password`.

**Step 2: Verificar login endpoint**

Run:
- `POST /api/auth/login.php` con JSON `{ "email": "...", "password": "..." }`

Expected:
- `{ "ok": true, "admin": ... }`

---

### Task 4: Pruebas obligatorias de endpoints y flujo admin

**Files:**
- Test endpoints: `api/get_products.php`, `api/auth/login.php`, `api/products/create.php`, `api/products/update.php`, `api/products/delete.php`, `api/upload.php`

**Step 1: Probar endpoint público**

Run:
- `GET /api/get_products.php`

Expected:
- Incluye `menuProducts` con productos.

**Step 2: Probar login UI**

Run:
- Abrir `/admin/login`
- Iniciar sesión con admin creado.

Expected:
- Accede al panel `/admin`.

**Step 3: Probar CRUD completo**

1. Crear producto.
2. Editar producto (`name`, `image`, `alt_text`, `image_title`).
3. Eliminar producto.

Expected:
- Operaciones exitosas.
- Cambios reflejados en `/carta`.

**Step 4: Probar upload**

1. Subir imagen válida PNG/JPG/WebP.
2. Intentar archivo >5MB.

Expected:
- Válida: URL `/images/uploads/...`.
- >5MB: error controlado.

---

### Task 5: Validación final con checklist oficial

**Files:**
- Follow: `docs/plans/hostinger-deploy-checklist.md`

**Step 1: Ejecutar checklist completo**

Revisar todos los puntos de:
- `docs/plans/hostinger-deploy-checklist.md`

**Step 2: Evidencia mínima**

Guardar capturas o notas de:
1. `/api/get_products.php` ok.
2. `/admin/login` ok.
3. Crear/editar/borrar producto ok.
4. Upload ok.

---

## Definition of Done

1. BD conectada en Hostinger sin credenciales hardcodeadas en repo.
2. `schema.sql` + `migration_cms.php` aplicados.
3. Admin creado por `setup_admin.php`.
4. `/api/get_products.php` responde correctamente.
5. `/admin/login` y CRUD de productos operativos.
6. Subida de imagen funcionando en `/images/uploads`.
7. Checklist `docs/plans/hostinger-deploy-checklist.md` completado.

