# Winterest Portfolio v2

Personal portfolio platform for **M. Adam Yudistira / winterestingwithyou**.

This project is evolving from a TanStack Start resume starter into a polished public portfolio, CMS dashboard, and developer lab with a Cloudflare + Bun inspired aesthetic.

## Direction

- Public portfolio pages for projects, writing, lab experiments, stack, contact, and resume.
- CMS dashboard for projects first, then writing, lab, skills, media, users, roles, and settings.
- Cloudflare Workers-compatible deployment with D1 for CMS data.
- Better Auth and simple owner/editor RBAC planned after the public shell and CMS foundation.
- Optional character or 3D visual layer only after the core product is stable.

## Stack

- Bun
- React 19
- TanStack Start and TanStack Router
- TanStack Query, Form, Table, Store, and React DB where useful
- TypeScript
- Vite
- Cloudflare Vite plugin and Wrangler
- Tailwind CSS v4
- Radix/shadcn-style UI primitives
- Drizzle ORM and Cloudflare D1
- Better Auth later
- Paraglide/Inlang
- T3Env
- Vitest, Testing Library, ESLint, Prettier

## Development

Install dependencies with Bun:

```bash
bun install
```

Useful checks:

```bash
bun run check
bun run lint
bun run test
bun run build
```

Generate TanStack Router route types after adding route files:

```bash
bun run generate-routes
```

Preview and Cloudflare type generation are available when needed:

```bash
bun run preview
bun run cf-typegen
```

## Owner-Run Commands

The project owner runs development servers and database migration commands personally.

Agents should not run these unless explicitly asked in the same turn:

```bash
bun run dev
bun --bun run dev
vite dev
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio
```

`bun run db:generate` should only be used for intentional schema-file work.

## Database

Cloudflare D1 is configured in `wrangler.jsonc`:

- Binding: `DB`
- Database name: `winterest-portfolio`

The first Drizzle schema covers the project CMS foundation:

- `projects`
- `technologies`
- `project_technologies`

Generate migration files after intentional schema edits:

```bash
bun run db:generate -- --name initial_portfolio_cms
```

The owner applies migrations to D1.

## Current Phase

The public portfolio shell is in place, and the project is moving into the CMS
foundation phase:

- `/`
- `/about`
- `/projects`
- `/projects/$slug`
- `/lab`
- `/lab/$slug`
- `/writing`
- `/writing/$slug`
- `/stack`
- `/contact`
- `/resume`
- `/dashboard`
- `/dashboard/projects`
- `/dashboard/projects/new`
- `/dashboard/projects/$id`

The early public content is still local seed data in `src/features/portfolio/data.ts`.
The dashboard routes are ready for D1-backed mutations and Better Auth guards in
the next phase.

## Deployment

The current direction is Cloudflare Workers-compatible deployment through the Cloudflare Vite plugin and `wrangler.jsonc`.

Keep server-side code edge-friendly:

- Prefer Web APIs.
- Avoid Node-only runtime assumptions.
- Keep server functions small.
- Do not commit secrets.
- Validate environment variables through T3Env.
