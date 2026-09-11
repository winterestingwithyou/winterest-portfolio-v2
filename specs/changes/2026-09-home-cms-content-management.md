# RFC: Full Home Page CMS Content Management

- **Feature ID**: `feat-home-cms`
- **Date**: `2026-09-11`
- **Status**: `Draft`
- **Target Routes**:
  - Public: `/` (Homepage)
  - Dashboard: `/dashboard/home` (Home Content Management)
  - API: `/api/home/config`, `/api/home/enthusiasms`, `/api/home/enthusiasms/:id`, `/api/home/enthusiasms/reorder`
- **Target Modules**:
  - `src/features/home/`
  - `src/db/schema.ts`
  - `src/routes/dashboard/home/`
  - `src/routes/api/home/`

---

## 1. Overview & Problem Statement

Currently, the portfolio homepage (`/`) mixes dynamic CMS data with hardcoded strings:

- **Projects & Ultimate Tech**: Already dynamically populated from D1 (`projects` where `featured = true` and `technologies` where `isUltimate = true`).
- **Hero, Focus Areas, Section Headers & CTA**: All strings, section headers, focus area items (Enthusiasms), and portfolio metrics (Stats) are hardcoded inside `src/features/home/copy.ts` and `src/features/portfolio/data.ts`.
- **Limitation**: Any adjustment to the hero headline, personal bio, discipline focus cards, or CTA banner requires committing code and redeploying the entire application. Furthermore, there is no way to toggle the visibility of verbose section descriptions.

### Proposed Capabilities

1. **Dedicated Dashboard Route (`/dashboard/home`)**:
   - Added to the CMS sidebar navigation under Content Management.
   - Organized into **3 Modular Tabs**:
     - **Tab 1: Hero & Stats**: Personal introduction, titles, bio, and 1–4 customizable portfolio metric cards.
     - **Tab 2: Enthusiasms**: Section header configuration, description toggle, and a full CRUD manager (add, edit, delete, reorder, active toggle) for focus areas with a visual Lucide icon picker.
     - **Tab 3: Section Headers & CTA**: Eyebrows, titles, descriptions, and show/hide description toggles for Featured Projects, Tech Marquee, plus the closing conversion CTA banner.
2. **First-Class Bilingual Editing (`en` / `id`)**:
   - Top-level language switcher (`EN` / `ID`) allowing editors to seamlessly translate copy without dual cluttered inputs.
3. **Section Description Visibility Toggles**:
   - Optional toggles (`showFeaturedDescription`, `showEnthusiasmsDescription`, `showMarqueeDescription`) to give the owner flexibility over visual density.
4. **Rule 9 CMS Fallback Contract**:
   - Strict resilience: If database records are uninitialized or empty, the frontend gracefully falls back to `src/features/home/copy.ts` and `portfolioStats` without blank screens or runtime errors.

---

## 2. Database & Storage Contract (D1 & R2)

### D1 Tables & Schema Changes (`src/db/schema.ts`)

#### 1. Table `home_config` (Single-row configuration entity)

Stores home section headers, hero texts, stats repeater, section description toggles, and CTA settings.

