# Graph Report - . (2026-08-06)

## Corpus Check

- cluster-only mode — file stats not available

## Summary

- 2455 nodes · 3109 edges · 217 communities (35 shown, 182 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `35f146d6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- worker-configuration.d.ts
- getPublicCopy
- cn
- routeTree.gen.ts
- devDependencies
- ServiceWorkerGlobalScope
- Event
- content/queries.ts
- projects/queries.ts
- scripts
- schema.ts
- getDashboardCopy
- compilerOptions
- db/index.ts
- seed.ts
- Console
- components.json
- TransformStream
- URL
- ContentEditorForm.tsx
- ProjectEditorForm.tsx
- URLSearchParams
- auth.ts
- DurableObjectStorage
- Element
- Headers
- SubtleCrypto
- Blob
- Body
- Container
- FormData
- URLPattern
- DurableObjectState
- WorkerEntrypoint
- settings.json
- StreamError
- router.tsx
- Flagship
- R2ObjectBody
- dependencies
- AgentMemoryProfile
- ByteLengthQueuingStrategy
- WritableStream
- DurableObject
- DurableObjectTransaction
- ReadableStream
- Socket
- WritableStreamDefaultWriter
- en.json
- id.json
- manifest.json
- AiSearchInstance
- DurableObjectNamespace
- R2Bucket
- SqlStorageCursor
- Vectorize
- Ai
- AiSearchNamespace
- ReadableStreamBYOBReader
- VectorizeIndex
- WorkflowInstance
- dashboard.projects.index.tsx
- AiSearchItem
- AiSearchItems
- Artifacts
- ArtifactsRepo
- D1Database
- D1PreparedStatement
- KVNamespace
- ReadableByteStreamController
- ReadableStreamDefaultReader
- TextDecoder
- dashboard.tsx
- AiGateway
- Comment
- ForwardableEmailMessage
- HTMLRewriter
- HTMLRewriterDocumentContentHandlers
- ImageHandle
- ReadableStreamBYOBRequest
- ReadableStreamDefaultController
- StreamScopedCaptions
- StreamVideoHandle
- StreamWatermarks
- SyncKvStorage
- Table
- Text
- TextEncoder
- TransformStreamDefaultController
- db-collections/index.ts
- AbortController
- AiSearchJob
- AiSearchJobs
- AutoRAG
- Cache
- Crypto
- D1DatabaseSession
- DurableObjectFacets
- EndTag
- HostedImagesBinding
- HTMLRewriterElementContentHandlers
- ImageTransformationResult
- ImageTransformer
- MediaTransformationResult
- Module
- Performance
- Queue
- R2MultipartUpload
- StreamBinding
- StreamScopedDownloads
- WebSocketRequestResponsePair
- Workflow
- WorkflowEntrypoint
- content-collections.ts
- AgentMemoryNamespace
- BasicImageTransformations
- BrowserRun
- ColoLocalActorNamespace
- StubBase
- DOMException
- DurableObjectId
- ExecutionContext
- Global
- HelloWorldBinding
- ImagesBinding
- MediaTransformer
- Memory
- Message
- MessageBatch
- NodeStyleServer
- PipelineTransformationEntrypoint
- Span
- SqlStorage
- ToMarkdownService
- WorkerLoader
- WorkerStub
- WorkflowStep
- WritableStreamDefaultController
- better-auth
- class-variance-authority
- @cloudflare/vite-plugin
- clsx
- drizzle-kit
- drizzle-orm
- @faker-js/faker
- lucide-react
- marked
- radix-ui
- @radix-ui/react-checkbox
- @radix-ui/react-hover-card
- @radix-ui/react-separator
- @radix-ui/react-slot
- react
- react-dom
- streamdown
- @t3-oss/env-core
- tailwind-merge
- tailwindcss
- tailwindcss-animate
- @tailwindcss/vite
- @tanstack/ai
- @tanstack/ai-anthropic
- @tanstack/ai-client
- @tanstack/ai-gemini
- @tanstack/ai-ollama
- @tanstack/ai-openai
- @tanstack/ai-react
- @tanstack/match-sorter-utils
- @tanstack/query-db-collection
- @tanstack/react-query
- @tanstack/react-router
- @tanstack/react-router-devtools
- @tanstack/react-router-ssr-query
- @tanstack/react-table
- @tanstack/router-plugin
- @tanstack/store
- tw-animate-css
- zod
- prettier.config.js
- env.ts
- vite.config.ts
- AnalyticsEngineDataset
- \_\_BaseEnv_Env
- CacheContext
- CacheStorage
- CompileError
- DispatchNamespace
- DocumentEnd
- EventListenerObject
- Hyperdrive
- IncomingRequestCfPropertiesBotManagement
- Instance
- JsonWebKey
- MediaBinding
- MediaTransformationGenerator
- MessageChannel
- Navigator
- NonRetryableError
- Pipeline
- ProcessEnv
- R2Checksums
- RateLimit
- ResponseFunctionToolCall
- RpcTarget
- RuntimeError
- ScheduledController
- Scheduler
- SecretsStoreSecret
- SendEmail
- StreamVideos
- TraceItemFetchEventInfoRequest
- Tracing
- UnsafeTraceMetrics
- WebSearch

## God Nodes (most connected - your core abstractions)

1. `Database` - 38 edges
2. `cn()` - 34 edges
3. `getPublicCopy()` - 33 edges
4. `FileRoutesByPath` - 33 edges
5. `getDashboardCopy()` - 31 edges
6. `scripts` - 26 edges
7. `Event` - 25 edges
8. `Console` - 21 edges
9. `compilerOptions` - 18 edges
10. `URLSearchParams` - 16 edges

## Surprising Connections (you probably didn't know these)

- `listPublishedProjects()` --references--> `Database` [EXTRACTED]
  src/features/projects/queries.ts → src/db/index.ts
- `DashboardLabEdit()` --calls--> `getDashboardCopy()` [EXTRACTED]
  src/routes/dashboard.lab.$id.tsx → src/features/dashboard/copy.ts
- `DashboardProjectEdit()` --calls--> `getDashboardCopy()` [EXTRACTED]
  src/routes/dashboard.projects.$id.tsx → src/features/dashboard/copy.ts
- `Container()` --calls--> `cn()` [EXTRACTED]
  src/components/marketing/section.tsx → src/lib/utils.ts
- `SectionHeader()` --calls--> `cn()` [EXTRACTED]
  src/components/marketing/section.tsx → src/lib/utils.ts

## Import Cycles

- None detected.

## Communities (217 total, 182 thin omitted)

### Community 0 - "worker-configuration.d.ts"

Cohesion: 0.00
Nodes (834): RFC-2253, RFC-3339, RFC-5246, RFC-9440, AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions (+826 more)

### Community 1 - "getPublicCopy"

Cohesion: 0.05
Nodes (59): Footer(), Header(), Container(), ContainerProps, SectionHeader(), SectionHeaderProps, CharacterSpotlight(), noteIcons (+51 more)

### Community 2 - "cn"

Cohesion: 0.06
Nodes (41): localeNames, ParaglideLocaleSwitcher(), GooeyNav(), GooeyNavItem, GooeyNavProps, applyThemeMode(), getInitialMode(), ThemeMode (+33 more)

### Community 3 - "routeTree.gen.ts"

Cohesion: 0.04
Nodes (58): Route, Route, Route, Route, Route, Route, Route, Route (+50 more)

### Community 4 - "devDependencies"

Cohesion: 0.04
Nodes (48): @content-collections/core, @content-collections/vite, dotenv, eslint, @inlang/paraglide-js, jsdom, devDependencies, @content-collections/core (+40 more)

### Community 5 - "ServiceWorkerGlobalScope"

Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 6 - "Event"

Cohesion: 0.04
Nodes (12): CloseEvent, CustomEvent, EmailEvent, ErrorEvent, Event, ExtendableEvent, FetchEvent, MessageEvent (+4 more)

### Community 7 - "content/queries.ts"

Cohesion: 0.13
Nodes (40): Database, writingTranslations, upsertLabEntry(), upsertWriting(), ContentTranslationValue, createLabEntry(), createWriting(), DashboardContentRecord (+32 more)

### Community 8 - "projects/queries.ts"

Cohesion: 0.09
Nodes (35): contentStatuses, contentVisibilities, projects, projectTechnologies, projectTranslations, technologies, createProject(), DashboardProjectRecord (+27 more)

### Community 9 - "scripts"

Cohesion: 0.05
Nodes (36): better-sqlite3, better-sqlite3, imports, name, pnpm, onlyBuiltDependencies, private, scripts (+28 more)

### Community 10 - "schema.ts"

Cohesion: 0.07
Nodes (30): account, accountRelations, ContentStatus, ContentVisibility, labEntriesRelations, labEntryTranslationsRelations, media, projectsRelations (+22 more)

### Community 11 - "getDashboardCopy"

Cohesion: 0.13
Nodes (21): DashboardShell(), DashboardShellProps, ContentKind, ContentList(), ContentListProps, ContentRow, formatLocales(), dashboardCopy (+13 more)

### Community 12 - "compilerOptions"

Cohesion: 0.06
Nodes (30): DOM, DOM.Iterable, ES2022, eslint.config.js, node, prettier.config.js, **/\*.ts, **/\*.tsx (+22 more)

### Community 13 - "db/index.ts"

Cohesion: 0.21
Nodes (14): getDb(), canAccessDashboard(), canManageContent(), getDashboardUserFromRequest(), requireDashboardUser(), handleContentApiError(), json(), contentBaseInputSchema (+6 more)

### Community 14 - "seed.ts"

Cohesion: 0.15
Nodes (19): labEntries, labEntryTranslations, TechnologyCategory, writing, D1QueryResponse, findLocalD1Database(), readEnv(), seedLocal() (+11 more)

### Community 16 - "components.json"

Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 17 - "TransformStream"

Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 19 - "ContentEditorForm.tsx"

Cohesion: 0.12
Nodes (14): ContentEditorForm(), ContentEditorFormProps, ContentFormInitial, ContentKind, ContentTranslationFormValue, ContentTranslationInitial, getTranslation(), LocaleOption (+6 more)

### Community 20 - "ProjectEditorForm.tsx"

Cohesion: 0.13
Nodes (13): getTranslation(), LocaleOption, localeOptions, ProjectEditorForm(), ProjectEditorFormProps, ProjectFormInitial, ProjectTranslationFormValue, ProjectTranslationInitial (+5 more)

### Community 22 - "auth.ts"

Cohesion: 0.24
Nodes (11): auth, db, base64UrlDecode(), base64UrlEncode(), derivePasswordKey(), encoder, hashPassword(), timingSafeEqual() (+3 more)

### Community 28 - "Body"

Cohesion: 0.15
Nodes (3): Body, Request, Response

### Community 34 - "settings.json"

Cohesion: 0.18
Nodes (10): baseLocale, locales, modules, plugin.inlang.messageFormat, pathPattern, $schema, en, https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js (+2 more)

### Community 35 - "StreamError"

Cohesion: 0.18
Nodes (11): AlreadyUploadedError, BadRequestError, ForbiddenError, InternalError, InvalidURLError, MaxFileSizeError, NotFoundError, QuotaReachedError (+3 more)

### Community 36 - "router.tsx"

Cohesion: 0.27
Nodes (7): getContext(), getRouter(), NotFoundPage(), Register, @tanstack/react-router, Register, routeTree

### Community 39 - "dependencies"

Cohesion: 0.33
Nodes (9): dependencies, @tanstack/react-db, @tanstack/react-devtools, @tanstack/react-form, @tanstack/react-query-devtools, @tanstack/react-start, @tanstack/react-store, @tanstack/react-db (+1 more)

### Community 41 - "ByteLengthQueuingStrategy"

Cohesion: 0.22
Nodes (3): ByteLengthQueuingStrategy, CountQueuingStrategy, QueuingStrategy

### Community 48 - "en.json"

Cohesion: 0.25
Nodes (7): about_page, current_locale, example_message, home_page, language_label, learn_router, $schema

### Community 49 - "id.json"

Cohesion: 0.25
Nodes (7): about_page, current_locale, example_message, home_page, language_label, learn_router, $schema

### Community 50 - "manifest.json"

Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 61 - "dashboard.projects.index.tsx"

Cohesion: 0.40
Nodes (4): DashboardProjects(), formatLocales(), ProjectRow, Route

### Community 89 - "db-collections/index.ts"

Cohesion: 0.50
Nodes (3): Message, MessageSchema, messagesCollection

### Community 115 - "BasicImageTransformations"

Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

## Knowledge Gaps

- **1140 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+1135 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **182 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `better-sqlite3` connect `scripts` to `seed.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `Event` connect `Event` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`, `better-auth`, `class-variance-authority`, `@cloudflare/vite-plugin`, `clsx`, `drizzle-kit`, `drizzle-orm`, `@faker-js/faker`, `lucide-react`, `marked`, `radix-ui`, `@radix-ui/react-checkbox`, `@radix-ui/react-hover-card`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `react`, `react-dom`, `streamdown`, `@t3-oss/env-core`, `tailwind-merge`, `tailwindcss`, `tailwindcss-animate`, `@tailwindcss/vite`, `@tanstack/ai`, `@tanstack/ai-anthropic`, `@tanstack/ai-client`, `@tanstack/ai-gemini`, `@tanstack/ai-ollama`, `@tanstack/ai-openai`, `@tanstack/ai-react`, `@tanstack/match-sorter-utils`, `@tanstack/query-db-collection`, `@tanstack/react-query`, `@tanstack/react-router`, `@tanstack/react-router-devtools`, `@tanstack/react-router-ssr-query`, `@tanstack/react-table`, `@tanstack/router-plugin`, `@tanstack/store`, `tw-animate-css`, `zod`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _1140 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002386634844868735 - nodes in this community are weakly interconnected._
- **Should `getPublicCopy` be split into smaller, more focused modules?**
  _Cohesion score 0.05052125100240577 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.056051587301587304 - nodes in this community are weakly interconnected._
