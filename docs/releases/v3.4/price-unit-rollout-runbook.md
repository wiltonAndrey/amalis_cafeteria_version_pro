# Price Unit Rollout Runbook v3.4

Fecha objetivo: antes de salida a produccion  
Scope: rollout operativo de `price_unit` sin cambios funcionales adicionales

## Objetivo

- Dejar `menu_products.price_unit` disponible y saneado para convivir con datos legacy sin fabricar valores canonicos.
- Corregir el caso puntual de bizcochos que hoy siguen marcados como `unit` cuando el valor canonico real es `kg`.
- Validar que carta publica y admin consumen solo `price_unit` confiable cuando existe valor canonico real.

## Prechecks

- Confirmar backup reciente de base de datos antes de tocar esquema o datos.
- Confirmar acceso shell al entorno productivo y al mismo `PHP_BINARY` usado por el sitio.
- Confirmar que el repo desplegado incluye estos scripts:
  - `api/update_schema_price_unit.php`
  - `api/utils/repair_bizcocho_price_unit.php`
- Confirmar credenciales/entorno apuntando a la base de produccion correcta.
- Si existe mantenimiento o ventana de despliegue, habilitarla antes de aplicar cambios.

## Secuencia de migracion

Ejecutar en este orden exacto desde la raiz desplegada del proyecto:

```bash
php "api/update_schema_price_unit.php"
php "api/utils/repair_bizcocho_price_unit.php"
php "api/utils/repair_bizcocho_price_unit.php" --apply
```

Resultado esperado:

- `update_schema_price_unit.php` crea la columna si no existe, la deja nullable y limpia valores vacios o invalidos a `NULL`.
- `repair_bizcocho_price_unit.php` sin `--apply` devuelve JSON en modo `dry-run` con candidatos antes de mutar datos.
- `repair_bizcocho_price_unit.php --apply` devuelve JSON en modo `apply` y `updated_rows` mayor a `0` solo si habia bizcochos canonicos mal marcados.

## Validacion post-migracion

## Carta publica

- Abrir `/carta` y revisar al menos un bizcocho corregido por el repair.
- Validar que un producto con `price_unit = 'kg'` muestre precio por `100 g` y referencia por kilo en la descripcion.
- Validar que productos sin valor canonico real no inventen `price_unit` ni cambien su semantica legacy de precio.
- Revisar que productos unitarios sigan mostrando precio estandar sin regresiones visuales.

## Admin

- Abrir `/admin` y editar un producto con `price_unit = 'kg'` para confirmar que el selector refleja el valor guardado.
- Editar un producto legacy sin valor canonico real y confirmar que no aparece un valor falso persistido por la migracion.
- Guardar un cambio no relacionado en admin y verificar que no se sobreescribe `price_unit` cuando el payload lo omite.

## Rollback / mitigacion

- Si falla `update_schema_price_unit.php`, frenar rollout y restaurar desde backup antes de seguir.
- Si el `dry-run` devuelve candidatos inesperados, no correr `--apply`; revisar el JSON y cortar salida hasta confirmar IDs/nombres.
- Si `--apply` corrige filas incorrectas, restaurar esos registros desde backup o actualizar manualmente `price_unit` solo en los IDs afectados.
- Si hay inconsistencia visible en carta o admin, desactivar temporalmente la exposicion del cambio a negocio y conservar `price_unit` en `NULL` hasta validar el valor canonico real.

## Nota operativa

- `price_unit` solo debe considerarse confiable cuando existe un valor canonico real persistido (`kg` o `unit`).
- `NULL`, vacio, datos legacy o heuristicas historicas no deben tratarse como canonicos durante el go-live.
