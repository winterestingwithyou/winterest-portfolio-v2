# AGENTS.md

## Project Identity

This repository is `winterest-portfolio-v2`, a personal portfolio website built with TanStack Start and deployed to Cloudflare.

The project should evolve from the initialized resume starter into a polished personal portfolio, CMS dashboard, and developer lab with a Cloudflare + Bun inspired aesthetic.

The desired vibe is:

- aesthetic but still professional
- Cloudflare-inspired orange and white visual language
- Bun-inspired playful developer energy
- dark mode compatible
- premium personal portfolio, not a generic resume template
- fast, accessible, responsive, and edge-friendly
- suitable for long-term semi-vibe-code development

The portfolio belongs to **M. Adam Yudistira / winterestingwithyou**.

Primary identity:

- GitHub username: `winterestingwithyou`
- Domain direction: `winterest.tech`
- Project/repo name: `winterest-portfolio-v2`
- Design theme: `Cloudflare + Bun`
- Main color direction: orange, white, black/dark gray, warm neutrals
- Tone: playful, clean, technical, personal, polished

## Core Goal

Build a long-term personal portfolio platform with:

1. Public portfolio pages
2. CMS dashboard
3. Authentication and RBAC
4. Content management for projects, writings, skills, experience, lab entries, and media
5. Optional 3D/interactive character layer
6. Cloudflare-first deployment architecture
7. Maintainable code structure for future iteration

This is not just a static portfolio. Treat it as a personal developer platform.

## Current Project State

The repository was initialized from a TanStack Start template/resume example. Some starter/demo/resume files may still exist.

When working on the project:

- Replace the starter resume design with a custom portfolio design.
- Keep useful setup from the template.
- Remove demo/resume-specific logic once replacement pages exist.
- Do not blindly preserve template naming if it no longer matches the portfolio direction.
- Prefer gradual refactors over huge rewrites unless explicitly requested.

## Tech Stack

Use the existing stack as the default foundation.

Main runtime/framework:

- Bun
- React 19
- TanStack Start
- TanStack Router
- TanStack Query
- TanStack Form
- TanStack Table
- TanStack Store
- TanStack DB / React DB where useful
- TypeScript
- Vite
- Cloudflare Vite plugin
- Wrangler
- Cloudflare Workers-compatible deployment

Styling/UI:

- Tailwind CSS v4
- shadcn/ui-style components
- Radix primitives
- lucide-react
- class-variance-authority
- clsx
- tailwind-merge
- tailwindcss-animate / tw-animate-css where appropriate

Content/data/auth:

- Drizzle ORM
- Cloudflare D1 for database
- Better Auth for authentication
- T3Env for environment validation
- Paraglide/Inlang for i18n
- Content Collections for file-based content when appropriate

Testing/linting:

- Vitest
- Testing Library
- ESLint
- Prettier
- TypeScript checks

Potential future visual tech:

- React Three Fiber
- Drei
- three.js
- React Bits-inspired animations/components
- Lightweight 3D `.glb` assets

Do not add large dependencies casually. Prefer the existing stack unless the new dependency clearly solves a real problem.

## Package Manager and Commands

Use Bun by default.

Common commands:

```bash
bun install
bun run dev
bun run build
bun run preview
bun run test
bun run lint
bun run format
bun run check
bun run deploy
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio
bun run cf-typegen
```

Before considering a task done, run the relevant checks when possible:

```bash
bun run check
bun run lint
bun run build
```

For code that touches database schema, also consider:

```bash
bun run db:generate
```

For Cloudflare bindings/type changes, also consider:

```bash
bun run cf-typegen
```

Do not use npm or pnpm unless the user explicitly asks. This project is Bun-first.

### Agent Forbidden Commands

The project owner runs development servers and database migration commands personally.

Agents must not run these commands unless the user explicitly asks in the same turn:

```bash
bun run dev
bun --bun run dev
vite dev
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio
```

`bun run preview`, `bun run cf-typegen`, `bun run check`, `bun run lint`, `bun run test`, and `bun run build` are allowed when relevant. `bun run db:generate` should only be used for intentional schema-file work.

## Deployment Target

Treat the app as a Cloudflare-first TanStack Start application.

Expected deployment direction:

