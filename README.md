# Winterest Portfolio v2

Personal portfolio platform for **Winterest**.

This project is evolving from a TanStack Start resume starter into a polished public portfolio, CMS dashboard, and developer lab with a Cloudflare + Bun inspired aesthetic.

## Direction

- Public portfolio pages for projects, writing, lab experiments, stack, contact, and resume.
- CMS dashboard for projects first, then writing, lab, skills, media, users, roles, and settings.
- Cloudflare Workers-compatible deployment with D1 for CMS data.
- Better Auth with simple owner/editor RBAC for private dashboard access.
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
- Better Auth
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
- Migrations directory: `drizzle`

The first Drizzle schema covers the project CMS foundation:

- `projects`
- `technologies`
- `project_technologies`
- Better Auth tables: `user`, `session`, `account`, `verification`
- Phase 5 content tables: `writing`, `lab_entries`, `media`

Generate migration files after intentional schema edits:

```bash
bun run db:generate -- --name initial_portfolio_cms
```

Current generated migration files:

- `drizzle/0001_add_auth_rbac.sql`
- `drizzle/0002_add_writing_lab_media.sql`

Runtime database access uses the Cloudflare D1 binding directly:

```ts
import { drizzle } from 'drizzle-orm/d1'

const db = drizzle(env.DB)
```

Drizzle Kit remote commands use the Cloudflare D1 HTTP driver. Owner-run
migration/push/pull commands need these local environment variables:

```bash
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_DATABASE_ID=7ff292bd-6969-4fce-9644-22a4bba8805e
CLOUDFLARE_D1_API_TOKEN=
```

`DATABASE_URL` is not used for the Cloudflare D1 runtime.

## Authentication

Better Auth is configured against the Cloudflare D1 `DB` binding with a
Cloudflare-friendly PBKDF2 Web Crypto password hasher.

Required local/runtime variables:

```bash
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=
```

Generate and store `BETTER_AUTH_SECRET` locally or as a Worker secret. Do not
commit real secrets.

### Owner Account Setup (CLI)

The portfolio enforces a strict **1 Owner Rule**. Initialize the owner account via interactive terminal CLI:

```bash
# For local D1 database:
bun run create-owner:local

# For remote Cloudflare D1 database:
bun run create-owner:remote
```

The script interactively prompts for Name, Email, and Password, validates inputs, and securely stores the owner credentials. Public registration is disabled; additional users (Admins & Editors) can be managed via the Dashboard.

## Current Phase

The public portfolio shell, project CMS foundation, and first visual layer are
in place:

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
- `/dashboard/writing`
- `/dashboard/writing/new`
- `/dashboard/writing/$id`
- `/dashboard/lab`
- `/dashboard/lab/new`
- `/dashboard/lab/$id`
- `/dashboard/media`

The early public content is still local seed data in
`src/features/portfolio/data.ts`, but public writing and lab routes now try to
load published D1 records first and fall back to seeds when migrations are not
applied yet. Dashboard project, writing, and lab CRUD use D1 through API routes
and require a Better Auth dashboard session.

The first static mascot asset lives at
`public/assets/characters/winterest-mascot.png` and is used by the homepage hero.

## Deployment

The current direction is Cloudflare Workers-compatible deployment through the Cloudflare Vite plugin and `wrangler.jsonc`.

Keep server-side code edge-friendly:

- Prefer Web APIs.
- Avoid Node-only runtime assumptions.
- Keep server functions small.
- Do not commit secrets.
- Validate environment variables through T3Env.

## License

Winterest Portfolio V2 is free and open-source software licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

You are free to use, study, modify, and distribute the software in accordance with the terms of the AGPLv3.

### Commercial License

A commercial license is also available for organizations or individuals who require additional rights beyond those provided by the AGPLv3.

This may include:

- proprietary modifications;
- private extensions;
- white-label deployments;
- proprietary distribution;
- commercial customization;
- additional commercial rights or services.

The commercial license is provided separately and does not replace or modify the rights granted by the AGPLv3.

For commercial licensing and custom development inquiries:

**Email:** yudistiraadam3@gmail.com

See [`LICENSE-COMMERCIAL`](./LICENSE-COMMERCIAL) for more information.

### Third-Party Licenses

This project uses third-party dependencies that are distributed under their respective licenses.

Third-party licenses remain applicable to their respective components.
