# Plan Maestro de Refinamiento Estetico (Desktop-First) - v2

> **Alcance obligatorio:** este plan aplica solo a escritorio (PC).  
> **Fuera de alcance:** ajustes responsive/mobile (se planifican en fase posterior).

## 1. Objetivo y criterios de exito

**Objetivo:** elevar legibilidad, consistencia visual, conversion a `/carta`, y mantenibilidad del codigo en Home sin romper el layout actual.

**Criterios de exito (medibles):**
- Todos los CTA clave navegan correctamente (`/carta` o ancla esperada).
- Hero y Navbar mantienen contraste legible en estado inicial (sin scroll).
- Secciones principales comparten jerarquia tipografica consistente.
- `FeaturedProducts` oculta precio en landing sin romper `ProductCard` en otras pantallas.
- `PromotionsSection` evita overflow de texto largo (`line-clamp`) y mantiene cards estables.
- Test suite objetivo pasa y `npm run build` finaliza sin errores.

---

## 2. Enfoque tecnico y de gestion

### 2.1 Estrategia tecnica
- Cambios incrementales por bloque funcional (Hero/Nav, Filosofia, Pilares, etc.).
- Validacion automatizada + validacion visual desktop al cerrar cada bloque.
- Refactor minimo y seguro: solo abstraer cuando reduzca duplicacion clara.

### 2.2 Estrategia de gestion
- Ejecutar en sprints cortos por bloque (1 bloque = 1 entregable verificable).
- Mantener registro de estado por bloque: `Pendiente -> En progreso -> En QA -> Cerrado`.
- No mezclar bloques en una sola PR/commit masivo.

---

## 3. Mapa de archivos impactados

**Componentes principales:**
- `src/components/Hero.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/WhyChooseUs.tsx`
- `src/components/sections/FeaturedProducts.tsx`
- `src/components/ui/ProductCard.tsx`
- `src/components/sections/PromotionsSection.tsx`
- `src/components/sections/CoffeeExperience.tsx`
- `src/components/Testimonials.tsx`
- `src/components/sections/LocationSection.tsx`

**Soporte (si aplica):**
- `src/components/ui/Button.tsx`
- `src/constants.tsx`
- `src/types.ts`

**Tests:**
- `src/test/components.test.tsx`
- `src/test/PromotionsSection.test.tsx`
- `src/test/integration.test.tsx`
- `src/test/landing_refinement.test.tsx` (nuevo, recomendado)

---

## 4. Hoja de ruta en micro-tareas (2-5 min cada una)

## Bloque 0 - Baseline y guardrails

**Objetivo:** preparar una base de comparacion y evitar regresiones.

**Micro-tareas:**
1. Confirmar estado actual del repo y registrar archivos con cambios previos.
2. Ejecutar tests base de referencia.
3. Ejecutar build base de referencia.
4. Capturar 5 screenshots desktop (Hero, Filosofia, Pilares, Promociones, Ubicacion).
5. Crear checklist de QA visual con items de contraste, espaciado y CTAs.

**Comandos:**
```bash
npm run test:run -- src/test/components.test.tsx src/test/PromotionsSection.test.tsx
npm run build
```

**Salida esperada:**
- Baseline documentado antes de tocar UI.

---

## Bloque 1 - Hero + Navbar (prioridad maxima)

**Archivos:**
- Modificar: `src/components/Hero.tsx`
- Modificar: `src/components/layout/Navbar.tsx`
- Modificar: `src/test/components.test.tsx`

**Micro-tareas:**
1. Ajustar overlay del Hero a gradiente mas oscuro en top (`coffee/90 -> transparent`).
2. Incrementar peso visual del H1 (shadow/size) sin cambiar copy.
3. Subir jerarquia del texto secundario (`text-xl` a `text-2xl` en desktop).
4. Verificar que botones del Hero mantengan contraste AA sobre imagen.
5. Ajustar enlaces de Navbar en estado inicial (`font-bold` o `text-shadow` sutil).
6. Verificar estado Navbar con y sin scroll para evitar choque de estilos.
7. Actualizar/crear test para validar presencia de clases clave de contraste.
8. Ejecutar tests del archivo afectado.
9. Hacer revision visual en 1440px y 1920px.

**Comando de verificacion:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Hero y Navbar legibles en primer pantallazo sin depender del scroll.

---

## Bloque 2 - Nuestra Filosofia (`WhyChooseUs`)

**Archivos:**
- Modificar: `src/components/WhyChooseUs.tsx`
- Modificar: `src/test/components.test.tsx`