- Cloudflare Workers-compatible runtime
- Cloudflare Vite plugin
- Wrangler deployment
- D1 for database
- R2 for media/assets later
- KV for cache/session/rate-limit support later if needed
- Durable Objects only if clearly necessary later

Even if the user says “Cloudflare Pages”, check the current config first. If the current repo is configured for `wrangler deploy`, keep the architecture Workers-compatible.

Avoid Node-only APIs unless the project already supports them safely under Cloudflare compatibility. Prefer Web APIs and Cloudflare-compatible patterns.

## Cloudflare Runtime Rules

Cloudflare Workers has edge-runtime constraints. When implementing server-side logic:

- Avoid long CPU-bound work.
- Avoid heavy synchronous crypto.
- Avoid Node-specific APIs unless verified compatible.
- Prefer Web Crypto APIs.
- Avoid large server bundles.
- Avoid unnecessary server-side 3D/image processing.
- Keep API handlers small and focused.
- Use caching intentionally.
- Keep database queries efficient.
- Do not run expensive logic on every request.

For authentication password hashing, avoid slow default hashing choices that may be problematic in Cloudflare CPU limits. Prefer a Cloudflare-friendly custom password hashing strategy such as PBKDF2 using Web Crypto when integrating Better Auth.

## Authentication Direction

Use Better Auth as the authentication foundation.

Recommended auth model:

- Email/password login initially
- Secure HTTP-only cookie sessions
- Database-backed sessions
- Short-lived signed cookie cache if useful
- RBAC stored in database
- Owner/admin/editor roles for dashboard access

Do not use localStorage for auth tokens.

Do not implement custom auth from scratch unless replacing a very specific missing piece around Better Auth.

Use cookie-based auth for this fullstack architecture unless there is a strong reason not to.

Required auth/security behavior:

- Secure cookies in production
- HTTP-only cookies
- SameSite strategy appropriate for deployment
- CSRF-aware server mutations
- Server-side session validation for dashboard routes
- No dashboard data exposed to unauthenticated users
- No secrets in client bundles
- No secrets committed to the repository

## RBAC Model

Start simple.

Recommended initial roles:

```txt
owner   - full access, user/role/settings/content/media management
admin   - content/media/dashboard management
editor  - create/update content, limited publishing
viewer  - read-only dashboard access, optional
```

For early implementation, `owner` and `editor` are enough.

Rules:

- Only `owner` can manage users and roles.
- Only `owner` or `admin` can change global site settings.
- `editor` can manage content but not security settings.
- Public pages must only show published content.
- Draft/private content must require dashboard access.

Do not over-engineer permissions early. Use a simple role field first, then expand to granular permissions later if needed.

## CMS Dashboard Direction

Create a clean CMS dashboard for managing portfolio content.

Recommended dashboard routes:

```txt
/dashboard
/dashboard/projects
/dashboard/projects/new
/dashboard/projects/$id
/dashboard/writing
/dashboard/writing/new
/dashboard/writing/$id
/dashboard/lab
/dashboard/lab/new
/dashboard/lab/$id
/dashboard/skills
/dashboard/experience
/dashboard/media
/dashboard/users
/dashboard/roles
/dashboard/settings
```

Dashboard style:

- clean admin layout
- sidebar navigation
- topbar with user menu
- table/list views
- create/edit forms
- preview status
- draft/published badges
- simple analytics cards later
- not too decorative compared to public site

Dashboard components should prioritize usability over visual gimmicks.

## Public Site Direction

Recommended public routes:

```txt
/
/about
/projects
/projects/$slug
/lab
/lab/$slug
/writing
/writing/$slug
/stack
/contact
/resume
```

Page responsibilities:

### `/`

Homepage with:

- strong hero section
- short personal intro
- featured projects
- selected lab experiments
- tech stack highlights
- contact CTA
- subtle character/mascot visual
- Cloudflare+Bun-inspired atmosphere

### `/about`

Personal story page with:

- developer journey
- academic/project background
- areas of interest
- timeline
- principles
- tools and workflow

### `/projects`

Project index with:

- filter by stack/category/status
- featured projects
- project cards
- links to GitHub/live demo/case study
- polished visual presentation

### `/projects/$slug`

Project detail/case study with:

- problem
- goal
- role
- stack
- architecture
- screenshots
- key features
- challenges
- results
- links

### `/lab`

Experimental/dev lab page with:

- small experiments
- UI demos
- Cloudflare experiments
- TanStack experiments
- AI experiments
- mini tools
- playful interactive entries