```ts
export const homeConfig = sqliteTable('home_config', {
  id: text('id').primaryKey().default('default'),

  // Hero Section
  heroEyebrowEn: text('hero_eyebrow_en').notNull().default(''),
  heroEyebrowId: text('hero_eyebrow_id').notNull().default(''),
  heroTitleEn: text('hero_title_en').notNull().default(''),
  heroTitleId: text('hero_title_id').notNull().default(''),
  heroIntroEn: text('hero_intro_en').notNull().default(''),
  heroIntroId: text('hero_intro_id').notNull().default(''),
  heroIntroSuffixEn: text('hero_intro_suffix_en').notNull().default(''),
  heroIntroSuffixId: text('hero_intro_suffix_id').notNull().default(''),

  // Portfolio Stats (JSON array: [{ labelEn, labelId, value }])
  showStats: integer('show_stats', { mode: 'boolean' }).notNull().default(true),
  statsJson: text('stats_json').notNull().default('[]'),

  // Featured Projects Section Header
  featuredEyebrowEn: text('featured_eyebrow_en').notNull().default(''),
  featuredEyebrowId: text('featured_eyebrow_id').notNull().default(''),
  featuredTitleEn: text('featured_title_en').notNull().default(''),
  featuredTitleId: text('featured_title_id').notNull().default(''),
  featuredDescriptionEn: text('featured_description_en').notNull().default(''),
  featuredDescriptionId: text('featured_description_id').notNull().default(''),
  showFeaturedDescription: integer('show_featured_description', {
    mode: 'boolean',
  })
    .notNull()
    .default(true),

  // Enthusiasms Section Header
  enthusiasmsEyebrowEn: text('enthusiasms_eyebrow_en').notNull().default(''),
  enthusiasmsEyebrowId: text('enthusiasms_eyebrow_id').notNull().default(''),
  enthusiasmsTitleEn: text('enthusiasms_title_en').notNull().default(''),
  enthusiasmsTitleId: text('enthusiasms_title_id').notNull().default(''),
  enthusiasmsDescriptionEn: text('enthusiasms_description_en')
    .notNull()
    .default(''),
  enthusiasmsDescriptionId: text('enthusiasms_description_id')
    .notNull()
    .default(''),
  showEnthusiasmsDescription: integer('show_enthusiasms_description', {
    mode: 'boolean',
  })
    .notNull()
    .default(true),

  // Tech Marquee Section Header
  marqueeEyebrowEn: text('marquee_eyebrow_en').notNull().default(''),
  marqueeEyebrowId: text('marquee_eyebrow_id').notNull().default(''),
  marqueeTitleEn: text('marquee_title_en').notNull().default(''),
  marqueeTitleId: text('marquee_title_id').notNull().default(''),
  marqueeDescriptionEn: text('marquee_description_en').notNull().default(''),
  marqueeDescriptionId: text('marquee_description_id').notNull().default(''),
  showMarqueeDescription: integer('show_marquee_description', {
    mode: 'boolean',
  })
    .notNull()
    .default(true),

  // Closing CTA Banner
  ctaCommand: text('cta_command').notNull().default('bun run build'),
  ctaTitleEn: text('cta_title_en').notNull().default(''),
  ctaTitleId: text('cta_title_id').notNull().default(''),
  ctaButtonTextEn: text('cta_button_text_en').notNull().default(''),
  ctaButtonTextId: text('cta_button_text_id').notNull().default(''),

  ...timestamps,
})
```

#### 2. Table `home_enthusiasms` (Relational focus area items)

```ts
export const homeEnthusiasms = sqliteTable(
  'home_enthusiasms',
  {
    id: text('id').primaryKey(),
    icon: text('icon').notNull().default('Terminal'),
    titleEn: text('title_en').notNull(),
    titleId: text('title_id').notNull(),
    descriptionEn: text('description_en').notNull(),
    descriptionId: text('description_id').notNull(),
    isEnabled: integer('is_enabled', { mode: 'boolean' })
      .notNull()
      .default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index('home_enthusiasms_is_enabled_idx').on(table.isEnabled),
    index('home_enthusiasms_sort_order_idx').on(table.sortOrder),
  ],
)
```

#### 3. Mandatory `reset.sql` Maintenance (`drizzle/scripts/reset.sql`)

Add drop statements:

```sql
DROP TABLE IF EXISTS home_enthusiasms;
DROP TABLE IF EXISTS home_config;
```

---

## 3. Server & API Contracts (Zod & ofetch)

### Endpoints Matrix

| Endpoint                        | Method   | Role    | Turnstile | Purpose                                        |
| :------------------------------ | :------- | :------ | :-------- | :--------------------------------------------- |
| `/api/home/config`              | `GET`    | Public  | No        | Fetch home config (falls back if unseeded)     |
| `/api/home/config`              | `PUT`    | Editor+ | No        | Update home config & section toggles           |
| `/api/home/enthusiasms`         | `GET`    | Public  | No        | List enthusiasms (public: enabled only)        |
| `/api/home/enthusiasms`         | `POST`   | Editor+ | No        | Create new enthusiasm item                     |
| `/api/home/enthusiasms/:id`     | `PUT`    | Editor+ | No        | Update enthusiasm item                         |
| `/api/home/enthusiasms/:id`     | `DELETE` | Editor+ | No        | Delete enthusiasm item                         |
| `/api/home/enthusiasms/reorder` | `PUT`    | Editor+ | No        | Batch update sort order for drag/reorder items |

