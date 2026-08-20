# Graph Report - winterest-portfolio-v2  (2026-08-20)

## Corpus Check
- 126 files · ~208,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2683 nodes · 3333 edges · 250 communities (64 shown, 186 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c858a56e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- worker-configuration.d.ts
- sidebar.tsx
- cn
- routeTree.gen.ts
- devDependencies
- ServiceWorkerGlobalScope
- Event
- dashboard.stack.categories.$id.tsx
- projects/queries.ts
- scripts
- schema.ts
- data.ts
- compilerOptions
- about.tsx
- seed-cli.ts
- Console
- components.json
- TransformStream
- URL
- AGENTS.md
- session.ts
- URLSearchParams
- password.ts
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
- login.tsx
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
- router.tsx
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
- api.projects.$id.ts
- index.tsx
- clsx
- drizzle-kit
- drizzle-orm
- loaders.ts
- lucide-react
- better-auth
- Content Model Direction
- @radix-ui/react-checkbox
- @radix-ui/react-hover-card
- @radix-ui/react-separator
- Public Site Direction
- react
- 5. Things I Care About
- streamdown
- Winterest Portfolio v2
- Development Phases
- class-variance-authority
- technology-editor-form.tsx
- @tailwindcss/vite
- @tanstack/ai
- @tanstack/ai-anthropic
- technologies/queries.ts
- dashboard.projects.index.tsx
- dashboard-header.tsx
- signal_preview.tsx
- @tanstack/ai-react
- @tanstack/match-sorter-utils
- @tanstack/query-db-collection
- @tanstack/react-query
- @tanstack/react-router
- radix-ui
- @tanstack/react-router-ssr-query
- @tanstack/react-table
- @tanstack/router-plugin
- @tanstack/store
- @radix-ui/react-slot
- zod
- prettier.config.js
- env.ts
- vite.config.ts
- AnalyticsEngineDataset
- __BaseEnv_Env
- CacheContext
- CacheStorage
- marked
- DispatchNamespace
- DocumentEnd
- react-dom
- Hyperdrive
- IncomingRequestCfPropertiesBotManagement
- Instance
- JsonWebKey
- @t3-oss/env-core
- MediaTransformationGenerator
- MessageChannel
- tailwind-merge
- NonRetryableError
- Pipeline
- ProcessEnv
- @faker-js/faker
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
- @tanstack/ai-client
- @tanstack/react-query-devtools
- @tanstack/react-start
- @tanstack/react-store
- @cloudflare/vite-plugin
- CompileError
- @tanstack/ai-gemini
- MediaBinding
- EventListenerObject
- Navigator
- R2Checksums
- Workflow details
- tailwindcss
- 7. Currently Exploring
- 6. Beyond Code
- about-page-content-spec.md
- 4. My Journey
- Core identity to communicate
- 1. Who Am I?
- 2. What Drives Me
- Writing & Design Guidance
- project-editor-form.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 81 edges
2. `Database` - 33 edges
3. `scripts` - 27 edges
4. `FileRoutesByPath` - 27 edges
5. `Event` - 25 edges
6. `getPublicCopy()` - 23 edges
7. `Console` - 21 edges
8. `5. Things I Care About` - 20 edges
9. `compilerOptions` - 18 edges
10. `getDashboardCopy()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `useIsMobile()` --references--> `react`  [EXTRACTED]
  src/hooks/use-mobile.ts → package.json
- `PopoverHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (250 total, 186 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (834): RFC-2253, RFC-3339, RFC-5246, RFC-9440, AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions (+826 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.11
Nodes (29): DashboardSidebarProps, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+21 more)

### Community 2 - "cn"
Cohesion: 0.11
Nodes (21): Badge(), badgeVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+13 more)

### Community 3 - "routeTree.gen.ts"
Cohesion: 0.05
Nodes (50): Route, Route, Route, Route, Route, Route, Route, Route (+42 more)

### Community 4 - "devDependencies"
Cohesion: 0.04
Nodes (49): @content-collections/core, @content-collections/vite, dotenv, eslint, @inlang/paraglide-js, jsdom, devDependencies, @content-collections/core (+41 more)

### Community 5 - "ServiceWorkerGlobalScope"
Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 6 - "Event"
Cohesion: 0.04
Nodes (12): CloseEvent, CustomEvent, EmailEvent, ErrorEvent, Event, ExtendableEvent, FetchEvent, MessageEvent (+4 more)

### Community 7 - "dashboard.stack.categories.$id.tsx"
Cohesion: 0.17
Nodes (7): CategoryEditorForm(), CategoryEditorFormProps, slugify(), CategoryRecord, PublicStackCategory, Route, Route

### Community 8 - "projects/queries.ts"
Cohesion: 0.20
Nodes (24): Database, createProject(), DashboardProjectRecord, deleteProject(), getDashboardProjectByIdOrSlug(), getProjectByIdOrSlug(), getPublishedProjectBySlug(), getPublishedPublicProjectBySlug() (+16 more)

### Community 9 - "scripts"
Cohesion: 0.05
Nodes (36): imports, name, pnpm, onlyBuiltDependencies, private, scripts, build, cf-typegen (+28 more)

### Community 10 - "schema.ts"
Cohesion: 0.09
Nodes (28): account, accountRelations, categories, categoriesRelations, ContentVisibility, media, projects, projectsRelations (+20 more)

### Community 11 - "data.ts"
Cohesion: 0.08
Nodes (26): Footer(), Header(), GooeyNav(), GooeyNavItem, GooeyNavProps, CharacterSpotlight(), noteIcons, enthusiasms (+18 more)

### Community 12 - "compilerOptions"
Cohesion: 0.06
Nodes (30): DOM, DOM.Iterable, ES2022, eslint.config.js, node, prettier.config.js, **/*.ts, **/*.tsx (+22 more)

### Community 13 - "about.tsx"
Cohesion: 0.12
Nodes (20): localeNames, applyThemeMode(), getInitialMode(), ThemeMode, ThemeToggle(), Popover(), PopoverContent(), PopoverDescription() (+12 more)

### Community 14 - "seed-cli.ts"
Cohesion: 0.29
Nodes (9): D1QueryResponse, findLocalD1Database(), readEnv(), seedLocal(), seedRemote(), seedPortfolioData(), upsertCategory(), upsertProject() (+1 more)

### Community 16 - "components.json"
Cohesion: 0.10
Nodes (20): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+12 more)

