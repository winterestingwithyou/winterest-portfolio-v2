# Feature Specification: Projects & Case Studies

| Field                | Value                                                                                                                                                                                                    |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-projects`                                                                                                                                                                                          |
| **Status**           | `Implemented`                                                                                                                                                                                            |
| **Domain Module**    | [`src/features/projects/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/projects)                                                                                                    |
| **Public Routes**    | [`/projects`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/projects/index.tsx), [`/projects/$slug`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/projects/$slug.tsx) |
| **Dashboard Routes** | `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/projects/$id`                                                                                                                              |
| **RBAC Permissions** | Public (Read Published), Editor/Admin/Owner (Full Management)                                                                                                                                            |
| **Last Updated**     | 2026-09-11                                                                                                                                                                                               |

---

## 1. Overview & Capabilities

The Projects feature manages the portfolio's showcase projects and technical case studies. It provides a public filterable showcase with dynamic slug details, paired with a full bilingual CMS dashboard editor.

### Capabilities

- **Bilingual Project Content**: Complete English and Indonesian versions for project title, summary, category, and markdown description stored in dedicated translations table.
- **Relational Tech Association**: Projects link directly to entities in the `technologies` catalog via many-to-many join table.
- **Status & Visibility Lifecycle**: Supports `draft`, `in_progress`, `published`, and `archived` states, as well as `public` and `private` visibility flags.
- **Featured Pinning & Quota (Max 4)**: Ability to pin high-impact projects to the homepage hero section, strictly bounded to a maximum of 4 projects across the entire system.
- **Live Showcase & Filter**: Filter projects on `/projects` by stack tags, categories (pill tabs), and debounced search, paginated at 9 projects per page with URL sync (`?q=...&category=...&page=...`).
- **Dashboard Table Management**: TanStack Table on `/dashboard/projects` with client-side debounced search, status filter dropdown (supporting `all`, `published`, `in_progress`, `draft`, and `featured`), row count indicators, dynamic quota badge in the featured header `(X/4)`, and 10-row pagination synced to URL. The primary "Project" column enforces defensive overflow constraints: summary is clamped to 2 lines (`line-clamp-2 break-words whitespace-normal`), title and slug are single-line truncated (`truncate`), and all three expose the full string via native `title` tooltip. Cell container bounds are `min-w-64 max-w-sm sm:max-w-md overflow-hidden` to prevent horizontal bleed into adjacent columns.
- **Deep Slug Case Study**: `/projects/$slug` renders project overview, architecture diagram, challenges, live demo, and source code links.

---

## 2. Database & Storage Contract

### D1 Tables ([`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts))

1. **`projects`**:
   - Primary key: `id` (text UUID).
   - Unique index: `slug` (`uniqueIndex('projects_slug_unique')`).
   - Fields: `slug`, `title`, `summary`, `description`, `status`, `visibility`, `repoVisibility`, `featured` (integer boolean, quota: max 4), `category`, `coverImage`, `repoUrl`, `demoUrl`, `productionUrl`, `startedAt`, `completedAt`, `publishedAt`.
2. **`project_translations`**:
   - Composite Primary Key: `[projectId, locale]`.
   - References `projects.id` with `onDelete: 'cascade'`.
   - Fields: `title`, `summary`, `description`, `category`.
3. **`project_technologies`**:
   - Composite Primary Key: `[projectId, technologyId]`.
   - References `projects.id` and `technologies.id` with `onDelete: 'cascade'`.

---

## 3. Server & API Contracts

### Endpoints

| Endpoint            | Method          | Auth               | Description                                                                              |
| :------------------ | :-------------- | :----------------- | :--------------------------------------------------------------------------------------- |
| `/api/projects`     | `GET`           | Public / Dashboard | Query `{ status?, category?, locale? }`                                                  |
| `/api/projects/:id` | `GET`           | Public / Dashboard | Retrieve project by ID or slug with translations                                         |
| `/api/projects`     | `POST`          | `editor`+          | Create project, translations, and tech relations. Quota: rejects 5th featured with 400.  |
| `/api/projects/:id` | `PUT` / `PATCH` | `editor`+          | Update project, translations, and tech relations. Quota: rejects 5th featured with 400.  |
| `/api/projects/:id` | `DELETE`        | `editor`+          | Cascade delete project and associated records                                            |

### Quota Constraint & Error Contract

- If `featured: true` is requested on creation or update when 4 featured projects already exist, the server rejects the mutation with `HTTP 400 Bad Request`:
  ```json
  {
    "error": "Maximum of 4 featured projects allowed. Please unfeature another project first."
  }
  ```