### Zod Validation Schemas (`src/features/home/validation.ts`)

```ts
export const statItemSchema = z.object({
  labelEn: z.string().min(1, 'Label EN is required'),
  labelId: z.string().min(1, 'Label ID is required'),
  value: z.string().min(1, 'Value is required'),
})

export const homeConfigSchema = z.object({
  heroEyebrowEn: z.string(),
  heroEyebrowId: z.string(),
  heroTitleEn: z.string(),
  heroTitleId: z.string(),
  heroIntroEn: z.string(),
  heroIntroId: z.string(),
  heroIntroSuffixEn: z.string(),
  heroIntroSuffixId: z.string(),

  showStats: z.boolean(),
  stats: z.array(statItemSchema).max(4, 'Maximum 4 stats items permitted'),

  featuredEyebrowEn: z.string(),
  featuredEyebrowId: z.string(),
  featuredTitleEn: z.string(),
  featuredTitleId: z.string(),
  featuredDescriptionEn: z.string(),
  featuredDescriptionId: z.string(),
  showFeaturedDescription: z.boolean(),

  enthusiasmsEyebrowEn: z.string(),
  enthusiasmsEyebrowId: z.string(),
  enthusiasmsTitleEn: z.string(),
  enthusiasmsTitleId: z.string(),
  enthusiasmsDescriptionEn: z.string(),
  enthusiasmsDescriptionId: z.string(),
  showEnthusiasmsDescription: z.boolean(),

  marqueeEyebrowEn: z.string(),
  marqueeEyebrowId: z.string(),
  marqueeTitleEn: z.string(),
  marqueeTitleId: z.string(),
  marqueeDescriptionEn: z.string(),
  marqueeDescriptionId: z.string(),
  showMarqueeDescription: z.boolean(),

  ctaCommand: z.string(),
  ctaTitleEn: z.string(),
  ctaTitleId: z.string(),
  ctaButtonTextEn: z.string(),
  ctaButtonTextId: z.string(),
})

export const enthusiasmItemSchema = z.object({
  icon: z.string().min(1, 'Icon name is required'),
  titleEn: z.string().min(1, 'Title EN is required'),
  titleId: z.string().min(1, 'Title ID is required'),
  descriptionEn: z.string().min(1, 'Description EN is required'),
  descriptionId: z.string().min(1, 'Description ID is required'),
  isEnabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export const reorderEnthusiasmsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number().int(),
    }),
  ),
})
```

---

## 4. UI & State Architecture

### Component Hierarchy & File Layout

```txt
src/
  routes/
    dashboard/
      home/
        index.tsx                          # Route gateway for /dashboard/home
    api/
      home/
        config.ts                          # GET & PUT home config
        enthusiasms/
          index.ts                         # GET (list) & POST (create)
          $id.ts                           # PUT & DELETE
          reorder.ts                       # PUT reorder
  features/
    home/
      components/
        form/
          home-hero-stats-form.tsx         # Tab 1: Hero text & Stats repeater
          home-sections-cta-form.tsx       # Tab 3: Section headers & CTA form
          enthusiasm-dialog.tsx            # Create/Edit enthusiasm modal dialog
          lucide-icon-picker-modal.tsx     # Visual icon picker with search & grid
        section/
          home-enthusiasms-manager.tsx     # Tab 2: Header form + Enthusiasms CRUD table/cards
        ui/
          language-switcher-pill.tsx       # Floating or inline EN/ID switcher
      pages/
        dashboard-home-page.tsx            # Main 3-tab dashboard view
      query-options.ts                     # homeQueryOptions.config(), homeQueryOptions.enthusiasms()
      hooks.ts                             # useUpdateHomeConfig(), useCreateEnthusiasm(), etc.
      queries.ts                           # Server D1 query helpers
      validation.ts                        # Zod schemas
      copy.ts                              # Bilingual defaults & UI copy
```