### Community 17 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 19 - "AGENTS.md"
Cohesion: 0.05
Nodes (41): 3D and Character Direction, Accessibility, Agent Behavior, Animation Rules, Authentication Direction, Better Auth Implementation Rules, Cloudflare Runtime Rules, CMS Dashboard Direction (+33 more)

### Community 20 - "session.ts"
Cohesion: 0.21
Nodes (12): UserRole, userRoles, canAccessDashboard(), canManageContent(), DashboardUser, isUserRole(), toDashboardUser(), getDashboardUserFromRequest() (+4 more)

### Community 22 - "password.ts"
Cohesion: 0.38
Nodes (8): base64UrlDecode(), base64UrlEncode(), derivePasswordKey(), encoder, hashPassword(), timingSafeEqual(), toArrayBufferBytes(), verifyPassword()

### Community 28 - "Body"
Cohesion: 0.15
Nodes (3): Body, Request, Response

### Community 34 - "settings.json"
Cohesion: 0.18
Nodes (10): baseLocale, locales, modules, plugin.inlang.messageFormat, pathPattern, $schema, en, https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js (+2 more)

### Community 35 - "StreamError"
Cohesion: 0.18
Nodes (11): AlreadyUploadedError, BadRequestError, ForbiddenError, InternalError, InvalidURLError, MaxFileSizeError, NotFoundError, QuotaReachedError (+3 more)

