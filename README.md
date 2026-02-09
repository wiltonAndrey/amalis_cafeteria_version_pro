<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1z0mlakybQ6Clj91BQtp70LYA72cv3iY-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Hostinger Deployment (PHP + MySQL)

This project is compatible with shared hosting using PHP and MySQL.

1. Upload project files including `api/`, `public/`, and frontend build output (`dist/`).
2. Configure DB credentials via environment variables (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`) or local server file `api/db_config.local.php`.
3. Apply DB schema from `api/schema.sql` and run migrations if needed (`api/migration_cms.php`).
4. Create admin credentials with:
   `php api/setup_admin.php --email=admin@tu-dominio.com --password=TuPasswordSegura123!`
5. Verify:
   - `/api/get_products.php`
   - `/admin/login`
   - Product CRUD and image uploads.

Detailed deployment validation checklist: `docs/plans/hostinger-deploy-checklist.md`.
