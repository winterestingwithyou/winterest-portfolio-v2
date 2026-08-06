# Graph Report - winterest-portfolio-v2  (2026-08-06)

## Corpus Check
- 93 files · ~181,931 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2421 nodes · 2799 edges · 233 communities (47 shown, 186 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ff0b2d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- worker-configuration.d.ts
- data.ts
- cn
- routeTree.gen.ts
- devDependencies
- ServiceWorkerGlobalScope
- Event
- section.tsx
- queries.ts
- scripts
- schema.ts
- ProjectEditorForm.tsx
- compilerOptions
- api.projects.$id.ts
- seed-cli.ts
- Console
- components.json
- TransformStream
- URL
- AGENTS.md
- session.ts
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
- @tanstack/react-db
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
- Winterest Portfolio V2 Handover
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
- public-loaders.ts
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
- dependencies
- login.tsx
- package.json
- clsx
- drizzle-kit
- drizzle-orm
- @faker-js/faker
- lucide-react
- marked
- Content Model Direction
- @radix-ui/react-checkbox
- @radix-ui/react-hover-card
- @radix-ui/react-separator
- Public Site Direction
- react
- react-dom
- streamdown
- Winterest Portfolio v2
- Development Phases
- tailwindcss
- tailwindcss-animate
- @tailwindcss/vite
- @tanstack/ai
- @tanstack/ai-anthropic
- better-auth
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
- __BaseEnv_Env
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
- Package Manager and Commands
- Project Identity
- rules/graphify.md
- workflows/graphify.md
- better-sqlite3
- @tanstack/react-devtools
- @tanstack/react-form
- @tanstack/react-query-devtools
- @tanstack/react-start
- @tanstack/react-store
- class-variance-authority

## God Nodes (most connected - your core abstractions)
1. `cn()` - 34 edges
2. `scripts` - 26 edges
3. `getPublicCopy()` - 25 edges
4. `Event` - 25 edges
5. `Console` - 21 edges
6. `FileRoutesByPath` - 19 edges
7. `compilerOptions` - 18 edges
8. `Database` - 17 edges
9. `URLSearchParams` - 16 edges
10. `getDashboardCopy()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ContactPage()` --calls--> `getPublicCopy()`  [EXTRACTED]
  src/routes/contact.tsx → src/features/portfolio/data.ts
- `ProjectsPage()` --calls--> `getPublicCopy()`  [EXTRACTED]
  src/routes/projects.index.tsx → src/features/portfolio/data.ts
- `Container()` --calls--> `cn()`  [EXTRACTED]
  src/components/marketing/section.tsx → src/lib/utils.ts
- `SectionHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/marketing/section.tsx → src/lib/utils.ts
- `Card()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (233 total, 186 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (834): RFC-2253, RFC-3339, RFC-5246, RFC-9440, AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions (+826 more)

### Community 1 - "data.ts"
Cohesion: 0.11
Nodes (23): Footer(), Header(), CharacterSpotlight(), noteIcons, HeroVisual(), signalItems, getPortfolioContent(), getPublicCopy() (+15 more)

### Community 2 - "cn"
Cohesion: 0.07
Nodes (34): localeNames, ParaglideLocaleSwitcher(), GooeyNav(), GooeyNavItem, GooeyNavProps, applyThemeMode(), getInitialMode(), ThemeMode (+26 more)

### Community 3 - "routeTree.gen.ts"
Cohesion: 0.07
Nodes (37): Route, Route, Route, Route, Route, Route, Route, Route (+29 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (49): @content-collections/core, @content-collections/vite, dotenv, eslint, @inlang/paraglide-js, jsdom, devDependencies, @content-collections/core (+41 more)

### Community 5 - "ServiceWorkerGlobalScope"
Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 6 - "Event"
Cohesion: 0.04
Nodes (12): CloseEvent, CustomEvent, EmailEvent, ErrorEvent, Event, ExtendableEvent, FetchEvent, MessageEvent (+4 more)

### Community 7 - "section.tsx"
Cohesion: 0.16
Nodes (14): Container(), ContainerProps, SectionHeader(), SectionHeaderProps, SignalPreview(), SignalPreviewProps, ContactPage(), Route (+6 more)

### Community 8 - "queries.ts"
Cohesion: 0.20
Nodes (23): Database, projectTranslations, createProject(), DashboardProjectRecord, deleteProject(), getDashboardProjectByIdOrSlug(), getProjectByIdOrSlug(), getPublishedProjectBySlug() (+15 more)

### Community 9 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, cf-typegen, check, db:fresh:local, db:fresh:remote, db:generate, db:list:local (+18 more)

### Community 10 - "schema.ts"
Cohesion: 0.10
Nodes (24): account, accountRelations, ContentVisibility, media, projects, projectsRelations, projectTechnologies, projectTechnologiesRelations (+16 more)

### Community 11 - "ProjectEditorForm.tsx"
Cohesion: 0.10
Nodes (24): DashboardShell(), DashboardShellProps, dashboardCopy, getDashboardCopy(), getTranslation(), LocaleOption, localeOptions, ProjectEditorForm() (+16 more)

### Community 12 - "compilerOptions"
Cohesion: 0.06
Nodes (30): DOM, DOM.Iterable, ES2022, eslint.config.js, node, prettier.config.js, **/*.ts, **/*.tsx (+22 more)

### Community 13 - "api.projects.$id.ts"
Cohesion: 0.11
Nodes (16): getDb(), ContentStatus, contentStatuses, contentVisibilities, DashboardSummary, DashboardSummaryItem, emptySummary, getDashboardDb() (+8 more)

### Community 14 - "seed-cli.ts"
Cohesion: 0.33
Nodes (8): D1QueryResponse, findLocalD1Database(), readEnv(), seedLocal(), seedRemote(), seedPortfolioData(), upsertProject(), upsertTechnology()

### Community 16 - "components.json"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 17 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 19 - "AGENTS.md"
Cohesion: 0.05
Nodes (41): 3D and Character Direction, Accessibility, Agent Behavior, Animation Rules, Authentication Direction, Better Auth Implementation Rules, Cloudflare Runtime Rules, CMS Dashboard Direction (+33 more)

### Community 20 - "session.ts"
Cohesion: 0.38
Nodes (8): userRoles, canAccessDashboard(), canManageContent(), DashboardUser, isUserRole(), toDashboardUser(), getDashboardUserFromRequest(), requireDashboardUser()

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

### Community 61 - "Winterest Portfolio V2 Handover"
Cohesion: 0.12
Nodes (16): Current Progress Compared To `AGENTS.md`, Current User Preferences Learned, Database/Migrations Notes, Hard Rules For The Next Agent, Internationalization State, Phase 1: Clean Starter And Public Shell, Phase 2: Portfolio Content, Phase 3: Database And CMS Foundation (+8 more)

### Community 72 - "public-loaders.ts"
Cohesion: 0.16
Nodes (8): ContentLocale, contentLocales, getProjectDb(), getPublishedProject, getPublishedProjects, formatProjectDate(), ProjectDetailPage(), Route

### Community 89 - "db-collections/index.ts"
Cohesion: 0.50
Nodes (3): Message, MessageSchema, messagesCollection

### Community 115 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 138 - "dependencies"
Cohesion: 0.15
Nodes (13): @cloudflare/vite-plugin, dependencies, @cloudflare/vite-plugin, radix-ui, @radix-ui/react-slot, @t3-oss/env-core, tailwind-merge, @tanstack/ai-client (+5 more)

### Community 139 - "login.tsx"
Cohesion: 0.21
Nodes (8): getDashboardSession, Route, AuthMode, getCopy(), getModeButtonClass(), LoginPage(), LoginSearch, Route

### Community 140 - "package.json"
Cohesion: 0.20
Nodes (9): imports, name, pnpm, onlyBuiltDependencies, private, type, better-sqlite3, esbuild (+1 more)

### Community 147 - "Content Model Direction"
Cohesion: 0.18
Nodes (11): Content Model Direction, `experience`, `labEntries`, `media`, `projects`, `projectTech`, `siteSettings`, `skills` (+3 more)

### Community 151 - "Public Site Direction"
Cohesion: 0.20
Nodes (10): `/`, `/about`, `/contact`, `/lab`, `/projects`, `/projects/$slug`, Public Site Direction, `/resume` (+2 more)

### Community 155 - "Winterest Portfolio v2"
Cohesion: 0.20
Nodes (9): Authentication, Current Phase, Database, Deployment, Development, Direction, Owner-Run Commands, Stack (+1 more)

### Community 156 - "Development Phases"
Cohesion: 0.29
Nodes (7): Development Phases, Phase 1: Clean Starter and Build Public Shell, Phase 2: Portfolio Content, Phase 3: Database and CMS Foundation, Phase 4: Auth and RBAC, Phase 5: Writing, Lab, Media, Phase 6: Visual Polish and 3D

## Knowledge Gaps
- **1194 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+1189 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **186 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `better-sqlite3` connect `package.json` to `seed-cli.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _1194 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002386634844868735 - nodes in this community are weakly interconnected._
- **Should `data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10887096774193548 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06568832983927324 - nodes in this community are weakly interconnected._
- **Should `routeTree.gen.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06543385490753911 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._