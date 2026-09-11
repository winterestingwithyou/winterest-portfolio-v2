# RFC: Public Pages (Projects, Stack, Contact) CMS Content Management

- **Feature ID**: `feat-public-pages-cms`
- **Date**: `2026-09-11`
- **Status**: `Draft`
- **Target Routes**:
  - Public:
    - `/projects` (Filterable Projects Showcase)
    - `/stack` (Technologies & Tools Catalog)
    - `/contact` (Direct Channels & Message Form)
  - Dashboard:
    - `/dashboard/pages/projects` (Projects Page CMS)
    - `/dashboard/pages/stack` (Tech Stack Page CMS)
    - `/dashboard/pages/contact` (Contact Page CMS)
  - API:
    - `/api/pages/:page` (GET & PUT)
- **Target Modules**:
  - `src/features/projects/`
  - `src/features/technologies/`
  - `src/features/contact/`
  - `src/components/dashboard/dashboard-sidebar.tsx`
  - `src/db/schema.ts`
  - `src/routes/dashboard/pages/`
  - `src/routes/api/pages/`

---

## 1. Overview & Problem Statement

Currently, while dynamic entities (projects catalog, tech entries, social links) are managed via the CMS dashboard, the textual headers, section introductions, and presentation copy on the public pages remain hardcoded in static `copy.ts` files:

- **Projects Page (`/projects`)**: Header title, eyebrow, and description are hardcoded in `src/features/projects/copy.ts`.
- **Tech Stack Page (`/stack`)**: Page header and Ultimate Tech Stack section header (eyebrow, title, description) are hardcoded in `src/features/technologies/copy.ts`.
- **Contact Page (`/contact`)**: Page header, Direct Channels card labels (status, location, subtitle), and Contact Form card titles are hardcoded in `src/features/contact/copy.ts`.

Additionally, the site owner cannot toggle the visibility of verbose section descriptions on these pages, limiting control over visual density on mobile and desktop viewports.

### Proposed Capabilities

1. **Unified Sidebar Group "Halaman Publik (Pages)" in CMS**:
   - Introduce a dedicated sidebar navigation group in `src/components/dashboard/dashboard-sidebar.tsx` with clear sub-items:
     - **Home** (`/dashboard/pages/home`)
     - **Projects** (`/dashboard/pages/projects`)
     - **Tech Stack** (`/dashboard/pages/stack`)
     - **Contact** (`/dashboard/pages/contact`)
2. **First-Class Bilingual Editing (`en` / `id`)**:
   - Header and intro editors feature an inline language switcher pill (`EN` / `ID`) for fast, distraction-free translation without duplicating form heights.
3. **Granular Description Visibility Toggles**:
   - `showDescription` switches on every page header and section card, allowing the owner to conceal descriptions for a compact, minimalist aesthetic.
4. **"Reset to Default" Action**:
   - A single-click action on each page editor to immediately reset the form fields back to the baseline copywriting defined in `copy.ts`.
5. **Rule 9 CMS Fallback Contract**:
   - If database records are uninitialized or empty, public pages seamlessly fall back to their respective static `copy.ts` tokens without broken layouts or runtime crashes.

---

## 2. Database & Storage Contract (D1 & R2)

### D1 Table `page_content` (`src/db/schema.ts`)

A single, edge-friendly, high-performance table in SQLite D1 storing typed JSON configuration documents for each public page.

```ts
export const pageContent = sqliteTable('page_content', {
  page: text('page').primaryKey(), // 'projects' | 'stack' | 'contact'
  dataJson: text('data_json').notNull().default('{}'),
  ...timestamps,
})
```

### Mandatory `reset.sql` Maintenance (`drizzle/scripts/reset.sql`)

```sql
DROP TABLE IF EXISTS page_content;
```

---

## 3. Server & API Contracts (Zod & ofetch)

### Endpoints Matrix

