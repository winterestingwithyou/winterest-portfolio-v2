# Graph Report - winterest-portfolio-v2  (2026-08-23)

## Corpus Check
- 135 files · ~211,955 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2644 nodes · 3451 edges · 249 communities (60 shown, 189 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0f9776a`
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
- dashboard-header.tsx
- seed.ts
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
- @cloudflare/vite-plugin
- users/queries.ts
- projects/public-loaders.ts
- clsx
- about.tsx
- drizzle-orm
- user-editor-form.tsx
- lucide-react
- project-editor-form.tsx
- Content Model Direction
- @radix-ui/react-checkbox
- @radix-ui/react-hover-card
- @radix-ui/react-separator
- Public Site Direction
- react
- tailwindcss-animate
- streamdown
- Winterest Portfolio v2
- Development Phases
- dependencies
- technology-editor-form.tsx
- @tailwindcss/vite
- @tanstack/ai
- @tanstack/ai-anthropic
- technologies/queries.ts
- dashboard.users.index.tsx
- projects.index.tsx
- signal_preview.tsx
- @tanstack/ai-react
- @tanstack/match-sorter-utils
- @tanstack/query-db-collection
- @tanstack/react-query
- @tanstack/react-router
- resume.tsx
- @tanstack/react-router-ssr-query
- @tanstack/react-table
- @tanstack/router-plugin
- @tanstack/store
- hero-visual.tsx
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
- api.contact.ts
- Hyperdrive
- IncomingRequestCfPropertiesBotManagement
- Instance
- JsonWebKey
- index.tsx
- MediaTransformationGenerator
- MessageChannel
- loaders.ts
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
- better-auth
- @tanstack/react-query-devtools
- @tanstack/react-start
- @tanstack/react-store
- class-variance-authority
- CompileError
- @radix-ui/react-slot
- MediaBinding
- EventListenerObject
- Navigator
- R2Checksums
- resend
- tailwindcss
- @tanstack/ai-ollama
- @tanstack/ai-openai
- @tanstack/react-form
- @tanstack/react-router-devtools
- tw-animate-css
- @tanstack/ai-client
- getDashboardCopy

## God Nodes (most connected - your core abstractions)
1. `cn()` - 81 edges
2. `FileRoutesByPath` - 33 edges
3. `scripts` - 27 edges
4. `getDashboardCopy()` - 25 edges
5. `Event` - 25 edges
6. `getPublicCopy()` - 24 edges
7. `Console` - 21 edges
8. `compilerOptions` - 18 edges
9. `getDb()` - 16 edges
10. `URLSearchParams` - 16 edges

## Surprising Connections (you probably didn't know these)
- `PopoverHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `PopoverTitle()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `PopoverDescription()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/popover.tsx → src/lib/utils.ts
- `SidebarInput()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sidebar.tsx → src/lib/utils.ts
- `SidebarGroupAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sidebar.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (249 total, 189 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (834): RFC-2253, RFC-3339, RFC-5246, RFC-9440, AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions (+826 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.10
Nodes (30): DashboardSidebarProps, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+22 more)

### Community 2 - "cn"
Cohesion: 0.11
Nodes (20): Badge(), badgeVariants, Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+12 more)

### Community 3 - "routeTree.gen.ts"
Cohesion: 0.04
Nodes (53): Route, Route, Route, Route, Route, Route, Route, Route (+45 more)

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
Cohesion: 0.25
Nodes (6): CategoryEditorForm(), CategoryEditorFormProps, slugify(), CategoryRecord, Route, Route

### Community 8 - "projects/queries.ts"
Cohesion: 0.12
Nodes (31): contentLocales, projects, projectTechnologies, createProject(), DashboardProjectRecord, deleteProject(), getDashboardProjectByIdOrSlug(), getProjectByIdOrSlug() (+23 more)

### Community 9 - "scripts"
Cohesion: 0.05
Nodes (36): imports, name, pnpm, onlyBuiltDependencies, private, scripts, build, cf-typegen (+28 more)

### Community 10 - "schema.ts"
Cohesion: 0.10
Nodes (19): accountRelations, categories, categoriesRelations, contentStatuses, contentVisibilities, ContentVisibility, media, projectsRelations (+11 more)

### Community 11 - "data.ts"
Cohesion: 0.10
Nodes (22): Footer(), Header(), CharacterSpotlight(), noteIcons, enthusiasms, getPortfolioContent(), getPublicCopy(), idEnthusiasms (+14 more)

### Community 12 - "compilerOptions"
Cohesion: 0.06
Nodes (30): DOM, DOM.Iterable, ES2022, eslint.config.js, node, prettier.config.js, **/*.ts, **/*.tsx (+22 more)

### Community 13 - "dashboard-header.tsx"
Cohesion: 0.11
Nodes (22): breadcrumbMap, DashboardHeaderProps, localeNames, ParaglideLocaleSwitcher(), GooeyNav(), GooeyNavItem, GooeyNavProps, applyThemeMode() (+14 more)

### Community 14 - "seed.ts"
Cohesion: 0.15
Nodes (20): Database, ContentLocale, projectTranslations, technologies, technologyCategories, D1QueryResponse, findLocalD1Database(), readEnv() (+12 more)

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
Cohesion: 0.39
Nodes (9): canAccessDashboard(), canManageContent(), canManageUsers(), DashboardUser, isUserRole(), toDashboardUser(), getDashboardUserFromRequest(), requireDashboardUser() (+1 more)

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

### Community 36 - "login.tsx"
Cohesion: 0.13
Nodes (14): DashboardHeader(), DashboardSidebar(), SidebarInset(), SidebarProvider(), getDashboardSession, useIsMobile(), Route, authCopy (+6 more)

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

### Community 139 - "users/queries.ts"
Cohesion: 0.15
Nodes (22): account, session, user, UserRole, userRoles, createUser(), deleteUser(), getUserById() (+14 more)

### Community 140 - "projects/public-loaders.ts"
Cohesion: 0.35
Nodes (8): getProjectDb(), getPublishedProject, getPublishedProjects, isMissingTableError(), normalizeLocale(), formatDate(), ProjectDetailPage(), Route

### Community 142 - "about.tsx"
Cohesion: 0.24
Nodes (9): aboutData, GenshinChar, getAboutData(), JourneyStep, KpopGroup, PriorityItem, WorkflowStep, AboutPage() (+1 more)

### Community 144 - "user-editor-form.tsx"
Cohesion: 0.43
Nodes (4): Button(), buttonVariants, Input(), UserEditorFormProps

### Community 146 - "project-editor-form.tsx"
Cohesion: 0.10
Nodes (13): formatDateForInput(), getTranslation(), LocaleOption, localeOptions, ProjectEditorForm(), ProjectEditorFormProps, ProjectFormInitial, ProjectTranslationFormValue (+5 more)

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

### Community 157 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-kit, dependencies, drizzle-kit, radix-ui, react-dom, @t3-oss/env-core, tailwind-merge, @tanstack/ai-gemini (+5 more)

### Community 158 - "technology-editor-form.tsx"
Cohesion: 0.31
Nodes (5): TechnologyWithCategories, slugify(), TechnologyEditorForm(), TechnologyEditorFormProps, Route

### Community 162 - "technologies/queries.ts"
Cohesion: 0.22
Nodes (18): getDb(), CategoryInput, createCategory(), createTechnology(), deleteCategory(), deleteTechnology(), getCategoryById(), getTechnologyById() (+10 more)

### Community 163 - "dashboard.users.index.tsx"
Cohesion: 0.17
Nodes (15): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow() (+7 more)

### Community 164 - "projects.index.tsx"
Cohesion: 0.40
Nodes (4): ProjectCard(), ProjectCardProps, PublicProjectRecord, ProjectsPage()

### Community 171 - "resume.tsx"
Cohesion: 0.43
Nodes (5): Container(), ContainerProps, SectionHeader(), SectionHeaderProps, siteProfile

### Community 188 - "api.contact.ts"
Cohesion: 0.67
Nodes (3): contactSchema, escapeHtml(), Route

### Community 193 - "index.tsx"
Cohesion: 0.21
Nodes (10): Marquee(), MarqueeProps, TechIcon(), TechIconProps, getPublicStackData, getPublicUltimateStack, ENTHUSIASM_ICONS, Route (+2 more)

### Community 196 - "loaders.ts"
Cohesion: 0.28
Nodes (8): ContentStatus, DashboardSummary, DashboardSummaryItem, emptySummary, getDashboardDb(), getDashboardSummary, isMissingTableError(), Route

### Community 250 - "getDashboardCopy"
Cohesion: 0.12
Nodes (19): DashboardShell(), DashboardShellProps, dashboardCopy, getDashboardCopy(), UserRecord, UserEditorForm(), DashboardHome(), DashboardMedia() (+11 more)

## Knowledge Gaps
- **1241 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+1236 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **189 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `better-sqlite3` connect `scripts` to `seed.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _1241 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002386634844868735 - nodes in this community are weakly interconnected._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10227272727272728 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.11088709677419355 - nodes in this community are weakly interconnected._
- **Should `routeTree.gen.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04332634521313766 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._