### `/writing`

Technical writing/devlog page with:

- articles
- learning notes
- project retrospectives
- tutorials
- engineering decisions

### `/stack`

Tech stack page with:

- favorite tools
- why they are used
- personal notes
- ratings or badges
- current/future stack

### `/contact`

Contact page with:

- email/contact form
- GitHub
- LinkedIn if available
- social links
- simple CTA

### `/resume`

Clean resume page:

- printable
- professional
- not the homepage
- can later support PDF export

## Design System

The visual direction should be consistent across the public site.

Use these design principles:

- orange as the primary accent
- white/off-white base for light mode
- dark gray/black base for dark mode
- soft orange gradients
- subtle glow effects
- glassy cards only where useful
- generous spacing
- rounded corners
- crisp borders
- gentle shadows
- thin grid/background patterns
- code/terminal-inspired accents
- cloud/blob/orbital motifs
- minimal noise texture
- no random color palettes

Suggested color tokens:

```txt
brand.orange       Cloudflare-like orange
brand.orangeSoft   soft orange tint
brand.orangeDeep   deep burnt orange
brand.cream        warm off-white
brand.dark         near-black
brand.gray         neutral dark gray
brand.border       subtle border
brand.glow         orange glow
```

Do not hardcode random orange values everywhere. Define reusable tokens/classes.

Design quality target:

- modern SaaS landing page polish
- Cloudflare/Bun-inspired personality
- portfolio credibility
- playful but not childish
- anime/mascot accent, not anime fanpage

## 3D and Character Direction

The user wants character visuals inspired by Scaramouche and Winter Aespa references in a Cloudflare+Bun theme.

Important guidance:

- Prefer original mascot/character designs inspired by the provided references, not exact replicas.
- Do not make the entire website depend on 3D performance.
- Keep 3D optional and progressively enhanced.
- Provide fallback static visuals for slow devices.
- Use lazy loading for 3D scenes.
- Avoid loading 3D assets on every page unless tiny.
- Use compressed `.glb` assets when possible.
- Keep hero 3D scene lightweight.

Recommended implementation phases:

1. Static mascot/illustration layer
2. Lightweight 3D `.glb` model in hero
3. Idle animation
4. Cursor/scroll interaction
5. Advanced scene only after core portfolio and CMS are stable

Suggested asset organization:

```txt
public/assets/characters/
public/assets/3d/
src/features/character/
src/components/visuals/
```

If using React Three Fiber later:

- Load models lazily.
- Use suspense/fallback.
- Avoid huge textures.
- Use compressed geometry/textures.
- Do not block LCP.
- Respect reduced motion preferences.

## Accessibility

Accessibility is required, not optional.

Rules:

- Use semantic HTML.
- Use buttons for actions and links for navigation.
- Every interactive element must be keyboard accessible.
- Maintain visible focus states.
- Respect `prefers-reduced-motion`.
- Keep sufficient color contrast.
- Add alt text for meaningful images.
- Mark decorative images appropriately.
- Avoid animation that harms readability.
- Forms must have labels and validation messages.
- Do not rely only on color to convey status.

## Performance

The site should feel fast and polished.

Rules:

- Optimize images.
- Lazy-load non-critical visuals.
- Keep the homepage lightweight.
- Avoid shipping dashboard-only code to public pages when possible.
- Avoid excessive animation libraries.
- Avoid unnecessary client components.
- Prefer server-rendered data where it makes sense.
- Use TanStack Query for client-side cached data where useful.
- Use route loaders where appropriate.
- Keep bundle size in mind.
- Measure before adding heavy features.

3D and animation must not hurt the core portfolio experience.

## Content Model Direction

Use database-backed CMS content for dynamic content.

Recommended entities:

### `users`

For dashboard users.

Fields may include:

```txt
id
name
email
emailVerified
image
role
createdAt
updatedAt
```

### `projects`

Portfolio projects.

Fields may include:

```txt
id
slug
title
summary
description
content
status
visibility
featured
category
coverImage
repoUrl
demoUrl
caseStudyUrl
startedAt
completedAt
publishedAt
createdAt
updatedAt
```

### `projectTech`

Project tech stack relation.

```txt
id
projectId
technologyId
```

### `technologies`

Reusable tech stack entries.

