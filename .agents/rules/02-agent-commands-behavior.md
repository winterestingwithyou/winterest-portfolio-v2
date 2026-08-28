---
trigger: always_on
---

# Package Manager, Agent Commands & Behavior

## Package Manager

- Use **Bun** by default.
- This project is Bun-first. Do **NOT** use `npm`, `pnpm`, or `yarn` unless explicitly requested by the user.

---

## Standard Project Commands Reference

```bash
bun install
bun run dev
bun run build
bun run preview
bun run test
bun run lint
bun run format
bun run check
bun run deploy
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio:local
bun run db:studio:remote
bun run cf-typegen
```

---

## Agent Forbidden Commands

The project owner runs development servers and database migration commands personally.

Agents must **NOT** run these commands unless the user explicitly asks in the same turn:

```bash
bun run dev
bun --bun run dev
vite dev
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio:local
bun run db:studio:remote
```

---

## Allowed Agent Verification Commands

Before considering a task done, run the relevant checks when appropriate:

- `bun run check` (TypeScript typechecking across project)
- `bun run lint` (ESLint static analysis)
- `bun run test` (Vitest test suite)
- `bun run build` (Production client and worker bundle build)
- `bun run preview` (Vite / TanStack Start local preview)
- `bun run cf-typegen` (Cloudflare Workers bindings and type generation)
- `bun run db:generate` (Only for intentional Drizzle schema file updates)

---

## Agent Behavioral Principles

When working in this repository:

- Be proactive, direct, and practical.
- Prefer practical implementation over abstract planning.
- Preserve the user's intended aesthetic and architectural direction.
- Make reasonable decisions when minor details are missing.
- Ask questions only when ambiguity would cause major rework.
- Explain tradeoffs briefly and clearly.
- Keep the codebase Cloudflare-compatible and maintainable for long-term solo development.
- Prioritize public portfolio quality first, then CMS dashboard, then auth/RBAC, then 3D polish.

---

## Definition of Done (DoD)

A task or feature is complete when:

1. The requested functionality works correctly.
2. All TypeScript checks pass (`bun run check`).
3. Linting and formatting are clean (`bun run lint`).
4. Production build succeeds without errors (`bun run build`).
5. Layout is responsive on both mobile and desktop.
6. Works seamlessly across Light and Dark mode.
7. No secrets, credentials, or administrative data are leaked.
8. Relevant test cases pass if applicable (`bun run test`).

For major tasks, report:

- What changed
- Files touched
- Commands run
- Commands not run and why
- Known limitations
- Recommended next steps