### Community 36 - "login.tsx"
Cohesion: 0.15
Nodes (12): DashboardHeader(), DashboardSidebar(), ParaglideLocaleSwitcher(), SidebarInset(), getDashboardSession, Route, AuthMode, getCopy() (+4 more)

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

### Community 72 - "router.tsx"
Cohesion: 0.27
Nodes (7): getContext(), getRouter(), NotFoundPage(), Register, @tanstack/react-router, Register, routeTree

### Community 89 - "db-collections/index.ts"
Cohesion: 0.50
Nodes (3): Message, MessageSchema, messagesCollection

### Community 115 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 138 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, tailwindcss-animate, @tanstack/ai-ollama, @tanstack/ai-openai, @tanstack/react-form, @tanstack/react-router-devtools, tw-animate-css, tailwindcss-animate (+5 more)

### Community 139 - "api.projects.$id.ts"
Cohesion: 0.17
Nodes (11): contentStatuses, contentVisibilities, ProjectInput, projectInputSchema, projectTranslationSchema, handleApiError(), handleApiError(), json() (+3 more)

### Community 140 - "index.tsx"
Cohesion: 0.09
Nodes (27): Container(), ContainerProps, SectionHeader(), SectionHeaderProps, ProjectCard(), ProjectCardProps, Marquee(), MarqueeProps (+19 more)

### Community 144 - "loaders.ts"
Cohesion: 0.25
Nodes (6): ContentStatus, DashboardSummary, DashboardSummaryItem, emptySummary, getDashboardDb(), getDashboardSummary

### Community 147 - "Content Model Direction"
Cohesion: 0.18
Nodes (11): Content Model Direction, `experience`, `labEntries`, `media`, `projects`, `projectTech`, `siteSettings`, `skills` (+3 more)

### Community 151 - "Public Site Direction"
Cohesion: 0.20
Nodes (10): `/`, `/about`, `/contact`, `/lab`, `/projects`, `/projects/$slug`, Public Site Direction, `/resume` (+2 more)

### Community 152 - "react"
Cohesion: 0.40
Nodes (5): react, react, SidebarMenuSkeleton(), SidebarProvider(), useIsMobile()

### Community 153 - "5. Things I Care About"
Cohesion: 0.10
Nodes (20): 5. Things I Care About, Accessibility, Automation, Developer Experience, Documentation, Efficiency, Good Architecture, Long-term usefulness (+12 more)

### Community 155 - "Winterest Portfolio v2"
Cohesion: 0.20
Nodes (9): Authentication, Current Phase, Database, Deployment, Development, Direction, Owner-Run Commands, Stack (+1 more)

### Community 156 - "Development Phases"
Cohesion: 0.29
Nodes (7): Development Phases, Phase 1: Clean Starter and Build Public Shell, Phase 2: Portfolio Content, Phase 3: Database and CMS Foundation, Phase 4: Auth and RBAC, Phase 5: Writing, Lab, Media, Phase 6: Visual Polish and 3D

### Community 158 - "technology-editor-form.tsx"
Cohesion: 0.25
Nodes (6): TechnologyWithCategories, slugify(), TechnologyEditorForm(), TechnologyEditorFormProps, Route, Route

### Community 162 - "technologies/queries.ts"
Cohesion: 0.20
Nodes (17): getDb(), CategoryInput, createCategory(), createTechnology(), deleteCategory(), deleteTechnology(), getCategoryById(), getTechnologyById() (+9 more)

### Community 163 - "dashboard.projects.index.tsx"
Cohesion: 0.18
Nodes (13): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow() (+5 more)

### Community 164 - "dashboard-header.tsx"
Cohesion: 0.29
Nodes (6): breadcrumbMap, DashboardHeaderProps, Button(), buttonVariants, Separator(), authClient

