---
name: refinando-solicitudes
description: Transforma la entrada del usuario en un prompt estructurado y perfecto para que el agente ejecute tareas con máxima precisión. Úsalo cuando el usuario quiera asegurar un resultado perfecto, pida "mejorar mi prompt" o "optimizar solicitud".
---

# Skill: Refinador de Solicitudes (Prompt Engineer)

**IMPORTANTE**: Todos los prompts generados, planes de ejecución y explicaciones deben ser entregados estrictamente en **castellano**.

Este skill actúa como un paso intermedio inteligente para clarificar, estructurar y potenciar las instrucciones antes de ejecutarlas.

## Cuándo usar este skill
- Cuando el usuario dice "quiero que esto salga perfecto".
- Cuando el usuario tiene una idea vaga y necesita aterrizarla.
- Cuando la tarea es compleja y riesgosa (ej. refactorización masiva).
- Cuando el usuario usa el comando `/refinar` o menciona "Prompt Perfecto".

## Flujo de Trabajo

### 1. Análisis de Intención
Analiza el input crudo del usuario buscando:
- **Objetivo Principal**: ¿Qué quiere lograr realmente?
- **Contexto Faltante**: ¿Qué información vital no se mencionó? (rutas de archivo, tecnologías, preferencias de estilo).
- **Ambigüedades**: ¿Qué términos podrían malinterpretarse?

### 2. Estructuración del Prompt (The Perfect Prompt)
Reescribe la solicitud del usuario siguiendo esta plantilla maestra:

```markdown
# [Título de la Tarea]

## Contexto y Objetivo
[Descripción clara del estado actual y lo que se quiere lograr]

## Archivos Afectados
- [Lista de archivos específicos]

## Reglas y Restricciones
- [Tecnologías a usar]
- [Estilos a respetar]
- [Cosas que NO se deben hacer]

## Plan de Ejecución Paso a Paso
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Verificación
- [Criterios de éxito]
```

### 3. Confirmación
Presenta el "Prompt Perfecto" al usuario y pregunta:
*"¿Este plan refleja exactamente lo que necesitas? Si es así, procederé a ejecutarlo."*

## Instrucciones para el Agente

1.  **NO ejecutes código inmediatamente** si se invoca este skill. Tu trabajo es *planificar* y *refinar* primero.
2.  Si faltan detalles críticos (ej. ¿Qué librería de UI usamos?), PREGUNTA al usuario antes de generar el prompt final.
3.  Usa tu conocimiento del codebase (analizado previamente) para llenar los huecos en el prompt (ej. autocompletar rutas de archivos).

## Ejemplo de Uso

**Usuario:** "Arregla el menú que se ve mal."

**Agente (usando skill):**
"Entendido. Para asegurar que quede perfecto, he estructurado tu solicitud así:

**Título:** Reparación Visual del Menú de Navegación
**Problema:** El menú tiene inconsistencias de alineación y colores en móvil.
**Objetivo:** Alinear elementos con Flexbox y unificar colores con el Sistema de Diseño.
**Archivos:** `src/components/Navbar.tsx`, `src/index.css`.
**Plan:**
1. Ajustar padding en contenedor principal.
2. Corregir z-index del dropdown.
3. Verificar contraste en modo oscuro.

¿Procedo con este plan?"

## Reglas Obligatorias

1.  **Idioma de Salida**: Siempre que realices una implementación (escribir código, modificar archivos), debes entregar la explicación, el plan y los comentarios del código en **ESPAÑOL (CASTELLANO)**, salvo que el usuario especifique explícitamente otro idioma para una parte concreta.
