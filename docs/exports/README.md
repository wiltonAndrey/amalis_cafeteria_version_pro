# Database Export Samples

Estos archivos son ejemplos sanitizados para documentar el formato de los exports locales.

Reglas de uso:
- Los exports reales generados desde la base de datos local no deben subirse al repositorio.
- Los archivos con fecha quedan ignorados por `.gitignore`.
- Usa estos ejemplos como referencia para validar estructura, no como respaldo real.

Comandos utiles:
```bash
php api/utils/export_database_snapshot.php docs/exports/database_snapshot_2026-03-03.json
php api/utils/restore_database_snapshot.php docs/exports/database_snapshot_2026-03-03.json --force
php api/tests/export_database_snapshot.test.php
php api/tests/restore_database_snapshot.test.php
```

Archivos incluidos:
- `sample_database_snapshot.json`: snapshot reducido con datos ficticios.
- `sample_menu_products_copy_active.json`: ejemplo del export de copy activo para productos.
- `sample_menu_products_chef_suggestions.sql`: ejemplo de actualizacion de sugerencias del chef.

Nota:
Los snapshots reales pueden incluir tablas sensibles como `admins`, sesiones o configuracion interna. Si necesitas compartir un export, primero sanitizalo y sustituye cualquier dato personal, credencial o hash.
