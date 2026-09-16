# CONTENT FACTORY AI — Roadmap de Desarrollo (30 Días)

> Plan intensivo: ~1 hora por día
> Inicio: Día 1 | Meta: Primer Short generado完全mente con IA

---

## MÓDULO 1 — FUNDACIÓN (Días 1-4)

### Día 1: Arquitectura, Planificación y Entorno
- **Objetivo:** Definir arquitectura completa del sistema
- **Entregables:** ARCHITECTURE.md, ROADMAP.md, TASKS.md
- **Criterio de aceptación:** Documentación completa y estructura de carpetas creada
- **Resultado esperado:** Blueprint listo para desarrollo

### Día 2: Inicialización del Proyecto
- **Objetivo:** Configurar Node.js + TypeScript + Git
- **Entregables:** package.json, tsconfig.json, .gitignore, repositorio Git
- **Criterio de aceptación:** `npm run build` exitoso sin errores
- **Resultado esperado:** Proyecto inicializado y compilando

### Día 3: Configuración, Logging y Manejo de Errores
- **Objetivo:** Establecer servicios fundamentales
- **Entregables:** ConfigService, LoggerService, manejo centralizado de errores
- **Criterio de aceptación:** Tests unitarios pasando para config y logging
- **Resultado esperado:** Sistema de configuración y logging operativo

### Día 4: SQLite y Modelo de Datos
- **Objetivo:** Implementar capa de persistencia
- **Entregables:** DatabaseService, migraciones, esquemas iniciales
- **Criterio de aceptación:** CRUD funcional para proyectos y escenas
- **Resultado esperado:** Base de datos lista con tablas principales

---

## MÓDULO 2 — SISTEMA MULTIAGENTE (Días 5-9)

### Día 5: Interfaces de Proveedores IA
- **Objetivo:** Definir contratos para todos los proveedores
- **Entregables:** LLMProvider, ImageProvider, TTSProvider, VideoProvider, PublishingProvider
- **Criterio de aceptación:** Interfaces TypeScript compilando correctamente
- **Resultado esperado:** Contratos tipados listos para implementar

### Día 6: Mock Providers
- **Objetivo:** Implementar versiones Mock de todos los proveedores
- **Entregables:** MockLLMProvider, MockImageProvider, MockTTSProvider, MockVideoProvider
- **Criterio de aceptación:** Mocks retornando datos simulados válidos
- **Resultado esperado:** Proveedores Mock funcionando para desarrollo sin costos

### Día 7: WriterAgent
- **Objetivo:** Implementar agente de generación de guiones
- **Entregables:** WriterAgent completo con tests
- **Criterio de aceptación:** Genera guion JSON válido a partir de una idea
- **Resultado esperado:** Guiones estructurados generados con Mock LLM

### Día 8: StoryboardAgent
- **Objetivo:** Implementar agente de storyboard
- **Entregables:** StoryboardAgent completo con tests
- **Criterio de aceptación:** Divide guion en escenas con prompts visuales
- **Resultado esperado:** Storyboard detallado listo para generación visual

### Día 9: DirectorAgent y Primera Orquestación
- **Objetivo:** Implementar orquestador principal
- **Entregables:** DirectorAgent, PipelineOrchestrator, primera integración
- **Criterio de aceptación:** Pipeline completo ejecuta IDEA → STORYBOARD
- **Resultado esperado:** Primer flujo multiagente funcionando de extremo a extremo

---

## MÓDULO 3 — PIPELINE MULTIMEDIA (Días 10-17)

### Día 10: VisualAgent
- **Objetivo:** Implementar agente de generación visual
- **Entregables:** VisualAgent completo con tests
- **Criterio de aceptación:** Genera imagen por escena en formato vertical
- **Resultado esperado:** Imágenes mock generadas para todas las escenas

### Día 11: VoiceAgent
- **Objetivo:** Implementar agente de generación de voz
- **Entregables:** VoiceAgent completo con tests
- **Criterio de aceptación:** Genera audio de duración específica por escena
- **Resultado esperado:** Audio mock sincronizado con escenas

### Día 12: Sistema de Subtítulos
- **Objetivo:** Implementar generación y sincronización de subtítulos
- **Entregables:** SubtitleService, generación de archivos .srt
- **Criterio de aceptación:** Subtítulos sincronizados con audio
- **Resultado esperado:** Archivos .srt válidos por escena

### Día 13: FFmpegService y Metadata
- **Objetivo:** Implementar servicio de manipulación de video
- **Entregables:** FFmpegService completo con tests
- **Criterio de aceptación:** Puede escalar, recortar y convertir video
- **Resultado esperado:** Operaciones FFmpeg funcionando correctamente

### Día 14: Primer MP4 Generado Automáticamente
- **Objetivo:** Ensamblar primer video completo
- **Entregables:** Integración VisualAgent + VoiceAgent + FFmpeg
- **Criterio de aceptación:** MP4 válido generado con imagen + audio + subtítulos
- **Resultado esperado:** Primer video generado completamente por el sistema

### Día 15: EditorAgent
- **Objetivo:** Implementar agente de edición completo
- **Entregables:** EditorAgent con todas las operaciones de composición
- **Criterio de aceptación:** Genera video con transiciones y subtítulos superpuestos
- **Resultado esperado:** Video con calidad aceptable para revisión

### Día 16: Transiciones, Zoom y Formato Vertical
- **Objetivo:** Mejorar calidad visual del video
- **Entregables:** Transiciones suaves, efecto Ken Burns, formato 9:16
- **Criterio de aceptación:** Video se ve profesional en dispositivos móviles
- **Resultado esperado:** Calidad visual mejorada significativamente