```txt
id
name
slug
category
icon
color
url
description
createdAt
updatedAt
```

### `writing`

Blog/devlog/article content.

```txt
id
slug
title
summary
content
status
coverImage
tags
publishedAt
createdAt
updatedAt
```

### `labEntries`

Experiments and mini projects.

```txt
id
slug
title
summary
content
status
demoUrl
repoUrl
coverImage
tags
publishedAt
createdAt
updatedAt
```

### `skills`

Skills shown on public pages.

```txt
id
name
category
level
description
icon
sortOrder
createdAt
updatedAt
```

### `experience`

Work/academic/project experience timeline.

```txt
id
title
organization
location
summary
content
startDate
endDate
current
tags
sortOrder
createdAt
updatedAt
```

### `media`

Uploaded media metadata.

```txt
id
filename
url
mimeType
size
width
height
alt
createdAt
updatedAt
```

### `siteSettings`

Global settings.

```txt
id
key
value
createdAt
updatedAt
```

Do not build every table at once unless requested. Start with `projects`, then expand.

## Content Collections

The initialized template uses file-based content collections for resume-like data.

Use content collections for:

- starter/static content
- seed content
- markdown-based writing if CMS is not ready yet
- local-only content during early development

Use D1/CMS for:

- dashboard-managed projects
- writing posts edited from UI
- lab entries
- media metadata
- dashboard users/settings

Do not duplicate the same content source permanently. If a model moves to database, clean up obsolete collection usage.

## File and Folder Organization

Prefer feature-based organization as the project grows.

Suggested structure:

```txt
src/
  components/
    ui/
    layout/
    marketing/
    dashboard/
    visual/
  features/
    auth/
    dashboard/
    projects/
    writing/
    lab/
    skills/
    media/
    settings/
    character/
  lib/
    auth/
    db/
    env/
    utils/
    validators/
    constants/
  db/
    schema.ts
    client.ts
    seed.ts
  routes/
    __root.tsx
    index.tsx
    about.tsx
    projects/
    lab/
    writing/
    dashboard/
    api/
  styles.css
```

Rules:

- Keep generic reusable UI in `src/components`.
- Keep domain-specific logic in `src/features`.
- Keep route files focused on routing, loading, and page composition.
- Keep database schema centralized.
- Keep validation schemas reusable.
- Avoid giant files.
- Split complex components once they become hard to scan.

## Routing Conventions

Use TanStack Router file-based routing.

Rules:

- Public routes should be simple and SEO-friendly.
- Dynamic slugs should be stable.
- Dashboard routes must validate auth/role server-side.
- API/server routes must validate input.
- Do not expose admin-only data in public loaders.
- Prefer meaningful route names over generic names.

Recommended route grouping:

```txt
src/routes/index.tsx
src/routes/about.tsx
src/routes/projects/index.tsx
src/routes/projects/$slug.tsx
src/routes/lab/index.tsx
src/routes/lab/$slug.tsx
src/routes/writing/index.tsx
src/routes/writing/$slug.tsx
src/routes/stack.tsx
src/routes/contact.tsx
src/routes/resume.tsx
src/routes/dashboard/index.tsx
src/routes/dashboard/projects/index.tsx
src/routes/dashboard/projects/new.tsx
src/routes/dashboard/projects/$id.tsx
src/routes/api/auth/$.ts
```

## Server and API Rules

For server-side logic:

- Validate inputs with Zod.
- Sanitize user-generated content.
- Check authentication before dashboard mutations.
- Check role authorization before privileged actions.
- Return consistent error shapes.
- Avoid leaking internal errors to clients.
- Keep server functions small.
- Use database transactions when needed.
- Avoid unnecessary client-side secrets.
- Keep server-only code out of client bundles.

For form actions/mutations:

- Validate data on the server.
- Do not trust client validation.
- Use optimistic UI only after server behavior is correct.
- Show clear success/error states.

## Database Rules

Use Drizzle for schema and queries.

Rules:

- Prefer explicit schema definitions.
- Use migrations for schema changes.
- Keep column names consistent.
- Use `createdAt` and `updatedAt` where useful.
- Use slugs for public content.
- Add indexes for frequently queried fields.
- Avoid N+1 queries.
- Keep seed data safe and non-sensitive.
- Do not use `better-sqlite3` in Cloudflare runtime paths.

D1-specific guidance:

