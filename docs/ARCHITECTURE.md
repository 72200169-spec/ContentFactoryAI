# CONTENT FACTORY AI — Arquitectura del Sistema

> Versión 1.0 | Día 1 de 30

---

## 1. Objetivo

Construir una plataforma multiagente capaz de producir automáticamente contenido audiovisual original, comenzando con historias cortas creadas con IA para:

- YouTube Shorts
- TikTok
- Instagram Reels
- Facebook Reels

El flujo objetivo completo es:

```
IDEA → GUION → STORYBOARD → VISUALES → NARRACIÓN → SUBTÍTULOS → EDICIÓN → QA → APROBACIÓN HUMANA → PUBLICACIÓN → ANALYTICS
```

**Nota:** La publicación automática NO pertenece al MVP inicial.

---

## 2. Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                      CLI / Interfaz                      │
│                    (npm run create-story)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   DirectorAgent                         │
│              (Orquestador Principal)                    │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  Writer  │  │Storyboard│  │  Visual  │
    │  Agent   │  │  Agent   │  │  Agent   │
    └──────────┘  └──────────┘  └──────────┘
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  Voice   │  │  Editor  │  │    QA    │
    │  Agent   │  │  Agent   │  │  Agent   │
    └──────────┘  └──────────┘  └──────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Providers Layer                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│  │LLMProvider│  │ImgProvider│  │TTSProvider│           │
│  └───────────┘  └───────────┘  └───────────┘           │
│  ┌───────────┐  ┌───────────┐                           │
│  │VidProvider│  │PubProvider│                           │
│  └───────────┘  └───────────┘                           │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Services Layer                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  │
│  │FFmpeg   │  │ Config  │  │ Logger  │  │ Database │  │
│  │Service  │  │ Service │  │ Service │  │ Service  │  │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Agentes

### 3.1 DirectorAgent

**Responsabilidad:** Orquestador principal del pipeline completo.

- Recibe la idea inicial del usuario
- Coordina la secuencia de ejecución de agentes
- Gestiona el estado del pipeline en SQLite
- Maneja reintentos y recuperación de fallos
- Reporta progreso al usuario
- Solicita aprobación humana antes de publicar

### 3.2 WriterAgent

**Responsabilidad:** Genera guiones a partir de ideas.

- Recibe: idea en texto plano
- Genera: guion estructurado con escenas, diálogos, indicaciones visuales
- Formato de salida: JSON con array de escenas
- Cada escena contiene: descripción, diálogo, duración estimada, prompt visual

### 3.3 StoryboardAgent

**Responsabilidad:** Divide el guion en escenas visuales detalladas.

- Recibe: guion del WriterAgent
- Genera: storyboard con descripciones detalladas por escena
- Define: composición, iluminación, estilo visual, cámara
- Asigna: duración exacta por escena para sincronización

### 3.4 VisualAgent

**Responsabilidad:** Genera imágenes/visuales para cada escena.

- Recibe: storyboard con prompts visuales
- Genera: imagen por escena en formato vertical (9:16)
- Resolución objetivo: 1080x1920 px
- Formato: PNG o WebP para calidad
- Maneja: variaciones y reintentos si calidad es insuficiente

### 3.5 VoiceAgent

**Responsabilidad:** Genera narración de audio para cada escena.

- Recibe: texto de diálogos/narración por escena
- Genera: archivo de audio por escena (WAV o MP3)
- Sincroniza: duración del audio con duración de escena
- Soporta: múltiples voces (futuro)

### 3.6 EditorAgent

**Responsabilidad:** Ensambla todas las piezas multimedia en video final.

- Recibe: imágenes, audio, subtítulos, metadata
- Procesa: FFmpeg para composición de video
- Aplica: transiciones, zoom suave (Ken Burns), formato vertical
- Agrega: subtítulos superpuestos, música de fondo
- Genera: archivo MP4 final optimizado para cada plataforma

### 3.7 QAAgent

**Responsabilidad:** Valida calidad del contenido generado.

- Verifica: resolución, duración, formato del video final
- Valida: sincronización audio-subtítulos
- Detecta: artefactos, cortes abruptos, silencios largos
- Decide: aprobar o solicitar re-procesamiento
- Genera: reporte de calidad con métricas

---

## 4. Interfaces de Proveedores (Providers)

### 4.1 LLMProvider

```typescript
interface LLMProvider {
  generate(prompt: string, options?: LLMOptions): Promise<string>;
  generateStructured<T>(prompt: string, schema: Schema): Promise<T>;
}

interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}
```

