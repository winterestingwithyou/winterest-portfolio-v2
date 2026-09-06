# Feature Specification: Projects & Case Studies

| Field                | Value                                                                                                                                                                                                    |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-projects`                                                                                                                                                                                          |
| **Status**           | `Implemented`                                                                                                                                                                                            |
| **Domain Module**    | [`src/features/projects/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/projects)                                                                                                    |
| **Public Routes**    | [`/projects`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/projects/index.tsx), [`/projects/$slug`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/projects/$slug.tsx) |
| **Dashboard Routes** | `/dashboard/projects`, `/dashboard/projects/new`, `/dashboard/projects/$id`                                                                                                                              |
| **RBAC Permissions** | Public (Read Published), Editor/Admin/Owner (Full Management)                                                                                                                                            |
| **Last Updated**     | 2026-09-06                                                                                                                                                                                               |

---

## 1. Overview & Capabilities

The Projects feature manages the portfolio's showcase projects and technical case studies. It provides a public filterable showcase with dynamic slug details, paired with a full bilingual CMS dashboard editor.

### Capabilities

- **Bilingual Project Content**: Complete English and Indonesian versions for project title, summary, category, and markdown description stored in dedicated translations table.
- **Relational Tech Association**: Projects link directly to entities in the `technologies` catalog via many-to-many join table.
- **Status & Visibility Lifecycle**: Supports `draft`, `in_progress`, `published`, and `archived` states, as well as `public` and `private` visibility flags.
- **Featured Pinning**: Ability to pin high-impact projects to the homepage hero section.
- **Live Showcase & Filter**: Filter projects on `/projects` by stack tags, categories, and completion status.
- **Deep Slug Case Study**: `/projects/$slug` renders project overview, architecture diagram, challenges, live demo, and source code links.

---

## 2. Database & Storage Contract

### D1 Tables ([`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts))

1. **`projects`**:
   - Primary key: `id` (text UUID).
   - Unique index: `slug` (`uniqueIndex('projects_slug_unique')`).
   - Fields: `slug`, `title`, `summary`, `description`, `status`, `visibility`, `repoVisibility`, `featured`, `category`, `coverImage`, `repoUrl`, `demoUrl`, `productionUrl`, `startedAt`, `completedAt`, `publishedAt`.
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

| Endpoint            | Method   | Auth               | Description                                      |
| :------------------ | :------- | :----------------- | :----------------------------------------------- |
| `/api/projects`     | `GET`    | Public / Dashboard | Query `{ status?, category?, locale? }`          |
| `/api/projects/:id` | `GET`    | Public / Dashboard | Retrieve project by ID or slug with translations |
| `/api/projects`     | `POST`   | `editor`+          | Create project, translations, and tech relations |
| `/api/projects/:id` | `PUT`    | `editor`+          | Update project, translations, and tech relations |
| `/api/projects/:id` | `DELETE` | `editor`+          | Cascade delete project and associated records    |

### Validation Schema ([`src/features/projects/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/projects/validation.ts))

- `projectInputSchema`:
  - `slug`: URL-safe regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, 2-96 chars.
  - `status`: `draft` | `in_progress` | `published` | `archived`.
  - `translations`: `{ en: translationSchema, id: translationSchema }`.
  - `technologyIds`: Array of technology UUIDs.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
Public:
src/routes/projects/index.tsx -> ProjectsListPage (Filter bar, ProjectCard grid)
src/routes/projects/$slug.tsx -> ProjectDetailPage (Markdown body, tech badges, links sidebar)

Dashboard:
src/routes/dashboard/projects/index.tsx -> DashboardProjectsPage (TanStack Table, status filters)
src/routes/dashboard/projects/new.tsx   -> DashboardProjectNewPage -> ProjectEditorForm
src/routes/dashboard/projects/$id.tsx   -> DashboardProjectEditPage -> ProjectEditorForm
```

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

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] Public projects page renders filterable list of published projects only.
- [ ] Project slug detail renders case study with active locale translation.
- [ ] ProjectEditorForm validates bilingual fields and slug format before submission.
- [ ] Saving project updates `projects`, `project_translations`, and `project_technologies` atomically.
- [ ] Deleting project removes row and refreshes dashboard table.
- [ ] Validation schema passes Vitest suite ([`src/features/projects/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/projects/__tests__/validation.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