- Keep queries simple and efficient.
- Avoid database work in tight loops.
- Be mindful of latency.
- Test migrations carefully.
- Keep local and remote database behavior aligned.

## Environment Variables

Use T3Env for environment validation.

Rules:

- Keep server secrets server-only.
- Prefix only public env vars that are safe for the browser.
- Do not commit `.env` files.
- Maintain `.env.example` when adding required variables.
- Validate required variables at startup.
- Document new variables in README when needed.

Potential env vars:

```txt
BETTER_AUTH_SECRET
BETTER_AUTH_URL
DATABASE_URL
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_D1_DATABASE_ID
R2_BUCKET_NAME
PUBLIC_SITE_URL
```

Actual names must match the implementation.

## Internationalization

Paraglide/Inlang exists in the project.

Use i18n thoughtfully:

- Default language can be English or Indonesian depending on final product direction.
- Do not hardcode large user-facing text everywhere if the site will support multiple languages.
- Keep route localization compatible with TanStack Router.
- Do not overcomplicate early pages if i18n is not the current task.

Preferred content direction:

- Public portfolio may support English first for professional reach.
- Indonesian can be added for personal/local context.
- Dashboard can stay English or Indonesian consistently.

Do not mix languages randomly in UI copy.

## UI Component Rules

Use shadcn/ui-style primitives and local components.

Rules:

- Keep UI components composable.
- Prefer variants via `class-variance-authority` when useful.
- Use `cn()`/tailwind-merge utilities for class composition.
- Avoid deeply nested prop APIs.
- Avoid random one-off styling when a reusable component is better.
- Keep public marketing components separate from dashboard admin components.
- Keep animations tasteful.

Suggested reusable components:

```txt
Container
Section
SectionHeader
Badge
Button
Card
GlowCard
ProjectCard
TechBadge
Timeline
CommandCard
FeatureGrid
DashboardShell
DashboardSidebar
DashboardHeader
DataTable
EmptyState
FormField
StatusBadge
```

## Animation Rules

Animations should support the aesthetic, not distract.

Allowed:

- subtle hover transitions
- fade/slide reveal
- background glow motion
- cursor-follow accent only if lightweight
- reduced-motion fallback
- small mascot movement
- page section reveal

Avoid:

- excessive parallax
- heavy scroll-jacking
- animation that delays content
- animation that harms readability
- huge libraries for tiny effects

Always respect `prefers-reduced-motion`.

## React Bits / Visual Inspiration

React Bits-style components can be used as inspiration for premium interactions.

Rules:

- Do not blindly paste large external snippets without adapting them.
- Keep components consistent with the project design system.
- Avoid unnecessary dependencies.
- Prioritize accessibility and performance.
- Do not let visual effects dominate content.
- Use visual effects mostly on homepage, project cards, and lab pages.

## Content Writing Style

Portfolio copy should sound:

- confident
- friendly
- technical
- not too corporate
- not too casual on public professional pages
- aligned with a developer building useful tools

Avoid:

- fake exaggerated claims
- generic “passionate developer” filler
- overused startup buzzwords
- too many emojis in public UI
- inconsistent tone

Good direction:

- “I build practical web systems, developer tools, and experiments around modern fullstack architecture.”
- “A personal lab for projects, notes, and edge-first web experiments.”
- “Cloudflare-powered portfolio and CMS for long-term personal work.”

## SEO and Metadata

Each public page should have:

- meaningful title
- description
- canonical URL where appropriate
- Open Graph metadata
- Twitter card metadata if useful
- semantic headings
- clean slug
- image alt text

Important public content:

- homepage
- project detail pages
- writing pages
- lab entries

Avoid generic starter metadata such as “TanStack Start Starter”.

## Forms

Use TanStack Form where appropriate.

Rules:

- Validate with Zod.
- Show clear inline errors.
- Disable submit while pending.
- Prevent duplicate submissions.
- Keep form layouts readable.
- Use server-side validation for all mutations.

CMS forms should support:

- draft/published status
- slug editing
- preview fields
- cover image URL/upload later
- tags/tech selection
- repo/demo URLs

## TanStack Query Rules

Use TanStack Query for client-side server state.

Rules:

- Use stable query keys.
- Co-locate query helpers in feature folders.
- Invalidate relevant queries after mutations.
- Avoid using Query for local UI state.
- Use TanStack Store or local component state for local state.
- Use route loaders when the data is required before rendering.