### 4.2 ImageProvider

```typescript
interface ImageProvider {
  generate(prompt: string, options?: ImageOptions): Promise<Buffer>;
  generateVariations(prompt: string, count: number): Promise<Buffer[]>;
}

interface ImageOptions {
  width?: number;    // default: 1080
  height?: number;   // default: 1920
  style?: string;
  quality?: 'standard' | 'hd';
}
```

### 4.3 TTSProvider

```typescript
interface TTSProvider {
  synthesize(text: string, options?: TTSOptions): Promise<Buffer>;
  getVoices(): Promise<Voice[]>;
}

interface TTSOptions {
  voice?: string;
  speed?: number;     // 0.5 - 2.0
  pitch?: number;
  format?: 'wav' | 'mp3';
}
```

### 4.4 VideoProvider

```typescript
interface VideoProvider {
  generate(scenes: Scene[], options?: VideoOptions): Promise<Buffer>;
}

interface VideoOptions {
  resolution?: string;  // "1080x1920"
  fps?: number;         // 30
  format?: 'mp4' | 'webm';
  quality?: 'low' | 'medium' | 'high';
}
```

### 4.5 PublishingProvider (Diseño únicamente — no implementar)

```typescript
interface PublishingProvider {
  publish(video: Buffer, metadata: PublishMetadata): Promise<PublishResult>;
  getStatus(publishId: string): Promise<PublishStatus>;
}

interface PublishMetadata {
  title: string;
  description: string;
  tags: string[];
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook';
  scheduledAt?: Date;
}

interface PublishResult {
  platform: string;
  publishId: string;
  url?: string;
  status: 'pending' | 'published' | 'failed';
}
```

### 4.6 Proveedores Mock

Cada interface tendrá una implementación Mock:

| Provider Mock | Comportamiento |
|--------------|----------------|
| `MockLLMProvider` | Retorna texto predefinido o plantilla |
| `MockImageProvider` | Genera imagen de color sólido con texto |
| `MockTTSProvider` | Genera tono silencioso de duración específica |
| `MockVideoProvider` | Genera video placeholder con texto |
| `MockPublishingProvider` | Simula publicación exitosa |

---

## 5. Pipeline — Estados

```
┌─────────┐
│  IDEA   │  ← El usuario proporciona una idea
└────┬────┘
     │
     ▼
┌────────────┐
│ SCRIPTING  │  ← WriterAgent genera el guion
└────┬───────┘
     │
     ▼
┌──────────────┐
│ STORYBOARD   │  ← StoryboardAgent crea el storyboard
└────┬─────────┘
     │
     ▼
┌──────────────────┐
│ VISUAL_GENERATION│  ← VisualAgent genera imágenes
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ VOICE_GENERATION │  ← VoiceAgent genera audio
└────┬─────────────┘
     │
     ▼
┌────────────┐
│ SUBTITLES  │  ← Sistema genera subtítulos
└────┬───────┘
     │
     ▼
┌──────────┐
│ EDITING  │  ← EditorAgent ensambla video
└────┬─────┘
     │
     ▼
┌──────┐
│  QA  │  ← QAAgent valida calidad
└──┬───┘
   │
   ▼
┌──────────┐
│ APPROVAL │  ← Aprobación humana (pausa)
└────┬─────┘
     │
     ▼
┌────────────┐
│ PUBLISHING │  ← Publicación (post-MVP)
└────┬───────┘
     │
     ▼
┌───────────┐
│ ANALYTICS │  ← Métricas (post-MVP)
└───────────┘
```

**Estados especiales:**
- `BLOCKED` — Error que requiere intervención
- `WAITING_APPROVAL` — Pausa para revisión humana
- `CANCELLED` — Proyecto cancelado por usuario

---

## 6. Servicios

### 6.1 FFmpegService

- Encapsula toda interacción con FFmpeg
- Operaciones: recorte, conversión, composición, subtítulos, transiciones
- Ejecuta comandos FFmpeg como procesos child
- Maneja timeouts y errores de FFmpeg

### 6.2 ConfigService

- Carga configuración de `config/default.json` y variables de entorno
- Rutas base, APIs keys, parámetros por defecto
- Validación de configuración al iniciar

### 6.3 LoggerService

- Logging estructurado con niveles: debug, info, warn, error
- Escritura a archivo y consola
- Logs persistentes en `logs/`
- Correlación por project_id y pipeline_run_id