### Visual Icon Picker (`lucide-icon-picker-modal.tsx`)

A curated set of 40+ engineering-focused Lucide icons with instant search:

- Software Engineering & Code: `Terminal`, `Code`, `Code2`, `Cpu`, `FileCode`, `GitBranch`, `Bug`, `Wrench`
- Web & UI: `Layout`, `Layers`, `Globe`, `Palette`, `Eye`, `Component`
- Backend & Cloud: `Server`, `Database`, `Cloud`, `Network`, `HardDrive`, `Workflow`, `Binary`
- Security & Testing: `ShieldCheck`, `Shield`, `Lock`, `CheckCircle2`, `Activity`
- Mobile & Devices: `Smartphone`, `Tablet`, `Monitor`, `Tv`
- Creative & Meta: `Sparkles`, `Zap`, `Flame`, `Rocket`, `Compass`, `HeartHandshake`

### Fallback Contract (`src/features/home/copy.ts`)

On the public landing page (`/`), resolved content blends CMS data with the static fallback:

```ts
const title = cmsConfig?.heroTitle?.[locale] || defaultCopy.hero.title
const showDescription = cmsConfig?.showFeaturedDescription ?? true
```

This guarantees zero downtime or broken layouts during zero-migration periods or empty local databases.

---

## 5. Security & RBAC Rules

- **Public Visitors**: Can read active public content via `/` and `GET /api/home/*`.
- **Editor, Admin, Owner**: Can view and mutate all Home CMS configurations via `/dashboard/home` and `PUT/POST/DELETE` API endpoints.
- **CSRF & Cookie Protection**: All mutations require authenticated Better Auth session cookies with Edge PBKDF2 hashing.

---

## 6. Edge Cases & Invariants

1. **Empty / First Run (Zero Config)**: If `home_config` table has no row, the API returns the default fallback structure (from `copy.ts` and `portfolioStats`) without errors.
2. **Hidden Section Description**: When `showFeaturedDescription`, `showEnthusiasmsDescription`, or `showMarqueeDescription` is set to `false`, the `<SectionHeader>` component cleanly omits the `<p className="description">` tag without layout breakage.
3. **Missing / Broken Icon String**: If a stored icon string does not match any known Lucide component, the frontend safely falls back to `<Terminal />` icon instead of throwing an undefined React element error.
4. **Stats Limit Invariant**: The portfolio stats array enforces a maximum of 4 items (`.max(4)`) in Zod to prevent breaking the responsive 2-to-3 column grid in the Hero.
5. **Zero Enthusiasms Enabled**: If all enthusiasm items are disabled or deleted, `EnthusiasmsSection` displays a clean empty state or gracefully conceals the section.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] D1 schemas `homeConfig` and `homeEnthusiasms` added to `src/db/schema.ts` and `drizzle/scripts/reset.sql`.
- [ ] Drizzle migration generated (`bun run db:generate`).
- [ ] API routes `/api/home/config` and `/api/home/enthusiasms/*` validate input with Zod and persist changes.
- [ ] Dashboard route `/dashboard/home` rendered with 3 modular tabs:
  - [ ] Tab 1: Hero & Stats form with 1–4 stats repeater.
  - [ ] Tab 2: Enthusiasms section header + CRUD list with visual Lucide icon picker.
  - [ ] Tab 3: Section headers for Featured, Marquee, CTA with description toggles.
- [ ] Language switcher pill (`EN` / `ID`) toggles active form input values smoothly.
- [ ] Public landing page (`/`) reflects updated texts, toggles, and enthusiasms across both languages.
- [ ] Fallback contract verified: Homepage functions perfectly even when database tables are empty.
- [ ] All TypeScript checks pass cleanly (`bun run check`).
- [ ] Linting and formatting pass cleanly (`bun run lint`).
- [ ] Production build succeeds (`bun run build`).
