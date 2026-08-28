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
      auth/            # Better Auth hooks, session management
      dashboard/       # Dashboard overview widgets & state
      projects/        # Projects queries, validation, editor forms
      stack/           # Tech stack queries, categories, technology management
      media/           # Media queries, upload helpers, grid
      settings/        # Site settings queries & actions
      users/           # User management queries & forms
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

## Code Quality & Style Standards

- **TypeScript-First**: Explicit type definitions for exported functions; avoid `any`.
- **Clean React**: Keep components focused; avoid unnecessary `useEffect`; prefer derived state over duplicated state; avoid hydration mismatch patterns.
- **State Management**:
  - **Server State**: Use **TanStack Query** for cached server data. Co-locate query hooks in feature folders and invalidate queries after mutations.
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
