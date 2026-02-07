# Plan de Implementación de CMS Pro Amalis

> **Para el Agente:** SUB-SKILLS REQUERIDOS: 
> - Usar `@writing-plans` para la creación de micro-tareas de 2-5 min.
> - Usar `@test-driven-development` (TDD) para cada funcionalidad nueva.
> - Usar `@systematic-debugging` para la resolución de errores en API/React.

**Objetivo:** Crear un sistema dinámico (CMS) para Amalis Cafetería que permita gestionar productos, SEO y contenidos mediante un panel administrativo, manteniendo el diseño actual y asegurando el rendimiento en Hostinger.

**Arquitectura:** 
- **Backend:** PHP 8.x (API REST) con PDO para MySQL.
- **Frontend:** React + Vite, consumiendo la API con hooks personalizados y fallback a datos estáticos.
- **Media:** Sistema de subida con redimensionamiento automático para optimización.

**Stack Tecnológico:** PHP, MySQL, React, Vite, Tailwind CSS, Framer Motion.

---

## 🛠 Micro-Tareas Detalladas

### Tarea 1: Estructura de Datos y Conexión
**Archivos:**
- Crear: `api/db_config.php`
- Crear: `api/bootstrap.php`

**Paso 1: Ejecutar SQL** (Previamente definido en Master Plan)
**Paso 2: Configurar PDO** con manejo de errores y UTF-8.
**Paso 3: Configurar Headers CORS** para permitir comunicación con el frontend.

### Tarea 2: API de Lectura (Productos y Ajustes)
**Archivos:**
- Crear: `api/get_products.php`
- Crear: `api/get_settings.php`

**Paso 1: Implementar endpoints** que retornen JSON para la carta y configuraciones SEO/Contacto.

### Tarea 3: Integración React (Hooks y Fallback)
**Archivos:**
- Crear: `src/hooks/useCMS.ts`
- Modificar: `src/components/ProductGrid.tsx`

**Paso 1: Crear hook `useCMS`** que gestione el estado de carga y el fallback a `constants.tsx` si la API no está disponible.
**Paso 2: Conectar componentes** principales (Carta, Hero, Contacto) a los nuevos hooks.

### Tarea 4: Seguridad y Autenticación Admin
**Archivos:**
- Crear: `api/auth/login.php`
- Crear: `api/auth/verify.php`

**Paso 1: Implementar login** con `password_verify`.
**Paso 2: Middleware de validación** de sesión para endpoints de escritura.

### Tarea 5: Panel de Administración (Frontend)
**Archivos:**
- Crear: `src/pages/Admin.tsx`
- Crear: `src/components/admin/ProductCRUD.tsx`

**Paso 1: Crear Dashboard** administrativo con Tailwind.
**Paso 2: Implementar formularios** de edición para productos y SEO.

---

## 📈 Mejoras de Calidad Incluidas
- **Optimización de Imágenes**: Redimensionamiento automático en PHP para no sobrecargar el almacenamiento.
- **Modo Resiliente**: La web nunca se romperá si el backend falla (usa datos estáticos por defecto).
- **Seguridad Pro**: Protección contra inyección SQL y hashing de seguridad para la administración.

## 🏁 Plan de Verificación
1. **Verificar Endpoints**: Usar `curl` o navegador para confirmar que los JSON son correctos.
2. **Prueba de Fallback**: Renombrar la carpeta `/api` temporalmente y asegurar que la web cargue los datos de respaldo.
3. **Prueba de Carga**: Subir una imagen de 5MB y verificar que el servidor la procese y redimensionone correctamente.
