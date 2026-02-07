---
name: generando-ideas
description: Debes usar esto ANTES de cualquier trabajo creativo, agregar funcionalidades o crear componentes. Explora la intención del usuario, los requisitos y el diseño antes de la implementación.
---

# Generando Ideas (Brainstorming)

**IMPORTANTE**: Todas las propuestas, explicaciones y diálogos generados deben ser estrictamente en **castellano**.

## Descripción General

Ayuda a convertir ideas en diseños y especificaciones completamente formados a través de un diálogo colaborativo natural.

Comienza entendiendo el contexto actual del proyecto, luego haz preguntas una a la vez para refinar la idea. Una vez que entiendas lo que vas a construir, presenta el diseño en pequeñas secciones (200-300 palabras), verificando después de cada sección si se ve bien hasta ahora.

## El Proceso

**1. Entendiendo la idea:**
- Revisa primero el estado actual del proyecto (archivos, docs, commits recientes).
- Haz preguntas una a la vez para refinar la idea.
- Prefiere preguntas de opción múltiple cuando sea posible, pero abiertas también están bien.
- Solo una pregunta por mensaje; si un tema necesita más exploración, divídelo.
- Enfócate en entender: propósito, restricciones, criterios de éxito.

**2. Explorando enfoques:**
- Propón 2-3 enfoques diferentes con sus ventajas y desventajas (trade-offs).
- Presenta las opciones de manera conversacional con tu recomendación y razonamiento.
- Empieza con tu opción recomendada y explica por qué.

**3. Presentando el diseño:**
- Una vez que creas entender lo que vas a construir, presenta el diseño.
- Divídelo en secciones de 200-300 palabras.
- Pregunta después de cada sección si parece correcto hasta el momento.
- Cubre: arquitectura, componentes, flujo de datos, manejo de errores, pruebas.
- Prepárate para retroceder y aclarar si algo no tiene sentido.

## Después del Diseño

**Documentación:**
- Escribe el diseño validado en `docs/plans/YYYY-MM-DD-<tema>-design.md`.
- Usa skills relacionados con escritura clara si están disponibles.
- Haz commit del documento de diseño en git.

**Implementación (si se continúa):**
- Pregunta: "¿Listo para configurar la implementación?".
- Usa `using-git-worktrees` (si existe) para crear un espacio de trabajo aislado.
- Usa `planificando-proyectos` para crear un plan de implementación detallado.

## Principios Clave

- **Una pregunta a la vez**: No abrumes con múltiples preguntas.
- **Opción múltiple preferida**: Más fácil de responder que preguntas abiertas.
- **YAGNI despiadadamente**: Elimina características innecesarias de todos los diseños.
- **Explora alternativas**: Siempre propón 2-3 enfoques antes de decidir.
- **Validación incremental**: Presenta el diseño en secciones, valida cada una.
- **Sé flexible**: Retrocede y aclara cuando algo no tenga sentido.
