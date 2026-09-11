# RFC: Fix Dashboard Tables, Pagination, and Dialog Bilingual Localization

- **Feature ID**: `fix-dashboard-bilingual-tables-pagination`
- **Date**: `2026-09-11`
- **Status**: `Draft`
- **Target Routes**:
  - `/dashboard/projects`
  - `/dashboard/stack`
  - `/dashboard/social`
- **Target Modules**:
  - `src/components/ui/pagination.tsx`
  - `src/components/ui/data-pagination.tsx`
  - `src/features/projects/components/table/`
  - `src/features/technologies/components/table/`
  - `src/features/social/`
  - `src/features/dashboard/copy.ts`

---

## 1. Overview & Problem Statement

Several UI components across the CMS dashboard contain hardcoded English or Indonesian strings, causing inconsistent or broken localization when toggling between English (`en`) and Indonesian (`id`).

### The Issues

1. **Pagination Button Text Ignored (`pagination.tsx`)**:
   - `DataPagination` (`src/components/ui/data-pagination.tsx`) defines bilingual translations for Previous (`Sebelumnya` / `Previous`) and Next (`Berikutnya` / `Next`) and passes them as `children` to `<PaginationPrevious>` and `<PaginationNext>`.
   - However, `<PaginationPrevious>` and `<PaginationNext>` in `src/components/ui/pagination.tsx` discard `{children}` entirely and hardcode English `<span className="hidden sm:block">Previous</span>` and `Next`, preventing the bilingual copy from ever rendering.
2. **Projects Table Status Filter (`dashboard-projects-table.tsx`)**:
   - The status dropdown filter hardcodes English text: `placeholder="All Status"`, `<SelectItem value="all">All Status</SelectItem>`, and raw strings for `Published`, `In Progress`, and `Draft`, ignoring the localized status tokens already defined in `copy.projects.table`.
3. **Technologies Table Search & Category Filter (`dashboard-tech-table.tsx`)**:
   - Search input hardcodes `placeholder="Search technologies..."`.
   - Category dropdown filter hardcodes `placeholder="All Categories"` and `<SelectItem value="all">All Categories</SelectItem>`.
4. **Categories Table Search (`dashboard-categories-table.tsx`)**:
   - Search input hardcodes `placeholder="Search categories..."`.
5. **Social Link Editor Dialog (`social-editor-dialog.tsx`)**:
   - Platform select dropdown hardcodes Indonesian `placeholder="Pilih platform"` even when viewing the dashboard in English.
6. **Social Link Platform "Already Added" Badge (`social-editor-dialog.tsx`)**:
   - The disabled platform item indicator in the platform select dropdown hardcodes Indonesian `(Sudah ditambahkan)` (line 180) instead of using localized copy tokens.

---

## 2. Database & Storage Contract (D1 & R2)

Pure client-side UI and localization fix.

- **D1 Tables**: None.
- **R2 Storage**: None.

---

## 3. Server & API Contracts (Zod & ofetch)

No backend endpoints or validation schemas are affected.

| Endpoint | Method | Role | Turnstile | Purpose |
| :------- | :----- | :--- | :-------- | :------ |
| N/A      | N/A    | N/A  | N/A       | Pure UI |

---

## 4. UI & State Architecture

### Affected Files & Components

```txt
src/
  components/
    ui/
      pagination.tsx                       # Allow children in PaginationPrevious and PaginationNext
      data-pagination.tsx                  # Pass localized previous/next labels
  features/
    projects/
      components/
        table/
          dashboard-projects-table.tsx     # Localize status filter options & placeholder
    technologies/
      components/
        table/
          dashboard-tech-table.tsx         # Localize search placeholder & category filter
          dashboard-categories-table.tsx   # Localize search placeholder
    social/
      social-editor-dialog.tsx             # Localize platform select placeholder
    dashboard/
      copy.ts                              # Add missing copy tokens in en & id
```

### Copywriting Updates (`src/features/dashboard/copy.ts`)

#### English (`en`):

```ts
// projects.table
allStatus: 'All Status',

// stack.techTable
searchPlaceholder: 'Search technologies...',
allCategories: 'All Categories',

// stack.categoriesTable
searchPlaceholder: 'Search categories...',

// social.dialog
selectPlatform: 'Select platform',
alreadyAdded: 'Already added',
```

#### Indonesian (`id`):