| Endpoint           | Method | Role    | Turnstile | Purpose                                              |
| :----------------- | :----- | :------ | :-------- | :--------------------------------------------------- |
| `/api/pages/:page` | `GET`  | Public  | No        | Fetch page configuration (falls back to copy tokens) |
| `/api/pages/:page` | `PUT`  | Editor+ | No        | Update page configuration & description toggles      |

### Zod Validation Schemas (`src/features/portfolio/page-content-schemas.ts`)

```ts
// 1. Projects Page Schema
export const projectsPageConfigSchema = z.object({
  eyebrowEn: z.string(),
  eyebrowId: z.string(),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string(),
  descriptionId: z.string(),
  showDescription: z.boolean().default(true),
})
export type ProjectsPageConfig = z.infer<typeof projectsPageConfigSchema>

// 2. Stack Page Schema
export const stackPageConfigSchema = z.object({
  eyebrowEn: z.string(),
  eyebrowId: z.string(),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string(),
  descriptionId: z.string(),
  showDescription: z.boolean().default(true),

  ultimateEyebrowEn: z.string(),
  ultimateEyebrowId: z.string(),
  ultimateTitleEn: z.string().min(1, 'Ultimate Title EN is required'),
  ultimateTitleId: z.string().min(1, 'Ultimate Title ID is required'),
  ultimateDescriptionEn: z.string(),
  ultimateDescriptionId: z.string(),
  showUltimateDescription: z.boolean().default(true),
})
export type StackPageConfig = z.infer<typeof stackPageConfigSchema>

// 3. Contact Page Schema
export const contactPageConfigSchema = z.object({
  eyebrowEn: z.string(),
  eyebrowId: z.string(),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string(),
  descriptionId: z.string(),
  showDescription: z.boolean().default(true),

  directTitleEn: z.string(),
  directTitleId: z.string(),
  directSubtitleEn: z.string(),
  directSubtitleId: z.string(),
  directStatusEn: z.string(),
  directStatusId: z.string(),
  directLocationEn: z.string(),
  directLocationId: z.string(),

  formTitleEn: z.string(),
  formTitleId: z.string(),
  formSubtitleEn: z.string(),
  formSubtitleId: z.string(),
})
export type ContactPageConfig = z.infer<typeof contactPageConfigSchema>
```

---

## 4. UI & State Architecture

### Component Hierarchy & Routes Layout

```txt
src/
  routes/
    dashboard/
      pages/
        projects.tsx                       # Dashboard CMS for /projects header
        stack.tsx                          # Dashboard CMS for /stack & ultimate headers
        contact.tsx                        # Dashboard CMS for /contact headers & cards
    api/
      pages/
        $page.ts                           # GET & PUT page content endpoint
  features/
    portfolio/
      page-content-schemas.ts              # Zod validation & type contracts
      page-content-query-options.ts        # TanStack Query options for public pages
      page-content-hooks.ts                # useUpdatePageContent mutation hook
    projects/
      components/form/
        projects-page-content-form.tsx     # CMS Form for Projects header
    technologies/
      components/form/
        stack-page-content-form.tsx        # CMS Form for Stack & Ultimate headers
    contact/
      components/form/
        contact-page-content-form.tsx      # CMS Form for Contact header & cards
  components/
    dashboard/
      dashboard-sidebar.tsx                # 'Halaman Publik' navigation group
```

### Sidebar Navigation Layout (`dashboard-sidebar.tsx`)

Add a new group using existing shadcn sidebar primitives (`SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`):

```tsx
<SidebarGroup>
  <SidebarGroupLabel className="text-[0.65rem] font-bold uppercase tracking-wider text-sidebar-foreground/60">
    {copy.shell.pagesGroup}
  </SidebarGroupLabel>
  <SidebarGroupContent>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === '/dashboard/pages/home'}
        >
          <Link to="/dashboard/pages/home">
            <Home className="size-4" />
            <span>{copy.shell.navPages.home}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === '/dashboard/pages/projects'}
        >
          <Link to="/dashboard/pages/projects">
            <FolderKanban className="size-4" />
            <span>{copy.shell.navPages.projects}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === '/dashboard/pages/stack'}
        >
          <Link to="/dashboard/pages/stack">
            <Layers className="size-4" />
            <span>{copy.shell.navPages.stack}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === '/dashboard/pages/contact'}
        >
          <Link to="/dashboard/pages/contact">
            <Mail className="size-4" />
            <span>{copy.shell.navPages.contact}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
```

