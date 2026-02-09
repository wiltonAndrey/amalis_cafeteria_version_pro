# Plan de Implementación: CMS y Correcciones Amalis

> **Para el Agente:** SKILLS REQUERIDOS: `planificando-proyectos`, `desarrollando-con-tdd`, `diseñando-ui-ux`, `manejando-errores`.

**Objetivo:** Transformar **toda la web** en un sistema 100% administrable con un **Panel de Control Categorizado** para facilitar la gestión.

**Arquitectura:** Backend PHP ligero (API REST), Frontend React (Hooks), MySQL.

---

## 🏗️ Fase 1: Cimientos del CMS (Base de Datos y API)

**Skill Principal:** `desarrollando-con-tdd`.

### Tarea 1.1: Migración de Base de Datos
**Objetivo:** Crear tablas para todas las secciones.
**Skill:** `manejando-errores`.

**Micro-pasos:**
- [x] **Paso 1 (Test):** Crear script de prueba `tests/db_migration_test.php`.
- [x] **Paso 2 (Implementación):** Crear `api/migration_cms.php` con SQL para:
    - `features` (4 Pilares)
    - `philosophy` (Filosofía)
    - `testimonials` (Testimonios)
    - `hero` (Portada)
    - `settings` (Configuración Global)
- [x] **Paso 3 (Verificación):** Ejecutar script y verificar tablas.

### Tarea 1.2: API Endpoints (CRUD)
**Objetivo:** Endpoints para leer y escribir datos de todas las secciones.
**Skill:** `desarrollando-con-tdd`.

**Micro-pasos:**
- [x] **TDD Ciclo**: Test -> Fail -> Code -> Pass para `api/features`, `api/philosophy`, `api/testimonials`, `api/settings`.

---

## 🎨 Fase 2: Integración Frontend (Componentes Dinámicos)

**Skill Principal:** `diseñando-ui-ux`.

### Tarea 2.1: Hooks Globales
- [x] **Implementar**: `useCMS.ts` con todos los hooks necesarios (`useHero`, `usePhilosophy`, etc.).

### Tarea 2.2: Conexión de Componentes
- [x] **Refactorizar**: `Hero.tsx`, `Features.tsx`, `Philosophy.tsx`, `Testimonials.tsx`, `Footer.tsx` para leer de la API.

---

## 🛠️ Fase 3: Panel de Administración (Categorizado)

**Skill Principal:** `diseñando-ui-ux` (CRÍTICO: Organización visual clara).

### Tarea 3.1: Dashboard con Pestañas/Categorías
**Objetivo:** El usuario debe ver claramente qué sección está editando.
**Diseño:** Implementar un sistema de **Tabs (Pestañas)** o **Tarjetas Grandes** en el Dashboard.

**Categorías Visuales:**
1.  **🏠 Portada (Home)**:
    - Editar Título Principal.
    - **Imagen de Fondo Héroe**.
2.  **🏛️ Pilares (Experiencia)**:
    - Editar los 4 textos e iconos.
3.  **💡 Filosofía**:
    - Editar Título, Texto.
    - **Imagen Principal Filosofía**.
4.  **💬 Testimonios**:
    - Añadir/Borrar testimonios con sus fotos.
5.  **⚙️ Configuración Global**:
    - Logo, Footer, Redes Sociales, Horarios.

### Tarea 3.2: Formularios Visuales
**Objetivo:** Que la edición sea intuitiva.
**Skill:** `diseñando-ui-ux`.

**Micro-pasos:**
- [x] **Vista Previa**: Al subir una imagen, mostrar una miniatura inmediata.
- [x] **Separación**: No mezclar "Héroe" con "Testimonios". Cada uno en su pestaña/página.

---

## 🐛 Fase 4: Validación Final y Bugs

**Skill Principal:** `depurando-sistematicamente`.

### Tarea 4.1: Barrido de Imágenes
- [x] **Revisión**: Asegurar que no quedan `src="/images/ static"` en el código.

---

## ✅ Lista de Verificación Final (Definition of Done)

- [x] **Panel Categorizado**: Navegación clara por secciones.
- [x] **CERO Hardcoding**: Todo editable.
- [x] **Proxy**: Subidas OK.
- [x] **Tests**: 100% Verde (Verificación Manual por entorno).