### Día 17: Música y Procesamiento de Audio
- **Objetivo:** Agregar música de fondo y mezclar audio
- **Entregables:** Sistema de música, mezcla de pistas, normalización
- **Criterio de aceptación:** Audio balanceado entre narración y música
- **Resultado esperado:** Video con audio profesional completo

---

## MÓDULO 4 — CONTROL DE CALIDAD (Días 18-19)

### Día 18: QAAgent Básico
- **Objetivo:** Implementar agente de verificación de calidad
- **Entregables:** QAAgent con métricas objetivas
- **Criterio de aceptación:** Detecta problemas comunes de calidad
- **Resultado esperado:** Sistema de QA automatizado funcionando

### Día 19: Reintentos y Recuperación de Fallos
- **Objetivo:** Implementar resiliencia del pipeline
- **Entregables:** Sistema de reintentos, logging de errores, recuperación
- **Criterio de aceptación:** Pipeline se recupera de fallos transitorios
- **Resultado esperado:** Sistema robusto ante errores comunes

---

## MÓDULO 5 — AUTOMATIZACIÓN CLI (Día 20)

### Día 20: CLI `npm run create-story`
- **Objetivo:** Crear interfaz de línea de comandos
- **Entregables:** CLI interactiva para crear historias
- **Criterio de aceptación:** Un comando genera un Short completo
- **Resultado esperado:** Flujo completo ejecutable desde terminal

---

## MÓDULO 6 — INTEGRACIÓN IA REAL (Días 21-24)

### Día 21: Integrar un LLM Real
- **Objetivo:** Conectar proveedor LLM real
- **Entregables:** OpenAIProvider o similar, configuración de API keys
- **Criterio de aceptación:** Guiones generados con calidad superior
- **Resultado esperado:** LLM real generando guiones mejores que el mock

### Día 22: Integrar TTS Real
- **Objetivo:** Conectar proveedor TTS real
- **Entregables:** ElevenLabsProvider o similar
- **Criterio de aceptación:** Audio con voz natural y buena calidad
- **Resultado esperado:** Narración profesional generada automáticamente

### Día 23: Integrar Generación Visual Real
- **Objetivo:** Conectar proveedor de imágenes real
- **Entregables:** DALL-E Provider o similar
- **Criterio de aceptación:** Imágenes de alta calidad en formato vertical
- **Resultado esperado:** Visuales profesionales generados por IA

### Día 24: Primer Short Completo con IA Real
- **Objetivo:** Generar primer video completamente con IA real
- **Entregables:** Short completo con calidad publicable
- **Criterio de aceptación:** Video列表o para publicar en plataformas
- **Resultado esperado:** Primera producción real del sistema

---

## MÓDULO 7 — PRODUCTO (Días 25-27)

### Día 25: Control de Originalidad y Similitud
- **Objetivo:** Implementar verificación de originalidad
- **Entregables:** Sistema de detección de plagio/duplicados
- **Criterio de aceptación:** Detecta contenido demasiado similar a existente
- **Resultado esperado:** Contenido verificado como original

### Día 26: Dashboard MVP
- **Objetivo:** Crear interfaz web básica de monitoreo
- **Entregables:** Dashboard con lista de proyectos y estado
- **Criterio de aceptación:** Muestra proyectos activos y su progreso
- **Resultado esperado:** Visibilidad del pipeline en tiempo real

### Día 27: Preparar Integración de Publicación
- **Objetivo:** Diseñar sistema de publicación (sin implementar)
- **Entregables:** Interfaces de publicación documentadas, plugins preparados
- **Criterio de aceptación:** Arquitectura lista para agregar platforms
- **Resultado esperado:** Framework de publicación preparado

---

## MÓDULO 8 — ANALYTICS Y RELEASE (Días 28-30)

### Día 28: Sistema de Analytics
- **Objetivo:** Implementar recolección de métricas
- **Entregables:** AnalyticsService, métricas de calidad y rendimiento
- **Criterio de aceptación:** Dashboard muestra métricas de videos generados
- **Resultado esperado:** Datos de rendimiento disponibles

### Día 29: Correcciones y Estabilización
- **Objetivo:** Arreglar bugs y estabilizar el sistema
- **Entregables:** Fixes de bugs críticos, optimización de rendimiento
- **Criterio de aceptación:** Pipeline ejecuta completo sin errores críticos
- **Resultado esperado:** Sistema estable y confiable

### Día 30: Prueba Completa y Primera Producción
- **Objetivo:** Ejecución completa del sistema de principio a fin
- **Entregables:** Video final generado, documentación actualizada
- **Criterio de aceptación:** Short generado y listo para publicar manualmente
- **Resultado esperado:** CONTENT FACTORY AI operativo en MVP

---

## Resumen Visual

| Semana | Días | Módulo | Objetivo Principal |
|--------|------|--------|-------------------|
| 1 | 1-4 | Fundación | Arquitectura, config, base de datos |
| 2 | 5-9 | Multiagente | Agentes core y primera orquestación |
| 3-4 | 10-17 | Multimedia | Pipeline completo de video |
| 5 | 18-20 | QA + CLI | Calidad y automatización |
| 6 | 21-24 | IA Real | Integración con proveedores reales |
| 7 | 25-27 | Producto | Originalidad, dashboard, publicación |
| 8 | 28-30 | Release | Analytics, estabilización, launch |

---

## Hito Principal

**Día 14:** Primer MP4 generado completamente por el sistema (con mocks)

**Día 24:** Primer Short generado completamente con IA real

**Día 30:** MVP listo para uso

---

*Roadmap actualizado: Día 1*
*Frecuencia de revisión: Semanal*