### Community 239 - "Workflow details"
Cohesion: 0.15
Nodes (13): 01 — Understand the Problem, 02 — Define the Goal, 03 — Research & Design, 04 — Build the Minimum Deployable Solution, 05 — Test, 06 — Deploy, 07 — Improve, 3. How I Build (+5 more)

### Community 241 - "7. Currently Exploring"
Cohesion: 0.15
Nodes (13): 7. Currently Exploring, AI Engineering, Cloud & Networking, Current focus, Current projects, Finance PWA, Future direction, Long-term career direction (+5 more)

### Community 242 - "6. Beyond Code"
Cohesion: 0.18
Nodes (11): 6. Beyond Code, Anime, Favorite, Games, Genshin Impact, Growtopia, Mobile Legends, Music — K-pop (+3 more)

### Community 244 - "about-page-content-spec.md"
Cohesion: 0.20
Nodes (9): About, About Page — Content Specification, AI Agent Implementation Reminder, Desired Visitor Impression, Index, Index/Home already covers, Overall Content Direction for the AI Agent, Purpose (+1 more)

### Community 245 - "4. My Journey"
Cohesion: 0.22
Nodes (9): 2023 — First contact with programming, 2025 onward — Going deeper, 4. My Journey, Biggest change: way of thinking, Current stage, Early 2025 — IMPHNEN turning point, Early university projects — 2024, Purpose (+1 more)

### Community 246 - "Core identity to communicate"
Cohesion: 0.25
Nodes (8): 1. Curiosity, 2. Problem solving, 3. Engineering mindset, 4. Context-aware engineering, 5. Future-oriented thinking, 6. Continuous improvement, 7. Human side, Core identity to communicate

### Community 247 - "1. Who Am I?"
Cohesion: 0.25
Nodes (8): 1. Who Am I?, Coding mindset, Core identity, Personality / characteristics, Purpose, What differentiates me, What I enjoy about software engineering, What I want people to remember

### Community 248 - "2. What Drives Me"
Cohesion: 0.25
Nodes (8): 2. What Drives Me, How I approach difficulty, Improvement / refactoring, Long-term motivation, Origin of interest, Purpose, What feels most satisfying, What keeps me interested

### Community 249 - "Writing & Design Guidance"
Cohesion: 0.33
Nodes (6): Content principle, Important nuance, Page structure, Tone, Visual direction, Writing & Design Guidance

### Community 250 - "project-editor-form.tsx"
Cohesion: 0.10
Nodes (22): DashboardShell(), DashboardShellProps, dashboardCopy, getDashboardCopy(), formatDateForInput(), getTranslation(), LocaleOption, localeOptions (+14 more)

## Knowledge Gaps
- **1314 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+1309 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **186 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `scripts`, `clsx`, `drizzle-kit`, `drizzle-orm`, `lucide-react`, `better-auth`, `@radix-ui/react-checkbox`, `@radix-ui/react-hover-card`, `@radix-ui/react-separator`, `react`, `streamdown`, `class-variance-authority`, `@tailwindcss/vite`, `@tanstack/ai`, `@tanstack/ai-anthropic`, `@tanstack/ai-react`, `@tanstack/match-sorter-utils`, `@tanstack/query-db-collection`, `@tanstack/react-db`, `@tanstack/react-query`, `radix-ui`, `@tanstack/react-router`, `@tanstack/react-router-ssr-query`, `@tanstack/react-table`, `@tanstack/router-plugin`, `@radix-ui/react-slot`, `@tanstack/store`, `zod`, `marked`, `react-dom`, `@t3-oss/env-core`, `tailwind-merge`, `@faker-js/faker`, `better-sqlite3`, `@tanstack/react-devtools`, `@tanstack/ai-client`, `@tanstack/react-query-devtools`, `@tanstack/react-start`, `@tanstack/react-store`, `@cloudflare/vite-plugin`, `@tanstack/ai-gemini`, `tailwindcss`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `sidebar.tsx`, `dependencies`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Event` connect `Event` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _1314 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002386634844868735 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._