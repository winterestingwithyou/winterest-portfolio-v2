# RFC: Home Hero Latest Education CMS Refactor

- **Feature ID**: `feat-home-education`
- **Date**: `2026-09-13`
- **Status**: `Implemented`
- **Target Routes**:
  - Public: `/` (Homepage Hero Section)
  - Dashboard: `/dashboard/pages/home` (Tab 1: Hero & Education)
  - API: `/api/home/config` (GET, PUT)
- **Target Modules**:
  - `src/features/home/`
  - `src/db/schema.ts`
  - `src/routes/api/home/config.ts`

---

## 1. Overview & Problem Statement

In the initial implementation of the Home CMS ([`specs/changes/implemented/home-cms-content-management-09-2026.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/changes/implemented/home-cms-content-management-09-2026.md)), the 3 cards below the hero CTA (University, GPA, and Major) were modeled as an arbitrary array of metric cards (`stats: StatItem[]` serialized into a JSON string `statsJson` with an add/remove repeater capped at 4 items).

However, these 3 data points specifically represent **Latest Education** (`Pendidikan Terakhir`), not generic site statistics. Modeling them as a free-form array with JSON stringification creates unnecessary complexity, risks runtime JSON parse issues, lacks field-specific validation, and does not provide an intuitive CMS form UX for academic credentials.

### User Personas & Capabilities

- **Visitor / Recruiter**:
  - Views the engineer's latest academic background cleanly formatted on the hero section: University ("Universitas Sriwijaya"), GPA ("3.98"), and Major ("Information Management" / "Manajemen Informatika") in their active locale (`en` / `id`).
- **Owner / Editor**:
  - Edits the latest education directly in Dashboard Tab 1 ("Hero & Education") using dedicated, labeled input fields without managing an array repeater.
  - Can toggle visibility of the education block on the public hero.

---

## 2. Database & Storage Contract (D1 & R2)

### D1 Tables & Schema Changes (`src/db/schema.ts`)

Modify `homeConfig` in `src/db/schema.ts`:

- **Remove**: `showStats` (`integer`) and `statsJson` (`text`).
- **Add**: Explicit, strongly-typed columns for education:

```ts
// Latest Education Section
showEducation: integer('show_education', { mode: 'boolean' })
  .notNull()
  .default(true),
educationUniversity: text('education_university')
  .notNull()
  .default('Universitas Sriwijaya'),
educationMajorEn: text('education_major_en')
  .notNull()
  .default('Information Management'),
educationMajorId: text('education_major_id')
  .notNull()
  .default('Manajemen Informatika'),
educationGpa: text('education_gpa')
  .notNull()
  .default('3.98'),
```

### Mandatory `reset.sql` Maintenance (`drizzle/scripts/reset.sql`)

Preserve existing drop statements:

```sql
DROP TABLE IF EXISTS home_enthusiasms;
DROP TABLE IF EXISTS home_config;
```

---

## 3. Server & API Contracts (Zod & ofetch)

| Endpoint           | Method | Role                   | Turnstile | Purpose                                |
| :----------------- | :----- | :--------------------- | :-------- | :------------------------------------- |
| `/api/home/config` | `GET`  | Public                 | No        | Fetch public hero & home configuration |
| `/api/home/config` | `PUT`  | Editor / Admin / Owner | No        | Update home configuration & education  |

### Zod Validation Schemas (`src/features/home/validation.ts`)

```ts
export const homeConfigSchema = z.object({
  // Hero texts...
  heroEyebrowEn: z.string().trim(),
  heroEyebrowId: z.string().trim(),
  heroTitleEn: z.string().trim().min(1, 'Hero title (EN) is required'),
  heroTitleId: z.string().trim().min(1, 'Hero title (ID) is required'),
  heroIntroEn: z.string().trim(),
  heroIntroId: z.string().trim(),
  heroIntroSuffixEn: z.string().trim(),
  heroIntroSuffixId: z.string().trim(),

  // Latest Education
  showEducation: z.boolean().default(true),
  educationUniversity: z.string().trim().min(1, 'University name is required'),
  educationMajorEn: z.string().trim().min(1, 'Major (EN) is required'),
  educationMajorId: z.string().trim().min(1, 'Major (ID) is required'),
  educationGpa: z.string().trim().min(1, 'GPA is required'),

  // Section Headers & CTA...
})

export type HomeConfigInput = z.infer<typeof homeConfigSchema>
```

---

## 4. UI & State Architecture

### Component Hierarchy

- **Dashboard**:
  - `src/features/home/pages/dashboard-home-page.tsx`:
    - Tab 1 renamed from "Hero & Metrics" to "Hero & Education" (`copy.tabs.heroEducation`).
    - Mounts `HomeHeroEducationForm` (refactored from `home-hero-stats-form.tsx`).
  - `src/features/home/components/form/home-hero-education-form.tsx`:
    - Replaces dynamic repeater with a clean, structured "Latest Education" card containing:
      - Visibility switch: `Tampilkan Bagian Pendidikan` / `Show Education Section`.
      - Input: `Universitas / Institusi` / `University / Institution`.
      - Input: `Program Studi / Jurusan` / `Major / Field of Study` (localized for current active tab locale).
      - Input: `IPK` / `GPA`.
- **Public Homepage**:
  - `src/features/home/components/section/home-hero.tsx`:
    - Renders the 3 precision cards under the CTA using localized label tokens from `copy.ts`:
      1. Card 1: `copy.hero.education.university` -> `educationUniversity`
      2. Card 2: `copy.hero.education.gpa` -> `educationGpa`
      3. Card 3: `copy.hero.education.major` -> `locale === 'en' ? educationMajorEn : educationMajorId`
- **Copywriting (`src/features/home/copy.ts`)**:
  - Public copy tokens for education cards:
    - `en.hero.education`: `{ university: 'University', gpa: 'GPA', major: 'Major' }`
    - `id.hero.education`: `{ university: 'Universitas', gpa: 'IPK', major: 'Program Studi' }`
  - Dashboard copy tokens for education editor:
    - `en.dashboard.tabs.heroEducation`: `'Hero & Education'`
    - `id.dashboard.tabs.heroEducation`: `'Hero & Pendidikan'`
    - `en.dashboard.education`: `{ cardTitle: 'Latest Education', cardDesc: 'Academic background displayed below the hero CTA button.', universityLabel: 'University / Institution', universityPlaceholder: 'e.g. Universitas Sriwijaya', majorLabel: 'Major / Field of Study', majorPlaceholder: 'e.g. Information Management', gpaLabel: 'GPA', gpaPlaceholder: 'e.g. 3.98', showEducationLabel: 'Show Education Section' }`
    - `id.dashboard.education`: `{ cardTitle: 'Pendidikan Terakhir', cardDesc: 'Latar belakang akademik yang ditampilkan di bawah tombol CTA hero.', universityLabel: 'Universitas / Institusi', universityPlaceholder: 'mis. Universitas Sriwijaya', majorLabel: 'Program Studi / Jurusan', majorPlaceholder: 'mis. Manajemen Informatika', gpaLabel: 'IPK', gpaPlaceholder: 'mis. 3.98', showEducationLabel: 'Tampilkan Bagian Pendidikan' }`

---

## 5. Security & RBAC Rules

- **Public**: Can read education values via `GET /api/home/config` and `/` public loader.
- **Editor / Admin / Owner**: Can update education values via `PUT /api/home/config` in dashboard.
- **CSRF / Origin Check**: Standard Better Auth cookie session authentication.

---

## 6. Edge Cases & Invariants

- **Invariant 1 (Zero Runtime Parsing Failure)**: Eliminates JSON stringification (`statsJson`), ensuring typed column stability and eliminating parse exceptions.
- **Invariant 2 (Default Fallback Contract)**: If the database is unmigrated or empty, `getDefaultHomeConfig()` supplies `Universitas Sriwijaya`, `3.98`, `Information Management`, and `Manajemen Informatika`.
- **Invariant 3 (Toggle Off)**: When `showEducation = false`, the grid is omitted entirely from the hero without leaving layout voids or broken margins.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] Update D1 schema in `src/db/schema.ts` with explicit education columns.
- [ ] Update Zod schema and defaults in `src/features/home/validation.ts`.
- [ ] Update Drizzle query mapping in `src/features/home/queries.ts`.
- [ ] Refactor form component into `home-hero-education-form.tsx`.
- [ ] Update Tab 1 in `dashboard-home-page.tsx`.
- [ ] Update card rendering in `home-hero.tsx` and `home-page.tsx`.
- [ ] Add bilingual copy tokens in `src/features/home/copy.ts`.
- [ ] Update unit and validation tests in `src/features/home/__tests__/validation.test.ts`.
- [ ] Formatting clean via `bun run format`.
- [ ] Typecheck clean via `bun run check` and `bunx tsc --noEmit`.
- [ ] ESLint clean via `bun run lint`.
- [ ] Vitest tests pass via `bun run test`.
- [ ] Production build succeeds via `bun run build`.
- [ ] Knowledge graph synchronized via `graphify update .`.