### 6.4 DatabaseService

- Conexión SQLite con better-sqlite3
- Migraciones versionadas
- Query builder simple
- Transacciones para operaciones atómicas

### 6.5 PipelineService

- Gestiona transiciones de estado del pipeline
- Registra cada paso en `pipeline_runs`
- Calcula duración de cada fase
- Habilita reanudación desde último estado

---

## 7. Modelo de Datos

### 7.1 Tabla `projects`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT (UUID) | Identificador único |
| title | TEXT | Título del proyecto |
| idea | TEXT | Idea original del usuario |
| status | TEXT | Estado actual del pipeline |
| platform | TEXT | Plataforma destino |
| config | TEXT (JSON) | Configuración del proyecto |
| created_at | TEXT | Fecha de creación |
| updated_at | TEXT | Última actualización |

### 7.2 Tabla `scenes`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT (UUID) | Identificador único |
| project_id | TEXT (FK) | Referencia a projects |
| scene_order | INTEGER | Orden en el video |
| script_text | TEXT | Texto del guion para esta escena |
| visual_prompt | TEXT | Prompt para generación de imagen |
| image_path | TEXT | Ruta a imagen generada |
| audio_path | TEXT | Ruta a audio generado |
| subtitle_text | TEXT | Texto de subtítulos |
| duration | REAL | Duración en segundos |
| status | TEXT | Estado de procesamiento de la escena |

### 7.3 Tabla `pipeline_runs`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT (UUID) | Identificador único |
| project_id | TEXT (FK) | Referencia a projects |
| agent | TEXT | Nombre del agente ejecutado |
| status | TEXT | success / error / pending |
| input_data | TEXT (JSON) | Datos de entrada |
| output_data | TEXT (JSON) | Datos de salida |
| error_message | TEXT | Mensaje de error si falló |
| started_at | TEXT | Inicio de ejecución |
| finished_at | TEXT | Fin de ejecución |
| duration_ms | INTEGER | Duración en milisegundos |

### 7.4 Tabla `logs`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER (PK) | Auto-incremental |
| project_id | TEXT (FK) | Referencia a projects |
| level | TEXT | debug / info / warn / error |
| message | TEXT | Mensaje del log |
| metadata | TEXT (JSON) | Datos adicionales |
| timestamp | TEXT | Timestamp ISO 8601 |

---

## 8. Estructura de Carpetas

```
D:\ContentFactoryAI\
├── src/
│   ├── agents/           # Implementación de agentes
│   │   ├── DirectorAgent.ts
│   │   ├── WriterAgent.ts
│   │   ├── StoryboardAgent.ts
│   │   ├── VisualAgent.ts
│   │   ├── VoiceAgent.ts
│   │   ├── EditorAgent.ts
│   │   └── QAAgent.ts
│   ├── providers/        # Interfaces y mocks de proveedores
│   │   ├── interfaces/
│   │   │   ├── LLMProvider.ts
│   │   │   ├── ImageProvider.ts
│   │   │   ├── TTSProvider.ts
│   │   │   ├── VideoProvider.ts
│   │   │   └── PublishingProvider.ts
│   │   └── mock/
│   │       ├── MockLLMProvider.ts
│   │       ├── MockImageProvider.ts
│   │       ├── MockTTSProvider.ts
│   │       ├── MockVideoProvider.ts
│   │       └── MockPublishingProvider.ts
│   ├── pipeline/         # Orquestador y estados
│   │   ├── PipelineOrchestrator.ts
│   │   ├── PipelineState.ts
│   │   └── PipelineRunner.ts
│   ├── services/         # Servicios compartidos
│   │   ├── FFmpegService.ts
│   │   ├── ConfigService.ts
│   │   ├── LoggerService.ts
│   │   ├── DatabaseService.ts
│   │   └── PipelineService.ts
│   ├── database/         # Migraciones y queries
│   │   ├── migrations/
│   │   └── queries/
│   ├── config/           # Configuración
│   │   └── default.json
│   ├── schemas/          # Validación de datos
│   │   ├── project.ts
│   │   ├── scene.ts
│   │   └── pipeline.ts
│   ├── utils/            # Helpers compartidos
│   │   ├── fileUtils.ts
│   │   ├── stringUtils.ts
│   │   └── dateUtils.ts
│   └── types/            # Tipos globales
│       ├── index.ts
│       ├── project.ts
│       ├── scene.ts
│       └── pipeline.ts
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── TASKS.md
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── assets/               # Recursos estáticos
├── music/                # Pistas de audio libres
├── output/               # Videos generados
├── projects/             # Datos por proyecto
├── logs/                 # Logs de ejecución
├── prompts/              # Plantillas de prompts
└── .gitignore
```