**Micro-tareas:**
1. Definir token visual del glow verde (suave, no neon agresivo).
2. Aplicar glow tras avatar circular en hover (`shadow` controlada).
3. Cambiar borde base a transicion hacia `green-500` en hover (500ms).
4. Sincronizar `scale + rotate + glow` en una sola curva de transicion.
5. Convertir `Saber mas` a CTA navegable a `/carta` (Link o navigate).
6. Revisar foco teclado y estilo `focus-visible` en CTA.
7. Actualizar test de botones para asegurar navegabilidad.
8. Ejecutar tests de componentes.

**Comando:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Interaccion premium coherente y CTA funcional en todas las cards.

---

## Bloque 3 - Los 4 Pilares (`FeaturedProducts` + `ProductCard`)

**Archivos:**
- Modificar: `src/components/sections/FeaturedProducts.tsx`
- Modificar: `src/components/ui/ProductCard.tsx`
- Modificar: `src/test/components.test.tsx`

**Micro-tareas:**
1. Introducir prop opcional `showPrice` en `ProductCard` (default `true`).
2. Condicionar render de precio a `showPrice`.
3. En `FeaturedProducts`, renderizar cards con `showPrice={false}`.
4. Hacer clic en card para navegar a `/carta` (usar `onClick` existente).
5. Convertir boton `Ver Carta Completa` en CTA real a `/carta`.
6. Verificar que `ProductCard` en otros contextos mantiene precio visible.
7. Agregar test unitario: con `showPrice=false` no se muestra precio.
8. Agregar test de navegacion de CTA principal.
9. Ejecutar tests.

**Comando:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Pilares sin precios en landing, sin regresion en componentes reutilizados.

---

## Bloque 4 - Packs del Dia (`PromotionsSection`)

**Archivos:**
- Modificar: `src/components/sections/PromotionsSection.tsx`
- Modificar: `src/test/PromotionsSection.test.tsx`

**Micro-tareas:**
1. Aplicar `line-clamp-3` a descripcion.
2. Verificar altura estable de cards con textos cortos/largos.
3. Ajustar hover para mayor profundidad (`shadow` + elevacion moderada).
4. Asegurar que `cta_url` invalida tenga fallback seguro.
5. Extraer `Intl.NumberFormat` fuera del render (optimizacion ligera).
6. Revisar que `alt/title` SEO sigan funcionando tras cambios.
7. Actualizar tests para clamp y enlaces.
8. Ejecutar tests del modulo.

**Comando:**
```bash
npm run test:run -- src/test/PromotionsSection.test.tsx
```

**Criterio de cierre:**
- Cards robustas ante contenido variable y mejor feedback visual.

---

## Bloque 5 - La Pausa Perfecta (`CoffeeExperience`)

**Archivos:**
- Modificar: `src/components/sections/CoffeeExperience.tsx`
- Modificar: `src/test/components.test.tsx`

**Micro-tareas:**
1. Oscurecer fondo de card flotante (temperatura) sin perder glassmorphism.
2. Ajustar contraste de texto interno para legibilidad constante.
3. Intensificar sombra de imagen en hover con transicion suave.
4. Verificar que no se degrada rendimiento por blur/sombra excesiva.
5. Actualizar test de render basico si cambia estructura semantica.
6. Ejecutar tests de componentes.

**Comando:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Card flotante legible sobre cualquier fondo, imagen con profundidad realista.

---

## Bloque 6 - Estandarizacion global (titulos y cuerpo)

**Archivos:**
- Modificar: `src/components/WhyChooseUs.tsx`
- Modificar: `src/components/sections/FeaturedProducts.tsx`
- Modificar: `src/components/sections/PromotionsSection.tsx`
- Modificar: `src/components/Testimonials.tsx`
- Modificar: `src/components/sections/LocationSection.tsx`
- Crear (opcional, recomendado): `src/components/ui/SectionHeading.tsx`

**Micro-tareas:**
1. Definir patron de titulo dual-tone reutilizable.
2. Aplicar patron en cada seccion objetivo (sin romper copy actual).
3. Estandarizar cuerpo de texto (`text-xl`, `font-light`, `leading-relaxed`) en desktop.
4. Reducir duplicacion extrayendo componente de heading si aporta claridad.
5. Verificar consistencia vertical rhythm entre secciones.
6. Actualizar tests de textos/titulos impactados.
7. Ejecutar suite de componentes.

**Comando:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Identidad visual coherente, menos divergencia tipografica entre secciones.

---

## Bloque 7 - Testimonios (`Testimonials`)

**Archivos:**
- Modificar: `src/components/Testimonials.tsx`
- Modificar: `src/test/components.test.tsx`

