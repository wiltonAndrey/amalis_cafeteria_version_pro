# Plan Unificado CRUD Admin (MVP + Mejoras Escalonadas)

> **Para el Agente:** SUB-SKILL REQUERIDO: Usa `executing-plans` para implementar este plan tarea por tarea.
> **Tecnicas requeridas (MVP):** Usa `@test-driven-development` para logica backend/frontend. Usa `@ui-ux-pro-max` para el diseno del Modal de Admin. Usa `@manejando-errores` para respuestas API robustas.
> **Tecnicas avanzadas (mejoras):** React Query (TanStack Query) para estado de servidor, Toasts para feedback, validaciones avanzadas, seguridad extra.

**Objetivo:** Habilitar gestion completa de productos (crear, editar, borrar) y subida de imagenes desde el Panel de Administracion protegido, primero con un MVP funcional y luego con mejoras escalonadas.

**Stack:** PHP 8.x, MySQL (PDO), React, Tailwind CSS, Vitest. React Query o SWR (opcional para mejoras).

**Nota:** Si solo necesitas MVP rapido, completa hasta la Fase 2 y deja Fase 3-5 como backlog.

---

## Fase 0: Base Tecnica (recomendada)
**Meta:** Tener utilidades y middleware para respuestas consistentes y auth centralizada.

Archivos: `api/utils/Response.php`, `api/utils/Validator.php`, `api/middleware/Auth.php`, `src/context/ToastContext.tsx` (si no existe), `src/main.tsx` (si se usa React Query).

Pasos:
1. Crear `Response::json($data, $status = 200)` para respuestas JSON.
2. Crear `require_auth()` que valide `$_SESSION['admin_id']` y responda 401.
3. Crear `Validator` con helpers minimos (required, numeric, positive, string_trim).
4. Si se usara React Query en mejoras, configurar `QueryClientProvider` en `src/main.tsx`.
5. Si se usaran toasts, crear `ToastContext` con API simple `showToast(type, message)`.

---

## Fase 1: MVP Backend
### Tarea 1: Endpoint de subida de imagenes (basico)
Archivos: `api/upload.php`, `api/tests/upload.test.php`.

Pasos:
1. Escribir prueba que falla con una imagen valida y espera `{ url }`.
2. Implementacion minima: verificar session admin, validar `$_FILES['image']`, permitir solo imagenes por MIME declarado, mover a `public/images/uploads/`, retornar JSON con url.
3. Ejecutar prueba y dejarla en PASS.
4. Commit sugerido.
```
git add api/upload.php api/tests/upload.test.php
git commit -m "feat: endpoint basico de subida de imagenes"
```

### Tarea 2: Endpoint crear producto (basico)
Archivos: `api/products/create.php`, `api/tests/products_create.test.php`.

Pasos:
1. Prueba que falla con `name`, `price`, `category_id`, `description`.
2. Implementar INSERT en `menu_products` (usar tabla correcta) y retornar id.
3. Ejecutar prueba y PASS.
4. Commit sugerido.
```
git add api/products/create.php api/tests/products_create.test.php
git commit -m "feat: endpoint crear producto"
```

### Tarea 3: Endpoint editar producto (basico)
Archivos: `api/products/update.php`, `api/tests/products_update.test.php`.

Pasos:
1. Prueba que falla actualizando `id` y `name`.
2. Implementar UPDATE por id.
3. Ejecutar prueba y PASS.

### Tarea 4: Endpoint borrar producto (basico)
Archivos: `api/products/delete.php`, `api/tests/products_delete.test.php`.

Pasos:
1. Prueba que falla borrando por `id`.
2. Implementar soft delete `active = 0`.
3. Ejecutar prueba y PASS.

---

## Fase 2: MVP Frontend
### Tarea 5: Modal visual Admin
Archivos: `src/components/admin/AdminProductModal.tsx`, `src/test/components/AdminProductModal.test.tsx`.

Pasos:
1. Prueba que verifica inputs y boton Guardar.
2. Implementar modal visual con formulario y props `isOpen`, `onClose`, `product`, `onSave`.
3. Ejecutar prueba y PASS.
4. Commit sugerido.
```
git add src/components/admin/AdminProductModal.tsx src/test/components/AdminProductModal.test.tsx
git commit -m "feat: componente visual modal admin"
```

### Tarea 6: Integracion basica Modal + CRUD
Archivos: `src/components/admin/ProductCRUD.tsx`.

Pasos:
1. Integrar modal en `ProductCRUD`.
2. Implementar `handleCreate` y `handleUpdate` con `fetch('/api/products/...')`.
3. Prueba manual en navegador: crear, editar, borrar y ver tabla.

---

## Fase 3: Hardening Backend
**Meta:** Seguridad, validaciones y consistencia.

Tareas:
1. Upload seguro: validar MIME real con `finfo_file`, nombre unico, limite 5MB, retornar 201.
2. Validaciones create: `price` positivo, `name` requerido, `category_id` valido, transacciones DB.
3. Update idempotente: verificar existencia, permitir update parcial o completo.
4. Delete robusto: retornar 404 si no existe o ya esta borrado.
5. Respuestas consistentes usando `Response::json` y auth via `require_auth()`.

---

## Fase 4: Hardening Frontend
**Meta:** UX premium y estado de servidor.

Tareas:
1. Crear `src/hooks/useProducts.ts` con React Query y optimistic updates.
2. Implementar toasts para exito y error.
3. Mejoras UI del modal: validaciones en tiempo real, loading state, preview de imagen.
4. Tabla con loading skeleton y empty state.

---

## Fase 5: Verificacion Final
Pasos:
1. Probar uploads maliciosos y archivos grandes.
2. Probar errores de red y mensajes claros.
3. Verificar que la UI no se congela y que los estados se actualizan.