---

## 9. Flujo de Datos

```
USUARIO
  │
  │  "Quiero un Short sobre los 5 hábitos más raros de los gatos"
  │
  ▼
DirectorAgent.receiveIdea(idea)
  │
  │  → Crea proyecto en DB (status: IDEA)
  │
  ▼
WriterAgent.execute(idea)
  │
  │  → LLMProvider.generate(prompt) → guion JSON
  │  → Guarda guion en DB (status: SCRIPTING → STORYBOARD)
  │
  ▼
StoryboardAgent.execute(guion)
  │
  │  → LLMProvider.generate(prompt) → storyboard JSON
  │  → Guarda escenas en DB (status: STORYBOARD → VISUAL_GENERATION)
  │
  ▼
VisualAgent.execute(storyboard)
  │
  │  → Para cada escena:
  │     ImageProvider.generate(visualPrompt) → imagen PNG
  │     → Guarda imagen en projects/{id}/scenes/
  │  → Actualiza DB (status: VISUAL_GENERATION → VOICE_GENERATION)
  │
  ▼
VoiceAgent.execute(scenes)
  │
  │  → Para cada escena:
  │     TTSProvider.synthesize(text) → audio WAV
  │     → Guarda audio en projects/{id}/scenes/
  │  → Actualiza DB (status: VOICE_GENERATION → SUBTITLES)
  │
  ▼
SubtitleSystem.execute(scenes)
  │
  │  → Genera archivos .srt por escena
  │  → Sincroniza timing con audio
  │  → Actualiza DB (status: SUBTITLES → EDITING)
  │
  ▼
EditorAgent.execute(scenes, subtitles)
  │
  │  → FFmpegService.compose(video)
  │     - Escala imágenes a 1080x1920
  │     - Aplica zoom suave (Ken Burns)
  │     - Agrega transiciones entre escenas
  │     - Superpone subtítulos
  │     - Mezcla audio narración + música fondo
  │  → Genera MP4 final en output/
  │  → Actualiza DB (status: EDITING → QA)
  │
  ▼
QAAgent.execute(video)
  │
  │  → Verifica calidad técnica
  │  → Verifica sincronización
  │  → Genera reporte
  │  → Si aprueba: QA → APPROVAL
  │  → Si rechaza: QA → re-intenta paso anterior
  │
  ▼
DirectorAgent.requestApproval(project)
  │
  │  → Muestra preview al usuario
  │  → Espera confirmación
  │  → Si aprueba: APPROVAL → (futuro: PUBLISHING)
  │  → Si rechaza: solicita cambios
  │
  ▼
USUARIO RECIBE VIDEO FINAL
```

---

## 10. Riesgos Técnicos

| # | Riesgo | Impacto | Probabilidad | Mitigación |
|---|--------|---------|--------------|------------|
| 1 | Calidad inconsistente de imágenes generadas por IA | Alto | Alta | Generar múltiples variaciones, permitir regeneración manual |
| 2 | Sincronización audio-subtítulos deficiente | Alto | Media | Usar timestamps del TTS, validar con QAAgent |
| 3 | Tiempo de procesamiento FFmpeg lento en Windows | Medio | Alta | Procesamiento por lotes, progreso visual |
| 4 | Costos de APIs si se usan proveedores reales | Alto | Media | Límites diarios, uso de mocks durante desarrollo |
| 5 | Rate limits en proveedores externos | Medio | Alta | Cola de peticiones, backoff exponencial |
| 6 | Manejo de errores en pipeline multi-paso | Alto | Media | Transacciones, rollback, reintentos con estado |
| 7 | Formato vertical (9:16) — compatibilidad FFmpeg | Baja | Baja | Tests explícitos con resolución objetivo |
| 8 | Archivos intermedios grandes consumiendo disco | Media | Media | Limpieza automática, compresión temporal |
| 9 | SQLite concurrencia en ejecuciones paralelas | Baja | Baja | WAL mode, una ejecución a la vez por proyecto |
| 10 | Persistencia de estado del pipeline | Alta | Baja | Checkpoints en DB, reanudación desde último estado |
| 11 | Validación de calidad automatizada subjetiva | Media | Alta | QAAgent con métricas objetivas + revisión humana |
| 12 | Dependencia de FFmpeg (binario externo) | Medio | Baja | Verificar instalación al inicio, documentar setup |

