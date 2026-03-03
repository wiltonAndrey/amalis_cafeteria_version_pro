# Plan de Implementacion para Reconstruir la Carta

> **Para Claude:** SUB-SKILL OBLIGATORIA: Usa `superpowers:executing-plans` para implementar este plan tarea por tarea.

**Objetivo:** Reconstruir la experiencia de `/carta` para que vuelva a ser visualmente coherente, mantenga el contrato de UX aprobado y deje de depender de la mezcla entre datos fallback del frontend y datos desactualizados del CMS.

**Arquitectura:** Mantener la estructura actual de rutas en React y los endpoints existentes del CMS en PHP, pero tratar la pagina de menu como una superficie acotada con un contrato de UI fijo. Primero se bloquea el contrato de datos, luego se reconstruye el shell de la pagina, despues se ajusta el comportamiento de cards y modal, y por ultimo se alinea el payload del backend para que la UI deje de cambiar segun que fuente de datos gane.

**Stack Tecnologico:** React 19, TypeScript, Vite, Vitest, Framer Motion, PHP, MySQL

---

### Tarea 1: Congelar El Contrato Objetivo

**Archivos:**
- Modificar: `docs/plans/2026-03-02-carta-rebuild-plan.md`
- Inspeccionar: `src/pages/Menu.tsx`
- Inspeccionar: `src/components/ui/ProductCard.tsx`
- Inspeccionar: `src/components/ProductModal.tsx`
- Inspeccionar: `src/hooks/useMenuProducts.ts`
- Inspeccionar: `api/get_products.php`

**Paso 1: Capturar el comportamiento actual de la ruta**

Abrir: `http://127.0.0.1:3000/carta`

Esperado: La ruta actual `/carta` carga, aunque la UI este mal.

**Paso 2: Escribir en este plan el contrato de UI no negociable**

Documentar estas restricciones antes de tocar codigo:
- La pagina debe tener una unica zona hero clara.
- La navegacion por categorias debe ser legible en desktop y mobile.
- Las cards de producto deben verse consistentes y no depender de campos faltantes del backend.
- El contenido del modal debe abrirse desde las cards y cerrarse de forma predecible.
- Los datos del backend pueden enriquecer la pagina, pero no deben degradar el layout aprobado.

**Paso 3: Crear una checklist visual corta**

Agregar una checklist en este archivo para:
- hero
- carril de categorias
- densidad del grid
- copy de las cards
- comportamiento del modal
- estado vacio

**Paso 4: Hacer commit de la base de planificacion**

```bash
git add docs/plans/2026-03-02-carta-rebuild-plan.md
git commit -m "docs: freeze carta rebuild contract"
```

### Tarea 2: Bloquear Primero El Contrato De Datos Del Menu

**Archivos:**
- Modificar: `src/types.ts`
- Modificar: `src/constants.tsx`
- Modificar: `src/hooks/useMenuProducts.ts`
- Modificar: `src/test/useMenuProducts.test.tsx`
- Crear: `src/test/menu_data_contract.test.ts`

**Paso 1: Escribir el test que debe fallar**

Crear `src/test/menu_data_contract.test.ts` con aserciones para:
- el conjunto canonico de categorias
- el orden estable de categorias
- soporte para `badge`
- soporte para entradas fallback solo de frontend como `bebidas`

Forma minima del test:

```ts
import { expect, it } from 'vitest';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../constants';

it('mantiene el contrato canonico de categorias de la carta', () => {
  expect(MENU_CATEGORIES.map((item) => item.id)).toEqual([
    'all',
    'ofertas',
    'tostadas',
    'bolleria',
    'bizcochos',
    'pasteles',
    'cocas',
    'empanadillas',
    'bebidas',
  ]);
  expect(MENU_PRODUCTS.some((item) => item.category === 'bebidas')).toBe(true);
});
```

**Paso 2: Ejecutar el test para verificar que falla**

Ejecutar: `npm run test:run -- src/test/menu_data_contract.test.ts`

Esperado: FAIL si el contrato aun no esta completamente bloqueado.

**Paso 3: Implementar el ajuste minimo del contrato**

Asegurarse de que:
- `src/types.ts` contiene la union completa de `MenuCategory`.
- `src/constants.tsx` define el orden canonico una sola vez.
- `src/hooks/useMenuProducts.ts` fusiona el payload del CMS en lugar de reemplazar los datos fallback.

**Paso 4: Ejecutar los tests para verificar que pasa**

Ejecutar: `npm run test:run -- src/test/menu_data_contract.test.ts src/test/useMenuProducts.test.tsx`

Esperado: PASS

**Paso 5: Commit**

```bash
git add src/types.ts src/constants.tsx src/hooks/useMenuProducts.ts src/test/useMenuProducts.test.tsx src/test/menu_data_contract.test.ts
git commit -m "fix: lock carta data contract"
```

### Tarea 3: Reconstruir El Shell De La Pagina En Una Sola Pasada

**Archivos:**
- Modificar: `src/pages/Menu.tsx`
- Crear: `src/test/menu_page_shell.test.tsx`

**Paso 1: Escribir el test que debe fallar**

Crear `src/test/menu_page_shell.test.tsx` que verifique:
- que se renderiza el heading del hero
- que se renderiza la navegacion de categorias
- que el grid renderiza productos
- que el estado vacio solo aparece cuando el resultado filtrado esta vacio

Forma minima del test:

```tsx
import { render, screen } from '@testing-library/react';
import Menu from '../pages/Menu';

it('renderiza el shell de la carta con hero, categorias y grid de productos', async () => {
  render(<Menu />);
  expect(screen.getByRole('heading', { name: /nuestra carta/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /categorias del menu/i })).toBeInTheDocument();
});
```

