---
name: planificando-proyectos
description: Úsalo cuando tengas una especificación o requisitos para una tarea de varios pasos, antes de tocar el código.
---

# Planificando Proyectos (Writing Plans)

**IMPORTANTE**: Todos los planes de implementación, comentarios de tareas y explicaciones deben ser entregados estrictamente en **castellano**.

## Descripción General

Escribe planes de implementación completos asumiendo que el ingeniero tiene cero contexto de nuestro código y un gusto cuestionable. Documenta todo lo que necesitan saber: qué archivos tocar para cada tarea, código, pruebas, documentos que podrían necesitar revisar, cómo probarlo. Dales el plan completo como tareas pequeñas y digeribles. DRY. YAGNI. TDD. Commits frecuentes.

Asume que son desarrolladores hábiles, pero que no saben casi nada sobre nuestro conjunto de herramientas o dominio del problema. Asume que no conocen muy bien el buen diseño de pruebas.

**Anunciar al inicio:** "Estoy usando el skill `planificando-proyectos` para crear el plan de implementación."

**Guardar planes en:** `docs/plans/YYYY-MM-DD-<nombre-funcionalidad>.md`

## Granularidad de Tareas Pequeñas

**Cada paso es una acción (2-5 minutos):**
- "Escribir la prueba que falla" - paso
- "Ejecutarla para asegurarse de que falla" - paso
- "Implementar el código mínimo para hacer que la prueba pase" - paso
- "Ejecutar las pruebas y asegurarse de que pasen" - paso
- "Hacer commit" - paso

## Encabezado del Documento del Plan

**Todo plan DEBE comenzar con este encabezado:**

```markdown
# Plan de Implementación de [Nombre de Funcionalidad]

> **Para el Agente:** SUB-SKILL REQUERIDO: Usa executing-plans (o equivalente en español) para implementar este plan tarea por tarea.

**Objetivo:** [Una frase describiendo qué construye esto]

**Arquitectura:** [2-3 frases sobre el enfoque]

**Stack Tecnológico:** [Tecnologías/librerías clave]

---
```

## Estructura de Tarea

```markdown
### Tarea N: [Nombre del Componente]

**Archivos:**
- Crear: `ruta/exacta/a/archivo.py`
- Modificar: `ruta/exacta/a/existente.py:123-145`
- Test: `tests/ruta/exacta/a/test.py`

**Paso 1: Escribir la prueba que falla**

```python
def test_comportamiento_especifico():
    resultado = funcion(input)
    assert resultado == esperado
```

**Paso 2: Ejecutar prueba para verificar que falla**

Ejecutar: `pytest tests/ruta/test.py::nombre_test -v`
Esperado: FAIL con "function not defined"

**Paso 3: Escribir implementación mínima**

```python
def funcion(input):
    return esperado
```

**Paso 4: Ejecutar prueba para verificar que pasa**

Ejecutar: `pytest tests/ruta/test.py::nombre_test -v`
Esperado: PASS

**Paso 5: Commit**

```bash
git add tests/ruta/test.py src/ruta/archivo.py
git commit -m "feat: agregar funcionalidad especifica"
```
```

## Recuerda
- Rutas de archivo exactas siempre.
- Código completo en el plan (no "agregar validación").
- Comandos exactos con salida esperada.
- Referencia skills relevantes con sintaxis @.
- DRY, YAGNI, TDD, commits frecuentes.

## Entrega de Ejecución

Después de guardar el plan, ofrece la opción de ejecución:

**"Plan completo y guardado en `docs/plans/<nombre_archivo>.md`. Dos opciones de ejecución:**

**1. Impulsado por Subagente (esta sesión)** - Despacho un subagente fresco por tarea, revisión entre tareas, iteración rápida.

**2. Sesión Paralela (separada)** - Abre nueva sesión con `executing-plans`, ejecución por lotes con puntos de control.

**¿Qué enfoque prefieres?"**
