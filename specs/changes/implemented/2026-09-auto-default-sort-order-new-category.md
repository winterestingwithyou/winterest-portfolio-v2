# RFC: Auto-populate Default Sort Order on New Category Form

- **Feature ID**: `feat-category-auto-sort-order`
- **Date**: `2026-09-11`
- **Status**: `Implemented`
- **Target Routes**:
  - `/dashboard/stack/categories/new`
- **Target Modules**:
  - `src/features/technologies/components/form/`
  - `src/features/technologies/pages/`
  - `src/routes/dashboard/stack/categories/`

---

## 1. Overview & Problem Statement

When creating a new technology stack category via the dedicated dashboard page (`/dashboard/stack/categories/new`), the "Urutan Tampil" (`sortOrder`) form field currently defaults to `0` instead of dynamically detecting the next available sort order in sequence.

In contrast, the quick creation modal (`CategoryCreateDialog`) already initializes its sort order based on existing category count. However, the dedicated page `DashboardCategoryNewPage` and its underlying `CategoryEditorForm` have no data loader for categories and hardcode fallback to `0`:

```tsx
// Current CategoryEditorForm implementation
sortOrder: initialData?.sortOrder ?? 0
```

This causes poor UX and friction for content editors, who must manually inspect existing categories and count their position to avoid duplicate or zero sort order values.

### Proposed Solution

1. **Modular Helper `getNextCategorySortOrder`**:
   - Extract a pure, well-tested helper function `getNextCategorySortOrder(categories)` that computes `max(sortOrder) + 1` (defaulting to `1` when no categories exist).
2. **Route Loader Integration (Rule 4)**:
   - Update `src/routes/dashboard/stack/categories/new.tsx` to prefetch `categoryQueryOptions.list()` inside `loader` via `queryClient.ensureQueryData()`.
3. **Synchronous Hydration in `DashboardCategoryNewPage`**:
   - Consume categories via `useSuspenseQuery(categoryQueryOptions.list())` and calculate `nextSortOrder = getNextCategorySortOrder(categories)`.
   - Pass `defaultSortOrder={nextSortOrder}` to `CategoryEditorForm`.
4. **Form Default Prop**:
   - Update `CategoryEditorForm` to accept `defaultSortOrder?: number` and initialize `sortOrder: initialData?.sortOrder ?? defaultSortOrder ?? 1`.
5. **Harmonize `technology-editor-form.tsx`**:
   - Update `technology-editor-form.tsx` when mounting `CategoryCreateDialog` to use `getNextCategorySortOrder(categories)` for consistent behavior across dialog and standalone page.

---

## 2. Database & Storage Contract (D1 & R2)

No database schema changes or migrations are needed.

- **D1 Tables**: `categories` table already includes `sort_order integer not null default 0`.
- **R2 Storage**: None.

---

## 3. Server & API Contracts (Zod & ofetch)

Existing API endpoints and validation schemas are fully utilized without mutation.

| Endpoint          | Method | Role    | Turnstile | Purpose                                        |
| :---------------- | :----- | :------ | :-------- | :--------------------------------------------- |
| `/api/categories` | `GET`  | Editor+ | No        | List all existing categories with `sortOrder`. |

### Zod Validation

- Uses existing `categoryFormSchema` in `src/features/technologies/validation.ts`.

---

## 4. UI & State Architecture

### Component Hierarchy & Updates

```txt
src/
  routes/
    dashboard/
      stack/
        categories/
          new.tsx                          # Add route loader ensuring categoryQueryOptions.list()
  features/
    technologies/
      components/
        form/
          category-editor-form.tsx         # Accept defaultSortOrder prop
          technology-editor-form.tsx       # Harmonize CategoryCreateDialog defaultSortOrder
      pages/
        dashboard-category-new-page.tsx    # useSuspenseQuery + getNextCategorySortOrder
      utils.ts                             # getNextCategorySortOrder helper
      __tests__/
        sort-order.test.ts                 # Unit tests for sort order calculations
```

### Detailed Implementation Details

#### 1. Sort Order Helper (`src/features/technologies/utils.ts`)

```ts
export function getNextCategorySortOrder(
  categories?: readonly { sortOrder?: number | null }[] | null,
): number {
  if (!categories || categories.length === 0) {
    return 1
  }
  const maxOrder = Math.max(...categories.map((c) => c.sortOrder ?? 0))
  return maxOrder >= 0 ? maxOrder + 1 : 1
}
```

#### 2. Route Gateway (`src/routes/dashboard/stack/categories/new.tsx`)

```tsx
export const Route = createFileRoute('/dashboard/stack/categories/new')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(categoryQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.stack.newCategory} · Dashboard`,
      description: copy.stack.newCategoryDesc,
    })
  },
  component: DashboardCategoryNewPage,
})
```

#### 3. Page Component (`src/features/technologies/pages/dashboard-category-new-page.tsx`)

```tsx
export function DashboardCategoryNewPage() {
  const copy = getDashboardCopy()
  const { data: categories = [] } = useSuspenseQuery(
    categoryQueryOptions.list(),
  )
  const nextSortOrder = getNextCategorySortOrder(categories)

  return (
    <DashboardShell
      title={copy.stack.newCategory}
      description={copy.stack.newCategoryDesc}
    >
      <CategoryEditorForm mode="create" defaultSortOrder={nextSortOrder} />
    </DashboardShell>
  )
}
```

#### 4. Form Component (`src/features/technologies/components/form/category-editor-form.tsx`)

```tsx
type CategoryEditorFormProps = {
  mode: 'create' | 'edit'
  initialData?: CategoryRecord | null
  defaultSortOrder?: number
}

export function CategoryEditorForm({
  mode,
  initialData,
  defaultSortOrder = 1,
}: CategoryEditorFormProps) {
  // ...
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      sortOrder: initialData?.sortOrder ?? defaultSortOrder,
    },
    // ...
  })
}
```

---

## 5. Security & RBAC Rules

- Creating categories remains restricted to authenticated users with roles `owner`, `admin`, or `editor` through `src/routes/dashboard/route.tsx`.

---

## 6. Edge Cases & Invariants

1. **Empty Database (Zero Categories)**: If no categories exist yet, `getNextCategorySortOrder([])` evaluates to `1`.
2. **Gaps in Sort Order**: If existing categories have non-contiguous orders (e.g. `#1`, `#2`, `#5`), the helper computes `max + 1 = 6`, guaranteeing the new category is appended to the tail without collision.
3. **Negative / Zero Sort Orders**: If existing categories contain `0` or negative values, `Math.max` accurately finds the highest number and adds `1`.
4. **Manual User Override**: The user can freely change or clear the pre-filled sort order input before clicking Save; the default value is purely a helpful suggestion.

---

## 7. Acceptance Criteria & Verification Checklist

- [x] `getNextCategorySortOrder` helper implemented with 100% test coverage for:
  - Empty list -> returns `1`
  - Normal sequential list `[1, 2, 3]` -> returns `4`
  - Gapped list `[1, 5, 2]` -> returns `6`
  - Zero/negative orders `[-2, 0]` -> returns `1`
- [x] Route `/dashboard/stack/categories/new` prefetches category list in `loader`.
- [x] Navigating to `/dashboard/stack/categories/new` displays the input `Urutan Tampil` pre-filled with the next sequential sort order.
- [x] `CategoryCreateDialog` in `technology-editor-form.tsx` also utilizes `getNextCategorySortOrder` for unified behavior.
- [x] TypeScript checks pass cleanly (`bun run check`).
- [x] Vitest tests pass cleanly (`bun run test`).
- [x] Production build succeeds (`bun run build`).