## TanStack Store Rules

Use TanStack Store for lightweight client state that is shared across components.

Good uses:

- theme state if not handled elsewhere
- dashboard UI state
- command palette state
- local editor state
- filters/sort state if shared

Avoid using TanStack Store as a database replacement.

## TanStack Table Rules

Use TanStack Table in dashboard lists.

Recommended for:

- projects list
- writing list
- lab entries list
- users list
- media list

Tables should include:

- search/filter
- sort
- status badges
- row actions
- empty states
- pagination later if needed

## Better Auth Implementation Rules

When implementing Better Auth:

- Keep auth config in a dedicated module.
- Keep client helper separate from server helper.
- Integrate with D1/Drizzle carefully.
- Use a custom password hasher suitable for Cloudflare.
- Do not expose auth secrets to the client.
- Protect dashboard routes server-side.
- Create a clear first-owner bootstrap path.

Potential bootstrap approach:

- Allow first user registration only when no users exist.
- Assign first user as `owner`.
- After owner exists, disable public registration or require invite.
- Add owner-only user creation later.

## Password Hashing Direction

Because Cloudflare has CPU constraints, avoid very slow CPU-heavy password hashing in the Worker runtime.

Preferred direction:

- Implement Better Auth custom password hashing.
- Use Web Crypto PBKDF2 or another Cloudflare-friendly approach.
- Store algorithm/version metadata if possible.
- Keep verification backward-compatible if algorithms change later.

Do not implement insecure plaintext or reversible password storage.

Do not use weak hashing such as plain SHA-256 without salt.

## Security Rules

Never commit secrets.

Never expose:

- auth secrets
- database tokens
- Cloudflare tokens
- private keys
- personal API keys
- production credentials

Always validate:

- server mutations
- dashboard access
- file uploads
- slugs
- URLs
- role changes

Additional rules:

- Escape/sanitize markdown-rendered content.
- Do not render arbitrary unsafe HTML from CMS without sanitization.
- Add rate limiting later for auth/contact endpoints.
- Use least privilege for roles.
- Keep public read APIs separate from admin mutation APIs.
- Avoid leaking whether an email exists during login/reset flows if implementing them.

## Markdown and Content Rendering

If rendering markdown:

- Sanitize output.
- Avoid unsafe raw HTML by default.
- Support code blocks.
- Support headings and links.
- Add styling through typography classes.
- Ensure external links are safe.
- Keep content readable in dark mode.

Do not use `dangerouslySetInnerHTML` without a clear sanitization step.

## Media Handling

Early stage:

- Allow cover image URL or static local image.
- Store metadata in database if CMS-managed.
- Keep files in `public` for simple assets.

Later stage:

- Use Cloudflare R2 for uploads.
- Store R2 object key and public URL in database.
- Validate file type and size.
- Generate alt text field manually.
- Avoid uploading huge unoptimized images.

Recommended asset paths:

```txt
public/assets/images/
public/assets/characters/
public/assets/3d/
public/assets/projects/
```

## Testing Expectations

Add or update tests for important logic.

Prioritize tests for:

- auth helpers
- role guards
- slug utilities
- validation schemas
- database query helpers
- dashboard mutations
- public content loaders

Use Vitest.

Before finalizing major changes, run:

```bash
bun run test
bun run lint
bun run build
```

If tests cannot run due environment limitations, clearly report what was not run and why.

## Code Style

General rules:

- TypeScript-first
- Prefer explicit types for exported functions
- Keep functions small and readable
- Avoid `any` unless justified
- Avoid duplicated logic
- Prefer named constants for repeated values
- Use clear component names
- Use early returns for readability
- Keep imports organized
- Remove unused code
- Remove starter/demo code when replaced

React rules:

- Keep components focused.
- Split large components.
- Avoid unnecessary `useEffect`.
- Prefer derived values over duplicated state.
- Keep server/client boundaries clear.
- Avoid hydration mismatch patterns.
- Use stable keys.

CSS/Tailwind rules:

- Use design tokens/classes consistently.
- Avoid giant unreadable class strings when a component abstraction helps.
- Keep responsive behavior intentional.
- Test light and dark mode.
- Avoid random one-off colors.

## Error Handling

Errors should be clear and user-friendly.

Rules:

