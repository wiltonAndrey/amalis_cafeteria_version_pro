---
name: manejando-errores
description: Domina los patrones de manejo de errores en varios lenguajes, incluyendo excepciones, tipos Result, propagación de errores y degradación elegante para construir aplicaciones resilientes. Úsalo al implementar manejo de errores, diseñar APIs o mejorar la confiabilidad de la aplicación.
---

# Patrones de Manejo de Errores (Error Handling)

**IMPORTANTE**: Todas las soluciones, comentarios de código y estrategias de mitigación deben ser entregadas estrictamente en **castellano**.

Construye aplicaciones resilientes con estrategias robustas de manejo de errores que gestionen los fallos con elegancia y proporcionen excelentes experiencias de depuración.

## Cuándo Usar Este Skill

- Implementar manejo de errores en nuevas funcionalidades.
- Diseñar APIs resilientes a errores.
- Depurar problemas en producción.
- Mejorar la confiabilidad de la aplicación.
- Crear mejores mensajes de error para usuarios y desarrolladores.
- Implementar patrones de reintento y circuit breaker.
- Manejar errores asíncronos/concurrentes.
- Construir sistemas distribuidos tolerantes a fallos.

## Conceptos Principales

### 1. Filosofías de Manejo de Errores

**Excepciones vs Tipos Result:**

- **Excepciones**: Try-catch tradicional, interrumpe el flujo de control.
- **Tipos Result**: Éxito/fallo explícito, enfoque funcional.
- **Códigos de Error**: Estilo C, requiere disciplina.
- **Tipos Option/Maybe**: Para valores anulables.

**Cuándo Usar Cada Uno:**

- Excepciones: Errores inesperados, condiciones excepcionales.
- Tipos Result: Errores esperados, fallos de validación.
- Panics/Crashes: Errores irrecuperables, bugs de programación.

### 2. Categorías de Errores

**Errores Recuperables:**
- Timeouts de red.
- Archivos faltantes.
- Entrada de usuario inválida.
- Límites de tasa de API.

**Errores Irrecuperables:**
- Sin memoria (OOM).
- Desbordamiento de pila (Stack overflow).
- Bugs de programación (null pointer, etc.).

## Patrones Específicos por Lenguaje

### Manejo de Errores en Python

**Jerarquía de Excepciones Personalizada:**

```python
class ErrorAplicacion(Exception):
    """Excepción base para todos los errores de la aplicación."""
    def __init__(self, mensaje: str, codigo: str = None, detalles: dict = None):
        super().__init__(mensaje)
        self.codigo = codigo
        self.detalles = detalles or {}
        self.timestamp = datetime.utcnow()

class ErrorValidacion(ErrorAplicacion):
    """Lanzada cuando la validación falla."""
    pass

class ErrorNoEncontrado(ErrorAplicacion):
    """Lanzada cuando el recurso no se encuentra."""
    pass

# Uso
def obtener_usuario(user_id: str) -> User:
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise ErrorNoEncontrado(
            f"Usuario no encontrado",
            codigo="USUARIO_NO_ENCONTRADO",
            detalles={"user_id": user_id}
        )
    return user
```

### TypeScript/JavaScript

**Clases de Error Personalizadas:**

```typescript
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Uso
function getUser(id: string): User {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new NotFoundError("User", id);
  }
  return user;
}
```

## Patrones Universales

### Patrón 1: Circuit Breaker (Cortocircuito)
Prevenir fallos en cascada en sistemas distribuidos. Si un servicio falla repetidamente, deja de llamarlo temporalmente.

### Patrón 2: Agregación de Errores
Recolectar múltiples errores en lugar de fallar en el primero (útil en validaciones de formularios).

### Patrón 3: Degradación Elegante
Proporcionar funcionalidad de respaldo (fallback) cuando ocurren errores.

```python
def con_fallback(principal, fallback):
    try:
        return principal()
    except Exception:
        return fallback()
```

## Mejores Prácticas

1.  **Falla Rápido**: Valida la entrada temprano.
2.  **Preserva el Contexto**: Incluye stack traces, metadatos, timestamps.
3.  **Mensajes Significativos**: Explica qué pasó y cómo arreglarlo.
4.  **Loguea Apropiadamente**: Error = log, fallo esperado = no spamear logs.
5.  **Maneja en el Nivel Correcto**: Captura donde puedas manejar significativamente.
6.  **Limpia Recursos**: Usa try-finally, context managers.
7.  **No Te Tragues los Errores**: Loguea o relanza, no ignores silenciosamente.

## Trampas Comunes

- **Capturar Demasiado Amplio**: `except Exception` oculta bugs.
- **Bloques Catch Vacíos**: Tragarse errores silenciosamente.
- **Loguear y Relanzar**: Crea entradas de log duplicadas.
- **No Limpiar**: Olvidar cerrar archivos o conexiones.
- **Malos Mensajes de Error**: "Ocurrió un error" no ayuda.
