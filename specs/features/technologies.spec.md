# Feature Specification: Tech Stack & Categories

| Field                | Value                                                                                                         |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Feature ID**       | `feat-technologies`                                                                                           |
| **Status**           | `Implemented`                                                                                                 |
| **Domain Module**    | [`src/features/technologies/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/technologies) |
| **Public Routes**    | [`/stack`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/stack.tsx)                          |
| **Dashboard Routes** | `/dashboard/stack`, `/dashboard/stack/categories/*`, `/dashboard/stack/technologies/*`                        |
| **RBAC Permissions** | Public (Read), Editor/Admin/Owner (Full Management)                                                           |
| **Last Updated**     | 2026-09-06                                                                                                    |

---

## 1. Overview & Capabilities

The Technologies feature manages Winterest's developer toolkit, categorized stacks, and marquee highlights. It powers the interactive public `/stack` catalog, homepage animated marquees, and dynamic technology pickers across project editors.

### Capabilities

- **Two-Tier Organization**: Technologies are associated with one or more categories (e.g., Languages, Frameworks, Cloud, Databases) via a many-to-many junction table.
- **Ultimate Tech Flagging**: Technologies can be marked with `isUltimate: true` to feature prominently on the homepage marquee and flagship tool highlights.
- **Categorized Public Catalog**: `/stack` displays all technologies grouped by category with custom brand icons, hex colors, and official URLs.
- **Dual Dashboard Management**: `/dashboard/stack` provides separate tabbed TanStack Tables for Technologies and Categories, with inline creation dialogs and full CRUD forms.

---

## 2. Database & Storage Contract

### D1 Tables ([`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts))

1. **`technologies`**:
   - `id`: Text UUID primary key.
   - `name`: Text (e.g. "TypeScript", "Bun").
   - `slug`: Text unique index (`uniqueIndex('technologies_slug_unique')`).
   - `icon`: Text identifier (SimpleIcons slug or Lucide icon name).
   - `color`: Hex color string (e.g. `#F48120`).
   - `url`: Official documentation URL.
   - `isUltimate`: Boolean flag indexed for marquee queries.
2. **`categories`**:
   - `id`: Text UUID primary key.
   - `name`: Category title.
   - `slug`: Text unique index.
   - `sortOrder`: Integer sort index.
3. **`technology_categories`**:
   - Composite Primary Key: `[technologyId, categoryId]`.
   - Foreign keys with `onDelete: 'cascade'`.

---

## 3. Server & API Contracts

### Endpoints

| Endpoint            | Method   | Auth               | Description                                              |
| :------------------ | :------- | :----------------- | :------------------------------------------------------- |
| `/api/stack`        | `GET`    | Public             | Aggregated technologies grouped by category for `/stack` |
| `/api/technologies` | `GET`    | Public / Dashboard | List all technologies with category arrays               |
| `/api/technologies` | `POST`   | `editor`+          | Create technology and assign categories                  |
| `/api/technologies` | `PUT`    | `editor`+          | Update technology metadata and categories                |
| `/api/technologies` | `DELETE` | `editor`+          | Delete technology and cascade relationships              |
| `/api/categories`   | `GET`    | Public / Dashboard | List all categories ordered by `sortOrder`               |
| `/api/categories`   | `POST`   | `editor`+          | Create category                                          |
| `/api/categories`   | `PUT`    | `editor`+          | Update category title, slug, or sort order               |
| `/api/categories`   | `DELETE` | `editor`+          | Delete category and unbind technologies                  |

### Validation ([`src/features/technologies/validation.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/technologies/validation.ts))

- `categoryInputSchema`: Validates name, URL-safe slug, and `sortOrder`.
- `technologyInputSchema`: Validates name, URL-safe slug, optional URL, `isUltimate` boolean, and `categoryIds` array.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
Public:
src/routes/stack.tsx -> StackPage
├── UltimateStackSection (Cards for isUltimate tools)
└── StackCategoriesSection (Grouped tech grids with TechIcon)

Dashboard:
src/routes/dashboard/stack/index.tsx -> DashboardStackPage
├── TabsList ("Technologies" / "Categories")
├── DashboardTechTable (Table, Search filter, isUltimate badges)
└── DashboardCategoriesTable (Table, Sort order, slug badges)
```

### TanStack Query Keys & Options

- `techQueryKeys.all`, `techQueryKeys.list()`, `techQueryKeys.detail(id)`
- `categoryQueryKeys.all`, `categoryQueryKeys.list()`, `categoryQueryKeys.detail(id)`
- `stackQueryKeys.public()`
- Mutations: `useCreateTechnology()`, `useUpdateTechnology()`, `useDeleteTechnology()`, `useCreateCategory()`, `useUpdateCategory()`, `useDeleteCategory()`

---

## 5. Security & Invariants

1. **Category Integrity**: Deleting a category does not delete associated technologies; it only removes rows in `technology_categories`.
2. **Slug Invariance**: Slugs for both categories and technologies must be unique and URL-safe.
3. **Authorized Editing**: Public users have read-only access; creating or mutating records requires an active session with role `editor`, `admin`, or `owner`.

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] `/stack` renders categorized list of active tools with brand icons and colors.
- [ ] Homepage tech marquee filters and renders tools with `isUltimate = true`.
- [ ] Category form enforces URL-safe slug and unique validation.
- [ ] Technology form allows multi-selecting categories and toggling `isUltimate`.
- [ ] Deleting a technology cascades cleanly without orphaned join rows.
- [ ] Validation schemas pass Vitest suite ([`src/features/technologies/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/technologies/__tests__/validation.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
