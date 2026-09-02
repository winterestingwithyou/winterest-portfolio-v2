---
trigger: always_on
---

# Code Quality, State Management, Testing & Standards

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
- **Cloudflare Workers Mocking in Tests**: When testing code that depends on Cloudflare Workers environment variables or bindings (`env`), always import the mock directly from `src/test/cloudflare-workers-mock.ts` (e.g. `import { env as mockEnv } from '#/test/cloudflare-workers-mock'`). Avoid importing `'cloudflare:workers'` directly in test files to mutate env bindings, because the TypeScript compiler (`tsc`) checks the rigid `Env` interface from `worker-configuration.d.ts` rather than the test mock, leading to typing conflicts.
- Run `bun run typecheck`, `bun run lint`, and `bun run test` before finalizing tasks.

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
- Do **NOT** create monolithic copy files (e.g. dumping all pages' copy into a single file).
- Do **NOT** put UI copy in random subdirectories (e.g. avoid `src/features/auth/content/auth-copy.ts`; use `src/features/auth/copy.ts`).
- Do **NOT** import `cloudflare:workers` directly in test files to mutate env bindings; use `src/test/cloudflare-workers-mock.ts` instead.