### Public Page Hydration & Fallback Flow

#### 1. Projects Page (`src/routes/projects/index.tsx`)

- `loader`: `queryClient.ensureQueryData(pageContentQueryOptions.get('projects'))`.
- `ProjectsListPage`: Reads `pageConfig?.showDescription ?? true`. When `false`, omits `description` from `<SectionHeader>`.

#### 2. Tech Stack Page (`src/routes/stack.tsx`)

- `loader`: `queryClient.ensureQueryData(pageContentQueryOptions.get('stack'))`.
- `StackPage`: Dynamically injects resolved title, eyebrow, and description.
- `UltimateStackSection`: Conditionally renders `<p className="description">` based on `pageConfig?.showUltimateDescription ?? true`.

#### 3. Contact Page (`src/routes/contact.tsx`)

- `loader`: `queryClient.ensureQueryData(pageContentQueryOptions.get('contact'))`.
- `ContactChannels`: Renders dynamic status, location, and subtitle from CMS with fallbacks.
- `ContactForm`: Renders dynamic title and subtitle from CMS with fallbacks.

---

## 5. Security & RBAC Rules

- Public visitors can query `/api/pages/:page` via `GET` (read-only).
- Mutating page content via `PUT /api/pages/:page` is restricted to authenticated users with roles `owner`, `admin`, or `editor` verified by Better Auth session cookies.

---

## 6. Edge Cases & Invariants

1. **Unmigrated / Empty Row**: If `page_content` has no row for `'projects'`, `'stack'`, or `'contact'`, the API and client loaders seamlessly fall back to static tokens in `copy.ts` without throw, flash of unstyled content, or layout failure.
2. **Hidden Description Toggle**: When `showDescription` is set to `false`, the `<SectionHeader>` component does not render empty DOM nodes or extra padding.
3. **Reset to Default**: Clicking "Reset ke Default" populates the active form with values from `getProjectsCopy()`, `getTechnologiesCopy()`, or `getContactCopy()` matching the active locale, and marks the form dirty for confirmation.
4. **Invalid JSON / Schema Mismatch**: If `dataJson` in D1 contains corrupted or outdated schema keys, the Zod parser uses `.catch()` or falls back gracefully to baseline defaults.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] D1 table `page_content` declared in `src/db/schema.ts` and `drizzle/scripts/reset.sql`.
- [ ] Drizzle migration generated (`bun run db:generate`).
- [ ] API route `/api/pages/$page.ts` supports `GET` (public) and `PUT` (editor+) with Zod validation.
- [ ] Dashboard sidebar includes the "Halaman Publik (Pages)" group with Home, Projects, Stack, and Contact navigation items.
- [ ] Dashboard pages created:
  - [ ] `/dashboard/pages/projects`: Eyebrow, Title, Description, and `showDescription` toggle.
  - [ ] `/dashboard/pages/stack`: Main header and Ultimate stack section header with description toggles.
  - [ ] `/dashboard/pages/contact`: Main header, direct channels card labels, and contact form title/subtitle.
- [ ] Each form includes an inline language switcher (`EN` / `ID`) and a working "Reset ke Default" button.
- [ ] Public routes (`/projects`, `/stack`, `/contact`) immediately reflect CMS updates across both languages.
- [ ] Fallback resilience confirmed: App works seamlessly when database table is empty.
- [ ] TypeScript checks pass cleanly (`bun run check`).
- [ ] Linter passes cleanly (`bun run lint`).
- [ ] Production build succeeds (`bun run build`).
