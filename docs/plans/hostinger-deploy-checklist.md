# Hostinger Deploy Checklist (PHP + MySQL)

## 1. Upload project files

- Upload `api/`, `public/`, `dist/` and root frontend files required by your host setup.
- Ensure `api/` is reachable (for example `https://tu-dominio.com/api/get_products.php`).

## 2. Configure database credentials

- Preferred: define env vars in Hostinger:
  - `DB_HOST`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASS`
- Alternative: create `api/db_config.local.php` on server (do not commit it).

## 3. Apply schema and CMS migration

- Run `api/schema.sql` in phpMyAdmin (or MySQL CLI).
- Run `php api/migration_cms.php` if CLI is available.
- If needed, run:
  - `php api/update_schema_alt.php`
  - `php api/update_schema_title.php`

## 4. Create/update admin user

- CLI:
  - `php api/setup_admin.php --email=admin@tu-dominio.com --password=TuPasswordSegura123!`
- Verify login endpoint works:
  - `POST /api/auth/login.php` with JSON `{ "email": "...", "password": "..." }`

## 5. Validate public menu

- Open `/carta`.
- Confirm products are coming from DB (not hardcoded fallback only).
- Verify `GET /api/get_products.php` returns `menuProducts` with data.

## 6. Validate admin flow

- Open `/admin/login`.
- Login with admin credentials.
- Create one product.
- Edit that product (name + image + alt_text + image_title).
- Delete one product.
- Return to `/carta` and confirm changes.

## 7. Validate uploads

- Upload PNG/JPG/WebP from admin modal.
- Confirm uploaded path uses `/images/uploads/...`.
- Confirm files larger than 5MB are rejected.

## 8. Final smoke checks

- Home (`/`) loads correctly.
- Menu (`/carta`) loads correctly.
- Admin (`/admin`) requires auth and works after login.
- No PHP fatal errors in Hostinger error logs.

