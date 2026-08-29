---
trigger: always_on
---

# Architecture, Code Standards & Best Practices

## Current Project State & Evolution

The repository was initialized from a TanStack Start template/resume example.

- Replace starter resume design with custom portfolio platform design.
- Remove starter/demo specific logic once replacement pages exist.
- Prefer gradual, modular refactors over giant breaking rewrites.

---

## Tech Stack

Use the existing stack as the default foundation:

- **Runtime & Framework**: Bun, React 19, TanStack Start, TanStack Router, TanStack Query, TanStack Form, TanStack Table, TanStack Store, TypeScript, Vite, `@cloudflare/vite-plugin`, Wrangler.
- **Styling & UI**: Tailwind CSS v4, shadcn/ui primitives, Radix UI, Lucide React, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate` / `tw-animate-css`.
- **Data & Auth**: Drizzle ORM, Cloudflare D1, Better Auth, `ofetch`, T3Env (`@t3-oss/env-core`), Paraglide/Inlang, Content Collections.
- **Testing & Quality**: Vitest, Testing Library, ESLint, Prettier, TypeScript checks.
- **Visuals & 3D (Future)**: React Three Fiber, Drei, Three.js, lightweight `.glb` assets.

---

## File & Folder Organization

- **Kebab-Case Naming**: All files and directories across the project **MUST** use `kebab-case` naming (e.g. `dashboard-shell.tsx`, `project-editor-form.tsx`, `auth-client.ts`, `server-functions.ts`).
- **Feature-Based Architecture**:
  ```txt
  src/
    components/
      ui/              # Reusable UI primitives (buttons, inputs, cards)
      layout/          # Header, footer, navigation shells
      marketing/       # Public landing components
      dashboard/       # Admin-specific UI elements
      visual/          # Mascot and graphics
    features/
      about/           # About page components, timeline, values, copy/data
        components/
        pages/
      auth/            # Better Auth hooks, session management, login forms
        components/
        pages/
      contact/         # Contact forms, channels, validation
        components/
        pages/
      dashboard/       # Dashboard overview widgets & state
        components/
        pages/
      home/            # Homepage hero, stats, marquee, sections
        components/
        pages/
      media/           # Media queries, upload helpers, grid
        components/
        pages/
        query-options.ts # TanStack Query options
        hooks.ts         # Mutation hooks
      projects/        # Projects queries, validation, editor forms, case study
        components/
        pages/
        queries.ts       # Server-side Drizzle DB queries
        query-options.ts # TanStack Query options
        hooks.ts         # Mutation hooks
      settings/        # Site settings queries & actions
        components/
        pages/
        query-options.ts # TanStack Query options
        hooks.ts         # Mutation hooks
      social/          # Social links queries, hooks, types
        components/
        pages/
        query-options.ts # TanStack Query options
        hooks.ts         # Mutation hooks
      technologies/    # Tech stack queries, categories, technology management
        components/
        pages/
        queries.ts       # Server-side Drizzle DB queries
        query-options.ts # TanStack Query options
        hooks.ts         # Mutation hooks
      users/           # User management queries & forms
        components/
        pages/
        queries.ts       # Server-side Drizzle DB queries
        query-options.ts # TanStack Query options
        hooks.ts         # Mutation hooks
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
- **Feature `pages/` Convention**: If a feature renders a dedicated page view, create a `pages/` directory inside `src/features/<feature>/` (e.g. `src/features/about/pages/about-page.tsx`, `src/features/auth/pages/login-page.tsx`, `src/features/home/pages/home-page.tsx`, `src/features/contact/pages/contact-page.tsx`). The corresponding route file in `src/routes/` acts strictly as a thin route gateway that manages routing configuration (`loader`, `beforeLoad`, `validateSearch`, `head`) and imports/mounts the page component from `src/features/<feature>/pages/`.
- **Feature `section/`, `form/`, & `table/` Component Grouping Convention**:
  - **Section Components**: If a component represents a visual section of a feature's page view, store it under `src/features/<feature>/components/section/<comp-name>.tsx` (e.g. `src/features/about/components/section/about-hero.tsx`, `src/features/home/components/section/home-hero.tsx`).
  - **Form Components**: If a component is an interactive form or handles data input/mutations, store it under `src/features/<feature>/components/form/<comp-name>.tsx` (e.g. `src/features/auth/components/form/login-form.tsx`, `src/features/contact/components/form/contact-form.tsx`).
  - **Table Components**: All tabular data components **MUST** use **TanStack Table** (`@tanstack/react-table`) following shadcn data-table modular conventions:
    - Main table component: `src/features/<feature>/components/table/<comp-name>-table.tsx` (e.g. `dashboard-projects-table.tsx`).
    - Column definitions: `src/features/<feature>/components/table/<comp-name>-table-columns.tsx` (e.g. `dashboard-projects-table-columns.tsx`).
    - Table features / state / helpers: `src/features/<feature>/components/table/<comp-name>-table-features.ts` (e.g. `dashboard-projects-table-features.ts`).
  - **Atomic/Sub-Components**: Other small supporting components that are neither complete sections, forms, nor tables can reside directly under `src/features/<feature>/components/<comp-name>.tsx` (e.g. `src/features/about/components/glass-shard-card.tsx`).