- Unfeaturing (`featured: false`) or editing other fields on an already-featured project is always permitted.

### Validation Schema ([`src/features/projects/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/projects/validation.ts))

- `projectInputSchema`:
  - `slug`: kebab-case format.
  - `status`: enum (`published`, `draft`, `in_progress`, `archived`).
  - `visibility`: enum (`public`, `private`).
  - `translations`: `{ en: translationSchema, id: translationSchema }`.
  - `technologyIds`: Array of technology UUIDs.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
Public:
src/routes/projects/index.tsx -> ProjectsListPage (Category pills, debounced SearchInput, 9-item ProjectCard grid, DataPagination)
src/routes/projects/$slug.tsx -> ProjectDetailPage (Markdown body, tech badges, links sidebar)

Dashboard:
src/routes/dashboard/projects/index.tsx -> DashboardProjectsPage (DashboardProjectsTable, status filter including 'featured', DataPagination)
src/routes/dashboard/projects/new.tsx   -> DashboardProjectNewPage -> ProjectEditorForm
src/routes/dashboard/projects/$id.tsx   -> DashboardProjectEditPage -> ProjectEditorForm
```

### Quota UI Behaviors

- **ProjectEditorForm**: Proactively checks `projectsList.filter(p => p.featured && p.id !== currentId).length`. If `>= 4`, disables the featured toggle checkbox (`disabled={true}`) and displays an informative warning badge explaining how to unfeature another project to free up a slot.
- **DashboardProjectsTable**: Enriches the status filter with dynamic counts (e.g. `Featured (3/4)` or `Featured (4/4 Full)` / `Unggulan (4/4 Penuh)`). The table header displays a subtle quota badge `(X/4)` on the Featured column.

### TanStack Query & Hooks

- `projectQueryKeys.all`, `projectQueryKeys.list()`, `projectQueryKeys.detail(id)`
- Loader prefetch: `queryClient.ensureQueryData(projectQueryOptions.detail(id))`
- Component consumption: `useSuspenseQuery(projectQueryOptions.detail(id))`
- Mutation hooks: `useCreateProject()`, `useUpdateProject()`, `useDeleteProject()`

---

## 5. Security & Invariants

1. **Draft Leak Prevention**: Public queries (`listPublishedPublicProjects()`, `getPublishedPublicProjectBySlug()`) filter strictly on `status = 'published'` and `visibility = 'public'`.
2. **Slug Invariance**: Slugs cannot be duplicated across projects. Duplicate submission returns 409 Conflict.
3. **Cascade Integrity**: Deletion of a project automatically drops relations and translation records cleanly in D1.
4. **Featured Projects Quota Invariant**: Maximum 4 featured projects allowed across the system. Checked atomically in server isolate queries (`countFeaturedProjects`) before write operations.

---

## 6. Acceptance Criteria & DoD Checklist

- [x] Public projects page renders filterable list of published projects with search, category pills, and 9-item pagination.
- [x] Project slug detail renders case study with active locale translation.
- [x] ProjectEditorForm validates bilingual fields and slug format before submission.
- [x] Saving project updates `projects`, `project_translations`, and `project_technologies` atomically.
- [x] Deleting project removes row and refreshes dashboard table.
- [x] Dashboard projects table supports debounced search, status filter, and 10-row DataPagination.
- [x] Viewport scroll position is preserved without jumping to top when filtering or searching (`resetScroll: false`).
- [x] Primary "Project" column renders summary with `line-clamp-2 break-words whitespace-normal`; title and slug with `truncate`; all with native `title` tooltip; cell container bounded with `overflow-hidden` to prevent horizontal bleed.
- [x] Strict 4 featured projects quota enforced on backend (`POST /api/projects` and `PUT/PATCH /api/projects/:id`) returning HTTP 400 when full.
- [x] ProjectEditorForm proactively disables `featured` toggle and renders informative quota badge/warning when 4/4 is reached.
- [x] Dashboard projects table supports `status=featured` filter and dynamic quota header badge `(X/4)`.
- [x] Validation schema passes Vitest suite ([`src/features/projects/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/projects/__tests__/validation.test.ts)).
- [x] Table column cell unit tests pass ([`src/features/projects/__tests__/dashboard-projects-table-columns.test.tsx`](file:///d:/winterest-project/2nd-wpv2/src/features/projects/__tests__/dashboard-projects-table-columns.test.tsx)).
- [x] Featured quota unit test suite passes ([`src/features/projects/__tests__/quota.test.ts`](file:///d:/winterest-project/2nd-wpv2/src/features/projects/__tests__/quota.test.ts)).
- [x] TypeScript check passes: `bun run typecheck`.

