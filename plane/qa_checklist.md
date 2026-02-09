# Checklist de QA Visual (Desktop-First)

Este documento servirá para validar cada bloque funcional antes de darlo por cerrado.

## Bloque 1: Hero + Navbar
- [ ] Navbar: Enlaces legibles sobre imagen oscura (sin scroll).
- [ ] Navbar: Enlaces legibles sobre fondo blanco/oscuro (con scroll).
- [ ] Hero: Título principal tiene `drop-shadow-2xl` y contraste AA.
- [ ] Hero: Texto secundario es `text-2xl` (o `xl`) y no se pierde.
- [ ] Hero: Overlay cubre correctamente la imagen de fondo sin opacar demasiado.

## Bloque 2: Filosofía
- [ ] Cards: Tienen efecto "Shadow Bloom" verde al pasar el mouse.
- [ ] Avatar: Borde transiciona a verde en hover.
- [ ] Botón: "Saber más" lleva a `/carta`.
- [ ] Navegación: El foco es visible al navegar con tabulador.

## Bloque 3: Pilares
- [ ] Precios: NO visibles en las tarjetas de esta sección.
- [ ] Imágenes: Clic lleva a `/carta`.
- [ ] Botón: "Ver Carta Completa" funciona y tiene estilo consistente.

## Bloque 4: Packs (Promociones)
- [ ] Texto: Descripciones largas se cortan con `...` (line-clamp).
- [ ] Cards: Altura consistente entre ellas.
- [ ] Hover: Efecto de elevación y sombra más pronunciada.

## Bloque 5: La Pausa Perfecta
- [ ] Card Taza: Sombra realista que la "levanta" del fondo.
- [ ] Card Temp: Fondo semitransparente legible (oscuro).
- [ ] Texto: Legible sobre el fondo glassmorphism.

## Bloque 6: Estándar Global
- [ ] Títulos: Estilo "Dual Tone" aplicado en todas las secciones clave.
- [ ] Cuerpo: Tipografía `font-light` y tamaño unificado.

## Bloque 7: Testimonios
- [ ] Layout: Horizontal (fila única) tipo carrusel/flex.
- [ ] Scroll: Funciona suavemente si hay desbordamiento.
- [ ] Estilo: Avatares con borde verde y sombra consistente.

## Bloque 8: Ubicación
- [ ] Mapa: Enlace lleva a coordenadas correctas.
- [ ] Hover: Seccion se eleva sutilmente.