- **Feature Server vs Client Data Separation**:
  - **`queries.ts`**: Reserved strictly for server-side Drizzle ORM DB queries (called from API endpoints & server functions).
  - **`query-options.ts`**: Reserved for client/loader TanStack Query `queryOptions({ queryKey, queryFn })` definitions (consumed directly by components and route loaders).
  - **`hooks.ts`**: Reserved strictly for custom mutation hooks (`useMutation`) and client-side UI hooks. Do NOT create `useQuery` / `useSuspenseQuery` wrapper hooks here.

---

## Code Quality & Style Standards

- **TypeScript-First**: Explicit type definitions for exported functions; avoid `any`.
- **Clean React**: Keep components focused; avoid unnecessary `useEffect`; prefer derived state over duplicated state; avoid hydration mismatch patterns.
- **State Management**:
  - **Server State**: Use **TanStack Query** with `queryOptions` (`src/features/<feature>/query-options.ts`) for data fetching in route loaders and components (`useSuspenseQuery` / `useQuery`), and custom mutation hooks (`src/features/<feature>/hooks.ts`) for actions (`useMutation`). Components **MUST NEVER** invoke `api()` directly. Always invalidate related query keys after mutations.
  - **Client State**: Use **TanStack Store** or React local state for UI state (e.g. modals, active drawer, command palette).
  - **Tables**: Use **TanStack Table** for dashboard data grids with sorting, filtering, and row actions.

---

## Internationalization (i18n)

- Integrated with Paraglide/Inlang.
- Do not hardcode user-facing copy everywhere if localization is enabled.
- English is primary for professional international reach; Indonesian provides local/personal context.
- Keep route localization compatible with TanStack Router.

---

## Testing & Quality Assurance

- Add and maintain tests for critical business logic using **Vitest**.
- Prioritize tests for: auth helpers, role guards, slug utilities, Zod validation schemas, database query helpers, and dashboard mutations.
- Run `bun run check`, `bun run lint`, and `bun run test` before finalizing tasks.

---

## Git & Change Management

- Keep commits focused and incremental.
- Preserve existing user work.
- Use conventional commit messages:
  - `feat: add project gallery filter`
  - `fix: validate session on dashboard routes`
  - `refactor: extract project card component`
  - `chore: update database migration script`

---

## Things to Avoid

- Do **NOT** keep the default resume template as the final design.
- Do **NOT** over-engineer RBAC too early.
- Do **NOT** build heavy 3D before core portfolio and CMS pages work reliably.
- Do **NOT** add unnecessary dependencies for tiny UI effects.
- Do **NOT** use `localStorage` for auth tokens.
- Do **NOT** expose admin-only data in public route loaders.
- Do **NOT** ignore Cloudflare edge runtime constraints (CPU limits, Web Crypto).
- Do **NOT** commit secrets or `.env` files.
- Do **NOT** break dark mode compatibility.
- Do **NOT** ignore responsive mobile layouts.
- Do **NOT** use unsafe markdown rendering (`dangerouslySetInnerHTML` without sanitization).
- Do **NOT** create exact copies of copyrighted characters.
- Do **NOT** make the dashboard overly animated or distracting.