**Micro-tareas:**
**Micro-tareas:**
1. Cambiar layout de Grid a **Flex Row** horizontal (`flex-nowrap`, `overflow-x-auto` o Carousel).
2. Asegurar que todas las tarjetas se vean en **una sola línea** (sin salto de línea).
3. Implementar scroll suave o controles de navegación si exceden el ancho.
4. Unificar hover de avatar con lenguaje de Filosofia (borde verde + sombra).
5. Confirmar que las tarjetas mantienen ancho consistente.
6. Actualizar test para validar estructura horizontal.
7. Ejecutar tests.

**Comando:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Cards mas respirables y lenguaje visual alineado con el resto de home.

---

## Bloque 8 - Busca tu Tienda (`LocationSection`)

**Archivos:**
- Modificar: `src/components/sections/LocationSection.tsx`
- Modificar: `src/test/components.test.tsx`

**Micro-tareas:**
1. Generar URL Google Maps con coordenadas `38.19156,-0.55558`.
2. Conectar `Compartir Ubicacion` y `Como llegar` a la URL real (target seguro).
3. Agregar `rel="noopener noreferrer"` cuando aplique.
4. Incorporar hover de profundidad al contenedor principal.
5. Verificar que CTA no depende de `alert` para flujo normal.
6. Actualizar test para validar `href` correcto.
7. Ejecutar tests.

**Comando:**
```bash
npm run test:run -- src/test/components.test.tsx
```

**Criterio de cierre:**
- Enlaces funcionales a mapa real y seccion con mayor separacion visual.

---

## Bloque 9 - QA integral, performance y cierre

**Archivos:**
- Modificar: `src/test/integration.test.tsx`
- Crear (recomendado): `src/test/landing_refinement.test.tsx`
- Modificar (opcional): `README.md`

**Micro-tareas:**
1. Ejecutar suite completa de tests.
2. Ejecutar build de produccion.
3. Hacer smoke test manual en Home desktop.
4. Verificar accesibilidad basica: foco visible, labels, links.
5. Verificar que no hay regresion en `/carta` y `/admin`.
6. Revisar carga visual inicial (sin saltos notorios por fuentes/imagenes).
7. Documentar cambios finales y pendientes de mobile.

**Comandos:**
```bash
npm run test:run
npm run build
```

**Criterio de cierre:**
- Entrega estable, testeada y lista para QA funcional.

---

## 5. Checklist de aceptacion final

- [ ] Hero y Navbar legibles al cargar, sin scroll.
- [ ] `WhyChooseUs` con glow elegante, borde dinamico y CTA funcional.
- [ ] `FeaturedProducts` sin precios y con navegacion real a `/carta`.
- [ ] `PromotionsSection` con `line-clamp-3` y hover mas profundo.
- [ ] `CoffeeExperience` con card flotante legible y sombra coherente.
- [ ] Titulos y textos globales unificados en look and feel.
- [ ] `Testimonials` con mejor proporcion y avatares consistentes.
- [ ] `LocationSection` enlaza a Google Maps exacto.
- [ ] Tests relevantes y build en verde.

---

## 6. Riesgos y mitigaciones

- **Riesgo:** sobrecargar UI con demasiada sombra/glow.  
  **Mitigacion:** usar intensidad incremental y validar contra baseline por bloque.

- **Riesgo:** regresiones por tocar componentes compartidos (`ProductCard`).  
  **Mitigacion:** prop opcional backward-compatible + tests existentes.

- **Riesgo:** incoherencia tipografica al estandarizar muchas secciones.  
  **Mitigacion:** definir patron unico antes de aplicar cambios masivos.

- **Riesgo:** enlaces rotos en CTAs de Home.  
  **Mitigacion:** test de navegacion + smoke manual de rutas.

---

## 7. Estimacion pragmatica (solo desktop)

- Bloque 0: 20-30 min
- Bloque 1: 45-60 min
- Bloque 2: 30-45 min
- Bloque 3: 45-60 min
- Bloque 4: 30-45 min
- Bloque 5: 20-35 min
- Bloque 6: 45-75 min
- Bloque 7: 25-40 min
- Bloque 8: 20-35 min
- Bloque 9: 30-45 min

**Total estimado:** 5.2 h a 7.8 h efectivas.

---

## 8. Handoff de ejecucion

Orden recomendado de implementacion:
1. Bloque 0
2. Bloque 1
3. Bloques 2 y 3
4. Bloques 4 y 5
5. Bloques 6, 7 y 8
6. Bloque 9

Regla de oro de ejecucion:
- No cerrar bloque sin test + validacion visual + checklist parcial.
- Si aparece bug inesperado, detener avance y resolver antes del siguiente bloque.