- Do not expose stack traces to users.
- Log useful details server-side when possible.
- Show actionable error messages.
- Use empty states instead of broken UIs.
- Gracefully handle missing content.
- Return 404 for unknown public slugs.
- Redirect unauthenticated dashboard users to login.

## Git and Change Management

When making changes:

- Keep commits focused if committing.
- Do not mix unrelated refactors.
- Preserve user work.
- Do not delete files without checking whether they are still needed.
- Prefer small incremental changes.
- Update docs when behavior changes.
- Do not rewrite the entire project unless explicitly requested.

Suggested commit style:

```txt
feat: add portfolio homepage shell
feat: add projects content model
fix: protect dashboard routes
refactor: split project card component
chore: remove resume starter content
docs: update setup instructions
```

## README Expectations

Eventually update README to reflect the real project.

README should include:

- project description
- tech stack
- setup
- env vars
- development commands
- database commands
- deployment notes
- design direction
- license if applicable

Remove generic starter-only README sections once the project identity is established.

## Development Phases

Follow this recommended phased implementation unless the user asks otherwise.

### Phase 1: Clean Starter and Build Public Shell

Goal:

- Remove obvious starter/resume identity.
- Build base layout.
- Define theme.
- Create homepage shell.
- Add navigation and footer.
- Add placeholder portfolio content.

Deliverables:

- `/`
- `/about`
- `/projects`
- `/contact`
- design tokens
- layout components

### Phase 2: Portfolio Content

Goal:

- Add project cards.
- Add project detail pages.
- Add skills/stack section.
- Add lab and writing placeholders.

Deliverables:

- `/projects/$slug`
- `/lab`
- `/writing`
- `/stack`
- local seed data or content collections

### Phase 3: Database and CMS Foundation

Goal:

- Add D1/Drizzle schema.
- Add projects table.
- Add dashboard shell.
- Add project CRUD.

Deliverables:

- Drizzle schema
- dashboard layout
- projects list
- create/edit project form
- public pages read published projects

### Phase 4: Auth and RBAC

Goal:

- Add Better Auth.
- Protect dashboard.
- Add owner bootstrap.
- Add role guard.

Deliverables:

- login page
- auth route
- protected dashboard
- owner/editor model

### Phase 5: Writing, Lab, Media

Goal:

- Expand CMS to writing/lab/media.
- Add markdown editor or text editor.
- Add published/draft workflow.

Deliverables:

- writing CRUD
- lab CRUD
- media metadata
- public writing/lab pages

### Phase 6: Visual Polish and 3D

Goal:

- Add character/mascot visual layer.
- Add high-quality animations.
- Add 3D only when core app is stable.

Deliverables:

- static mascot or 3D model integration
- lazy-loaded hero visual
- reduced-motion support
- mobile-safe fallback

## Things to Avoid

Do not:

- keep the default resume template as the final design
- over-engineer RBAC too early
- build 3D before core pages work
- add many dependencies for small UI effects
- use localStorage for auth tokens
- expose admin data publicly
- ignore Cloudflare runtime constraints
- commit secrets
- hardcode environment-specific values
- break dark mode
- ignore mobile layout
- use unsafe markdown rendering
- create exact copies of copyrighted/public-figure characters
- make the site feel like a generic SaaS template
- make the dashboard overly animated or distracting

## Definition of Done

A task is done when:

- The requested feature works.
- TypeScript errors are resolved.
- Formatting/linting is clean where possible.
- Build passes where possible.
- UI works in light and dark mode if affected.
- Mobile layout is considered.
- Accessibility basics are respected.
- No secrets are exposed.
- No unrelated large changes are included.
- The user-facing behavior is clearly explained.

For major tasks, report:

- what changed
- files touched
- commands run
- commands not run and why
- known limitations
- recommended next step

## Agent Behavior

When working in this repository:

- Be proactive but do not overreach.
- Prefer practical implementation over abstract planning.
- Preserve the user’s intended aesthetic direction.
- Make reasonable decisions when details are missing.
- Ask only when ambiguity would cause major rework.
- Explain tradeoffs briefly.
- Keep the project Cloudflare-compatible.
- Keep the project maintainable for long-term solo development.
- Prioritize public portfolio quality first, then CMS, then auth/RBAC, then 3D polish.

The user likes direct, friendly, practical guidance. Keep explanations clear and not overly formal.