**Paso 2: Ejecutar el test para verificar que falla**

Ejecutar: `npm run test:run -- src/test/menu_page_shell.test.tsx`

Esperado: FAIL hasta que el shell se simplifique y estabilice.

**Paso 3: Implementar la reconstruccion minima**

En `src/pages/Menu.tsx`:
- simplificar el estado para dejar solo lo que la pagina realmente necesita
- mantener un solo bloque hero
- mantener un solo carril de categorias
- mantener un solo grid de productos
- eliminar complejidad accidental que solo existe por experimentos previos de rendimiento
- preservar labels de accesibilidad e interaccion mobile

**Paso 4: Ejecutar el test para verificar que pasa**

Ejecutar: `npm run test:run -- src/test/menu_page_shell.test.tsx`

Esperado: PASS

**Paso 5: Commit**

```bash
git add src/pages/Menu.tsx src/test/menu_page_shell.test.tsx
git commit -m "feat: rebuild carta page shell"
```

### Tarea 4: Reconstruir Juntos La UX De Cards Y Modal

**Archivos:**
- Modificar: `src/components/ui/ProductCard.tsx`
- Modificar: `src/components/ProductModal.tsx`
- Modificar: `src/components/ProductModalTabs.tsx`
- Crear: `src/test/menu_card_modal.test.tsx`

**Paso 1: Escribir el test que debe fallar**

Crear `src/test/menu_card_modal.test.tsx` que verifique:
- la card renderiza titulo, precio, badge y descripcion
- hacer click en una card abre el modal
- el modal se cierra con Escape y con la accion de cierre

**Paso 2: Ejecutar el test para verificar que falla**

Ejecutar: `npm run test:run -- src/test/menu_card_modal.test.tsx`

Esperado: FAIL

**Paso 3: Implementar la reconstruccion minima**

En los componentes de card y modal:
- definir una jerarquia visual estable
- hacer que los campos opcionales faltantes degraden con elegancia
- evitar saltos de layout causados por copy largo o metadata de imagen faltante
- mantener el acceso por teclado como requisito de primera clase

**Paso 4: Ejecutar los tests para verificar que pasa**

Ejecutar: `npm run test:run -- src/test/menu_card_modal.test.tsx`

Esperado: PASS

**Paso 5: Commit**

```bash
git add src/components/ui/ProductCard.tsx src/components/ProductModal.tsx src/components/ProductModalTabs.tsx src/test/menu_card_modal.test.tsx
git commit -m "feat: rebuild carta card and modal ux"
```

### Tarea 5: Alinear El Payload Del Backend Con El Contrato Del Frontend

**Archivos:**
- Modificar: `api/get_products.php`
- Modificar: `api/schema.sql`
- Crear: `api/tests/get_products_carta_contract.test.php`

**Paso 1: Escribir el test de backend que debe fallar**

Crear `api/tests/get_products_carta_contract.test.php` que verifique:
- `menuCategories` devuelve las categorias visibles canonicas
- `menuProducts` incluye las categorias soportadas
- la forma del payload incluye los campos que espera el frontend

Forma minima del test:

```php
<?php
$json = shell_exec('php api/get_products.php');
$data = json_decode($json, true);
if (!is_array($data['menuCategories'] ?? null)) {
  fwrite(STDERR, "menuCategories missing\n");
  exit(1);
}
```

**Paso 2: Ejecutar el test para verificar que falla**

Ejecutar: `php api/tests/get_products_carta_contract.test.php`

Esperado: FAIL si el payload del CMS esta desactualizado o incompleto.

**Paso 3: Implementar la alineacion minima del backend**

Actualizar:
- datos semilla del esquema para `menu_categories`
- datos semilla del esquema para `menu_products`
- mapeo de `api/get_products.php` para que la salida coincida con el contrato del frontend

No redisenar el CMS aqui. Solo hacer que coincida con el contrato bloqueado.

**Paso 4: Ejecutar la verificacion del backend**

Ejecutar: `php api/tests/get_products_carta_contract.test.php`

Esperado: PASS

**Paso 5: Commit**

```bash
git add api/get_products.php api/schema.sql api/tests/get_products_carta_contract.test.php
git commit -m "fix: align carta cms payload"
```

### Tarea 6: Verificacion Completa De Regresion

**Archivos:**
- Verificar: `src/test/useMenuProducts.test.tsx`
- Verificar: `src/test/menu_data_contract.test.ts`
- Verificar: `src/test/menu_page_shell.test.tsx`
- Verificar: `src/test/menu_card_modal.test.tsx`
- Verificar: `api/tests/get_products_carta_contract.test.php`

**Paso 1: Ejecutar los tests frontend enfocados**

Ejecutar: `npm run test:run -- src/test/useMenuProducts.test.tsx src/test/menu_data_contract.test.ts src/test/menu_page_shell.test.tsx src/test/menu_card_modal.test.tsx`

Esperado: PASS

**Paso 2: Ejecutar la suite completa de frontend**

Ejecutar: `npm run test:run`

Esperado: PASS

**Paso 3: Ejecutar un build de produccion**

Ejecutar: `npm run build`

Esperado: PASS

**Paso 4: Ejecutar la comprobacion del contrato de backend**

Ejecutar: `php api/tests/get_products_carta_contract.test.php`

Esperado: PASS

**Paso 5: Verificacion manual en navegador**

Abrir:
- `http://127.0.0.1:3000/carta`
- ancho desktop
- ancho mobile

Confirmar:
- el hero se lee con claridad
- el carril de categorias es usable
- las cards se sienten consistentes
- el modal abre y cierra correctamente
- los datos del backend no degradan visualmente la pagina

**Paso 6: Commit de la reconstruccion terminada**

```bash
git add .
git commit -m "feat: rebuild carta"
```
