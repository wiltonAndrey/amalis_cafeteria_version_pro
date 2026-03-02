# Backend Release Hostinger - Plan Unificado y Checklist de Ejecucion

## Uso de este archivo
- Marca cada tarea completada cambiando `[ ]` por `[x]`.
- Cuando marques una tarea, anade evidencia breve en `Notas/Evidencia` (archivo, comando o resultado).
- No avances de fase sin cerrar los bloqueos de la fase actual.

## Estado global
- Inicio: `____-__-__`
- Responsable: `__________`
- Estado general: `[ ] No iniciado` `[ ] En progreso` `[ ] Bloqueado` `[ ] Completado`
- Definicion de terminado:
- Backend estable y seguro en Hostinger.
- Contrato API compatible con el frontend actual.
- Pruebas criticas pasando.
- Checklist de despliegue y rollback completo.

---

## Prompt unificado (listo para pegar en una conversacion nueva)

```txt
Actua como un Senior Backend Engineer especializado en PHP 8 + MySQL + AppSec + Performance + QA para hosting compartido Hostinger, y deja este backend 100% listo para produccion.

CONTEXTO REAL DE DESPLIEGUE
- Hosting: Hostinger compartido.
- Runtime: PHP + MySQL/MariaDB (phpMyAdmin).
- Frontend React desplegado como build estatico (HTML/CSS/JS) en `public_html`.
- Backend en endpoints PHP bajo `public_html/api/*.php`.
- No depender de Node.js en servidor para backend.
- Mantener compatibilidad total con los endpoints actuales consumidos por el frontend.

CONTEXTO DEL PROYECTO
- Frontend React consume `/api/*.php`.
- Backend principal en carpeta `api/` (auth, products, categories, promotions, settings, upload, schema SQL, bootstrap).
- Hay tests en `api/tests/` y scripts de migracion/schema.

OBJETIVO TECNICO (BACKEND RELEASE-READY)
- Cero errores criticos en ejecucion.
- Cero vulnerabilidades criticas/altas conocidas.
- Contrato API estable y compatible con frontend actual.
- Latencia y estabilidad objetivo:
  - p95 lectura <= 300ms
  - p95 escritura <= 500ms
  - tasa de error 5xx < 0.1%
- Cobertura suficiente en flujos criticos: auth, CRUD, upload, settings y conexion BD.

RESTRICCIONES CRITICAS
- No romper rutas ni formato de respuesta API existente.
- No eliminar funcionalidades sin reemplazo equivalente.
- Si una libreria externa limita seguridad/rendimiento/mantenibilidad, reemplazar con implementacion propia, integrar, testear y dejar lista para produccion.
- Si hay riesgo de incompatibilidad, aplicar compatibilidad hacia atras.

MANDATO DE EJECUCION
- Usar todas las habilidades/skills necesarias (debugging, seguridad, testing, verificacion).
- No quedarse en recomendaciones: aplicar cambios reales y validar con evidencia.
- Justificar cada cambio por impacto tecnico (seguridad, rendimiento o estabilidad).

FLUJO OBLIGATORIO
1) Auditoria inicial
- Mapear endpoints, auth, middleware, validaciones, uploads y acceso a BD.
- Ejecutar sintaxis/lint PHP y pruebas existentes.
- Detectar riesgos de seguridad, errores de logica y cuellos de botella.

2) Hardening de seguridad
- Validacion estricta de entrada/salida JSON consistente.
- SQL con consultas preparadas en todas las operaciones.
- Endurecer auth/sesion/cookies/CORS/CSRF segun corresponda.
- Endurecer upload (MIME real, tamano, extension, nombre y ruta segura).
- Evitar fugas de informacion sensible en errores.
- Agregar rate limiting basico en endpoints sensibles.

3) Rendimiento y escalabilidad
- Revisar queries lentas e indices faltantes.
- Evitar N+1 y lecturas innecesarias.
- Cachear respuestas publicas cuando aplique (`ETag`, `Cache-Control`).
- Reducir TTFB en endpoints criticos.

4) Resiliencia y observabilidad
- Manejo unificado de errores (sin stack trace al cliente).
- Logging estructurado con request-id.
- Health check minimo y diagnostico basico.
- Timeouts y reintentos controlados donde aplique.

5) Calidad, pruebas y verificacion final
- Ejecutar suite de pruebas completa.
- Anadir/ajustar pruebas para cambios criticos.
- Reportar before/after de latencia, errores y estabilidad.
- Confirmar explicitamente: "backend listo para produccion".

6) Preparacion de deploy en Hostinger
- Checklist final de archivos en `public_html` y `public_html/api`.
- Configuracion segura de entorno para produccion.
- Migraciones SQL + backup previo + plan de rollback.

FORMATO DE ENTREGA
A) Hallazgos criticos (seguridad, rendimiento, estabilidad)
B) Plan de cambios priorizado (alto/medio/bajo)
C) Diffs aplicados por archivo
D) Evidencia de pruebas y metricas before/after
E) Checklist final de despliegue y rollback en Hostinger
```

---

## Plan operativo por fases (marcar progreso)

## Fase 0 - Preparacion
- [ ] F0.1 Confirmar rama de trabajo y estado de git.
- [ ] F0.2 Confirmar backup de base de datos antes de cambios.
- [ ] F0.3 Confirmar backup de archivos de `api/`.
- [ ] F0.4 Confirmar variables de entorno y secretos fuera de codigo.
- Notas/Evidencia:

## Fase 1 - Auditoria inicial
- [ ] F1.1 Inventariar endpoints y contratos JSON actuales.
- [ ] F1.2 Revisar auth, middleware y sesiones.
- [ ] F1.3 Revisar acceso a BD y uso de consultas preparadas.
- [ ] F1.4 Revisar uploads y validaciones de archivos.
- [ ] F1.5 Ejecutar pruebas existentes y registrar baseline.
- [ ] F1.6 Identificar riesgos criticos y priorizarlos (alto/medio/bajo).
- Notas/Evidencia:

## Fase 2 - Hardening de seguridad
- [ ] F2.1 Aplicar validacion estricta de input/output en endpoints.
- [ ] F2.2 Garantizar prepared statements en todo CRUD.
- [ ] F2.3 Endurecer login/sesion/cookies seguras.
- [ ] F2.4 Configurar CORS/CSRF segun flujo real.
- [ ] F2.5 Endurecer `upload.php` (MIME/tamano/extensiones/ruta).
- [ ] F2.6 Homogeneizar manejo de errores sin fuga sensible.
- [ ] F2.7 Anadir rate limiting en endpoints sensibles.
- Notas/Evidencia:

## Fase 3 - Rendimiento y escalabilidad
- [ ] F3.1 Medir latencias baseline por endpoint critico.
- [ ] F3.2 Optimizar queries lentas e indices faltantes.
- [ ] F3.3 Eliminar patrones N+1/lecturas redundantes.
- [ ] F3.4 Implementar headers de cache donde aplique (`ETag`, `Cache-Control`).
- [ ] F3.5 Reducir TTFB en rutas calientes.
- [ ] F3.6 Medir de nuevo y comparar contra baseline.
- Notas/Evidencia:

## Fase 4 - Resiliencia y observabilidad
- [ ] F4.1 Unificar formato de error para toda la API.
- [ ] F4.2 Incluir request-id en logs/respuestas de error.
- [ ] F4.3 Crear endpoint de health check.
- [ ] F4.4 Definir timeouts/reintentos para operaciones externas (si existen).
- [ ] F4.5 Documentar estrategia de monitoreo minimo.
- Notas/Evidencia:

## Fase 5 - Pruebas y compatibilidad con frontend
- [ ] F5.1 Ejecutar suite completa de `api/tests/`.
- [ ] F5.2 Crear o ajustar tests para auth, CRUD, upload y settings.
- [ ] F5.3 Verificar compatibilidad de respuestas con frontend React.
- [ ] F5.4 Confirmar ausencia de regresiones funcionales.
- Notas/Evidencia:

## Fase 6 - Despliegue en Hostinger
- [ ] F6.1 Preparar paquete de despliegue (`public_html` y `public_html/api`).
- [ ] F6.2 Aplicar migraciones SQL con backup previo.
- [ ] F6.3 Validar permisos de archivos/directorios y rutas de upload.
- [ ] F6.4 Verificar variables de entorno de produccion.
- [ ] F6.5 Prueba smoke post-deploy (login, CRUD, upload, lectura menu).
- [ ] F6.6 Confirmar objetivos de latencia y tasa de error.
- [ ] F6.7 Confirmacion final: `backend listo para produccion`.
- Notas/Evidencia:

---

## Registro de avances
- `____-__-__ __:__` - 
- `____-__-__ __:__` - 
- `____-__-__ __:__` - 

