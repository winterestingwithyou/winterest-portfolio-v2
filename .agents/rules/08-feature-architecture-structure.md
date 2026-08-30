---
trigger: always_on
---

# Feature Architecture & Folder Structure

## Current Project State & Evolution

The repository was initialized from a TanStack Start template/resume example.

- Replace starter resume design with custom portfolio platform design.
- Remove starter/demo specific logic once replacement pages exist.
- Prefer gradual, modular refactors over giant breaking rewrites.

---

## Tech Stack Foundation

- **Runtime & Framework**: Bun, React 19, TanStack Start, TanStack Router, TanStack Query, TanStack Form, TanStack Table, TanStack Store, TypeScript, Vite, `@cloudflare/vite-plugin`, Wrangler.
- **Styling & UI**: Tailwind CSS v4, shadcn/ui primitives, Radix UI, Lucide React, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`.
- **Data & Auth**: Drizzle ORM, Cloudflare D1, Better Auth, `ofetch`, T3Env (`@t3-oss/env-core`), Paraglide/Inlang.
- **Testing & Quality**: Vitest, Testing Library, ESLint, Prettier, TypeScript checks.
- **Visuals & 3D (Future)**: React Three Fiber, Drei, Three.js, lightweight `.glb` assets.

---

## File & Folder Organization

- **Kebab-Case Naming**: All files and directories across the project **MUST** use `kebab-case` naming (e.g. `dashboard-shell.tsx`, `project-editor-form.tsx`, `auth-client.ts`, `server-functions.ts`).
- **Feature-Based Architecture Pattern**:
  ```txt
  src/
    components/
      ui/              # Reusable UI primitives (buttons, inputs, cards)
      layout/          # Header, footer, navigation shells
      marketing/       # Public landing components
      dashboard/       # Admin-specific UI elements
      visual/          # Mascot and graphics
    features/
      <feature>/       # Self-contained domain modules (about, auth, contact, dashboard, home, media, portfolio, projects, settings, social, system, technologies, users)
        components/
          section/     # Visual section components (e.g. home-hero.tsx)
          form/        # Form & interactive mutation components (e.g. login-form.tsx)
          table/       # TanStack Table components (table, columns, features)
        pages/         # Dedicated page views (e.g. home-page.tsx, about-page.tsx)
        copy.ts        # Localized UI copy strings (en/id)
        data.ts        # Static structured datasets (if applicable)
        queries.ts     # Server-side Drizzle DB queries (if applicable)
        query-options.ts # TanStack Query options (for loaders & components)
        hooks.ts       # Custom mutation hooks (useMutation)
        validation.ts  # Zod validation schemas
    lib/
      api-client.ts    # Centralized ofetch client & error handler
      auth/            # Better Auth client & server config
      db/              # Drizzle DB client instance
      env.ts           # T3Env environment validator
      utils.ts         # cn() utility
    db/
      schema.ts        # Drizzle table schemas (Single Source of Truth)
      seed.ts          # Seed data generator
    routes/
      __root.tsx
      index.tsx
      ...
    styles.css
  ```

---

## Route Gateway vs Feature `pages/`

- If a feature renders a dedicated page view, create a `pages/` directory inside `src/features/<feature>/` (e.g. `src/features/about/pages/about-page.tsx`, `src/features/auth/pages/login-page.tsx`, `src/features/home/pages/home-page.tsx`, `src/features/contact/pages/contact-page.tsx`).
- The corresponding route file in `src/routes/` acts strictly as a **thin route gateway** that manages routing configuration (`loader`, `beforeLoad`, `validateSearch`, `head`) and imports/mounts the page component from `src/features/<feature>/pages/`.

---

## Component Grouping Conventions (`section/`, `form/`, `table/`)

- **Section Components**: If a component represents a visual section of a feature's page view, store it under `src/features/<feature>/components/section/<comp-name>.tsx` (e.g. `src/features/home/components/section/home-hero.tsx`).
- **Form Components**: If a component is an interactive form or handles data input/mutations, store it under `src/features/<feature>/components/form/<comp-name>.tsx` (e.g. `src/features/auth/components/form/login-form.tsx`).
- **Table Components**: All tabular data components **MUST** use **TanStack Table** (`@tanstack/react-table`) following modular conventions:
  - Main table component: `src/features/<feature>/components/table/<comp-name>-table.tsx` (e.g. `dashboard-projects-table.tsx`).
  - Column definitions: `src/features/<feature>/components/table/<comp-name>-table-columns.tsx` (e.g. `dashboard-projects-table-columns.tsx`).
  - Table features / state / helpers: `src/features/<feature>/components/table/<comp-name>-table-features.ts` (e.g. `dashboard-projects-table-features.ts`).
- **Atomic/Sub-Components**: Other small supporting components can reside directly under `src/features/<feature>/components/<comp-name>.tsx` (e.g. `src/features/about/components/glass-shard-card.tsx`).

---

## Server vs Client Data Separation

- **`queries.ts`**: Reserved strictly for server-side Drizzle ORM DB queries (called from API endpoints & server functions).
- **`query-options.ts`**: Reserved for client/loader TanStack Query `queryOptions({ queryKey, queryFn })` definitions (consumed directly by components and route loaders).
- **`hooks.ts`**: Reserved strictly for custom mutation hooks (`useMutation`) and client-side UI hooks. Do NOT create `useQuery` / `useSuspenseQuery` wrapper hooks here.