---

## 11. Servicios Externos Necesarios (Post-MVP)

### LLM (Generación de texto)
- **Opción local:** Ollama con modelos como Llama 3, Mistral
- **Opción cloud:** OpenAI GPT-4, Anthropic Claude, Google Gemini
- **Uso:** Generación de guiones, storyboards, prompts visuales

### Generación de Imágenes
- **Opción local:** Stable Diffusion (via ComfyUI o diffusers)
- **Opción cloud:** DALL-E 3, Midjourney API, Stability AI
- **Uso:** Generación de visuales por escena

### TTS (Texto a Voz)
- **Opción local:** Coqui TTS, Piper
- **Opción cloud:** ElevenLabs, Azure Cognitive Services, Google Cloud TTS
- **Uso:** Narración de audio por escena

### Generación de Video
- **Opción local:** FFmpeg (básico), MoviePy
- **Opción cloud:** Runway ML, Pika Labs, Synthesia
- **Uso:** Edición avanzada, animación de imágenes (futuro)

### Publicación
- **YouTube:** YouTube Data API v3
- **TikTok:** TikTok Content Publishing API
- **Instagram:** Instagram Graph API
- **Facebook:** Facebook Graph API

---

## 12. Estimación de Costos Mensuales (Fase Real)

| Servicio | Tier Básico | Tier Medio | Tier Alto |
|----------|-------------|------------|-----------|
| LLM (GPT-4) | $50/mes | $120/mes | $200/mes |
| TTS (ElevenLabs) | $30/mes | $60/mes | $100/mes |
| Imágenes (DALL-E) | $50/mes | $100/mes | $150/mes |
| VPS/Cloud | $20/mes | $50/mes | $100/mes |
| Dominio + SSL | $15/mes | $15/mes | $15/mes |
| **Total** | **$165/mes** | **$345/mes** | **$565/mes** |

**Durante desarrollo (días 1-24):** $0 — Todo usa mocks y ejecución local.

---

## 13. Componentes: Local vs. Cloud

| Componente | Ejecutable Localmente | Requiere Cloud |
|-----------|----------------------|----------------|
| Node.js + TypeScript | ✅ | — |
| SQLite | ✅ | — |
| FFmpeg | ✅ (requiere instalación) | — |
| Lógica de agentes | ✅ | — |
| Mock providers | ✅ | — |
| Config y logging | ✅ | — |
| Tests unitarios | ✅ | — |
| LLM real | ⚠️ (Ollama local) | ✅ (GPT-4, Claude) |
| TTS real | ⚠️ (Coqui local) | ✅ (ElevenLabs) |
| Generación de imágenes | ⚠️ (SD local, GPU) | ✅ (DALL-E, Midjourney) |
| Generación de video | ⚠️ (FFmpeg básico) | ✅ (Runway, Pika) |
| Publicación automática | — | ✅ |
| Dashboard web | ✅ (desarrollo) | ✅ (producción) |

---

## 14. Decisiones Arquitectónicas

### ADR-001: SQLite como base de datos
**Decisión:** Usar SQLite para persistencia.
**Justificación:** Sin dependencias externas, fácil de instalar, suficiente para un solo usuario en fase MVP. Migración a PostgreSQL si se necesita concurrencia futura.

### ADR-002: Provider Pattern para servicios de IA
**Decisión:** Interfaz común para todos los proveedores con implementaciones Mock y Reales.
**Justificación:** Permite desarrollo sin costos, testing predecible, y migración gradual a proveedores reales.

### ADR-003: Pipeline basado en estados
**Decisión:** Pipeline como máquina de estados persistida en SQLite.
**Justificación:** Permite reanudación, auditoría, debugging, y métricas de rendimiento por fase.

### ADR-004: FFmpeg como motor de video
**Decisión:** Usar FFmpeg para toda manipulación de video/audio.
**Justificación:** Estándar de la industria, gratuito, extensible, amplio soporte de formatos.

### ADR-005: Arquitectura multiagente con orquestador
**Decisión:** Un agente central (Director) que coordina agentes especializados.
**Justificación:** Separación de responsabilidades, testabilidad individual, extensibilidad para agregar nuevos agentes.

---

*Documento generado el Día 1 de desarrollo.*
*Próxima actualización: Día 4 (modelo de datos final).*