```ts
// projects.table
allStatus: 'Semua Status',

// stack.techTable
searchPlaceholder: 'Cari teknologi...',
allCategories: 'Semua Kategori',

// stack.categoriesTable
searchPlaceholder: 'Cari kategori...',

// social.dialog
selectPlatform: 'Pilih platform',
alreadyAdded: 'Sudah ditambahkan',
```

### Component Implementations

#### 1. `src/components/ui/pagination.tsx`

Allow customizable `{children}` with graceful fallbacks:

```tsx
function PaginationPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      {...props}
    >
      {children ?? (
        <>
          <ChevronLeftIcon />
          <span className="hidden sm:block">Previous</span>
        </>
      )}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      {...props}
    >
      {children ?? (
        <>
          <span className="hidden sm:block">Next</span>
          <ChevronRightIcon />
        </>
      )}
    </PaginationLink>
  )
}
```

#### 2. `dashboard-projects-table.tsx`

```tsx
<Select value={activeStatus} onValueChange={handleStatus}>
  <SelectTrigger className="w-40 border-(--brand-line) bg-(--surface-card)">
    <SelectValue placeholder={copy.projects.table.allStatus} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">{copy.projects.table.allStatus}</SelectItem>
    <SelectItem value="published">
      {copy.projects.table.statusPublished}
    </SelectItem>
    <SelectItem value="in_progress">
      {copy.projects.table.statusInProgress}
    </SelectItem>
    <SelectItem value="draft">{copy.projects.table.statusDraft}</SelectItem>
  </SelectContent>
</Select>
```

#### 3. `dashboard-tech-table.tsx`

```tsx
<SearchInput
  value={activeSearch}
  onChange={handleSearch}
  placeholder={copy.stack.techTable.searchPlaceholder}
  className="w-full"
/>

<Select value={activeCategory} onValueChange={handleCategory}>
  <SelectTrigger className="w-48 border-(--brand-line) bg-(--surface-card)">
    <SelectValue placeholder={copy.stack.techTable.allCategories} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">{copy.stack.techTable.allCategories}</SelectItem>
    {categories.map((cat) => (
      <SelectItem key={cat.id} value={cat.id}>
        {cat.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### 4. `dashboard-categories-table.tsx`

```tsx
<SearchInput
  value={activeSearch}
  onChange={handleSearch}
  placeholder={copy.stack.categoriesTable.searchPlaceholder}
  className="w-full"
/>
```

#### 5. `social-editor-dialog.tsx`

```tsx
<SelectTrigger id="platform-select">
  <SelectValue placeholder={copy.social.dialog.selectPlatform} />
</SelectTrigger>
...
{isTaken && (
  <span className="text-xs text-muted-foreground italic">
    ({copy.social.dialog.alreadyAdded})
  </span>
)}
```

---

## 5. Security & RBAC Rules

- Pure UI presentation. All routes remain guarded by Better Auth cookie sessions and RBAC rules.

---

## 6. Edge Cases & Invariants

1. **Standalone Pagination Usage**: If `PaginationPrevious` or `PaginationNext` is rendered without children in other components, it safely falls back to default English icons and labels (`Previous` / `Next`).
2. **Dynamic Category Names**: Category filter in `dashboard-tech-table.tsx` translates the "All Categories" option while preserving user-defined category entity names.
3. **Locale Switching**: When switching between `en` and `id` in the header language menu, all table toolbars, filters, search placeholders, and pagination buttons update immediately without requiring page refresh.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] `PaginationPrevious` and `PaginationNext` in `pagination.tsx` accept and render `children`.
- [ ] In Indonesian mode (`id`), pagination buttons display `Sebelumnya` and `Berikutnya`.
- [ ] In English mode (`en`), pagination buttons display `Previous` and `Next`.
- [ ] Projects table status filter renders localized labels (`Semua Status`, `Dipublikasikan`, `Sedang Dikerjakan`, `Draft` in ID).
- [ ] Technologies table renders localized search placeholder and `Semua Kategori` in ID.
- [ ] Categories table renders localized search placeholder in ID.
- [ ] Social Link editor dialog renders localized platform placeholder (`Select platform` in EN, `Pilih platform` in ID).
- [ ] Social Link editor dialog renders localized "Already added" badge in platform dropdown (`(Already added)` in EN, `(Sudah ditambahkan)` in ID).
- [ ] TypeScript checks pass cleanly (`bun run check`).
- [ ] Linter passes cleanly (`bun run lint`).
- [ ] Production build succeeds (`bun run build`).
