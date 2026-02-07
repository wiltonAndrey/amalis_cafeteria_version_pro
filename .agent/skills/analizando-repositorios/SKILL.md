---
name: analizando-repositorios
description: Analiza repositorios de código existentes y explica su funcionamiento en términos sencillos para no programadores. Extrae métodos y componentes reutilizables para construir páginas web basadas en código profesional probado.
---

# Analizando Repositorios (Code Analysis for Non-Programmers)

**IMPORTANTE**: Todas las explicaciones, análisis y guías de uso deben ser entregadas estrictamente en **castellano**.

Este skill actúa como un "traductor" entre código profesional complejo y un usuario que no sabe programar. Tu objetivo es entender el repositorio, extraer las "piezas de lego" útiles y explicar cómo usarlas para construir páginas web nuevas.

## Cuándo usar este skill
- Cuando el usuario te da un repositorio o carpeta y pregunta "¿Qué hace esto?" o "¿Cómo uso esto?".
- Cuando el usuario quiere replicar una funcionalidad o diseño de un código existente pero no sabe cómo leerlo.
- Cuando el usuario quiere "hacer páginas con estos métodos" pero necesita instrucciones paso a paso.

## Flujo de Trabajo

**1. Exploración Inicial:**
- Usa `list_dir` para entender la estructura del proyecto.
- Busca archivos clave: `README.md`, `package.json`, o archivos de entrada (`index.html`, `App.jsx`, `main.py`).

**2. Identificación de Componentes (Las Piezas de Lego):**
- Identifica partes reutilizables: componentes de UI, estilos globales, funciones de utilidad.
- Usa `view_file` para leer el código fuente.

**3. Traducción y Explicación:**
- **IMPORTANTE:** No uses jerga técnica sin explicarla (evita "instanciar la clase", di "crear una copia de esta herramienta").
- Explica QUÉ hace el código, no CÓMO lo hace línea por línea.
- Usa analogías (ej., "Este archivo es como el índice de un libro", "Este componente es como un molde para galletas").

**4. Recetas de Uso:**
- Proporciona ejemplos de "Copia y Pega" listos para usar.
- Crea pequeñas guías paso a paso: "Para poner este botón en tu página, pega este código aquí".

## Instrucciones para el Agente

1.  **Nunca asumas conocimiento previo:** Explica como si hablaras con un diseñador o gerente de producto, no con un desarrollador.
2.  **Valida la seguridad:** Aunque el código sea "profesional", verifica que no tenga credenciales expuestas o prácticas peligrosas antes de recomendar su uso.
3.  **Enfócate en el resultado visual:** Al usuario le interesa hacer páginas web; prioriza explicar el HTML, CSS y componentes visuales sobre la lógica backend compleja.
4.  **Detecta dependencias:** Si el código necesita una librería extra para funcionar, avísale al usuario que debe instalarla (y dale el comando exacto).

## Plantilla de Explicación

Al explicar un archivo o repositorio, usa este formato:

### 🧐 ¿Qué tenemos aquí?
[Resumen simple de qué es el proyecto o archivo]

### 🧱 Piezas que puedes usar
- **[Nombre del Componente]**: Sirve para [descripción].
- **[Estilo Visual]**: Sirve para [descripción].

### 🛠️ Cómo usarlo en tu página
1. Copia este bloque:
   ```html
   <!-- Código ejemplo -->
   ```
2. Pégalo en tu archivo `index.html`.
