# Winterest Portfolio v2

Personal developer platform and portfolio for **Winterest**.

Built with **TanStack Start**, **React 19**, and **Cloudflare Workers**, featuring a **Cloudflare + Bun** inspired visual language (orange accents, clean dark/light modes, and playful developer energy).

---

## Features & Direction

- **Public Portfolio**: Projects, interactive Dev Lab, technical writing/devlog, tech stack showcase, contact page, and resume.
- **CMS Dashboard**: Content management for projects, technologies, categories, site settings, and team accounts.
- **Strict 1-Owner Model**: Single owner architecture with RBAC (`owner`, `admin`, `editor`). Public signup is disabled; admins and editors are managed privately from the dashboard.
- **Built-in Setup Guard**: Two-stage initialization guard that displays dedicated terminal instructions on the web UI if database migrations or the owner account are pending.
- **Cloudflare-First Architecture**: Built for Cloudflare Workers with D1 SQL database and edge-compatible runtime.

---

## Tech Stack

- **Runtime & Framework**: Bun, React 19, TanStack Start, TanStack Router
- **State & Data**: TanStack Query, Drizzle ORM, Cloudflare D1 (SQLite)
- **Authentication**: Better Auth (with PBKDF2 Web Crypto password hashing & secure cookie sessions)
- **Styling**: Tailwind CSS v4, Radix UI primitives, Lucide React, class-variance-authority
- **Internationalization**: Paraglide / Inlang (English `en` & Indonesian `id`)
- **Environment & Config**: T3Env, Vite, Cloudflare Vite plugin, Wrangler
- **Testing & Quality**: Vitest, Testing Library, ESLint, Prettier, TypeScript (`tsc --noEmit`)

---

## Getting Started

### 1. Prerequisites

- [Bun](https://bun.sh) (v1.1+ recommended)
- Node.js (for Cloudflare Wrangler tools)

### 2. Installation

Clone the repository and install dependencies with Bun:

```bash
git clone https://github.com/winterestingwithyou/winterest-portfolio-v2.git
cd winterest-portfolio-v2
bun install
```

### 3. Environment Variables

Create a `.env` or `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

Required variables:

```bash
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-random-32-char-secret-key-here
```

For remote Cloudflare D1 operations (optional for local dev):

```bash
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id
CLOUDFLARE_D1_API_TOKEN=your-cloudflare-api-token
```

### 4. Database Setup & Migrations

Initialize the local D1 database schema:

```bash
# Apply migrations to local D1 SQLite:
bun run db:migrate:local

# Or reset and apply all migrations cleanly from scratch:
bun run db:fresh:local
```

### 5. Create Owner Account (CLI)

The platform requires a primary owner account before full access is unlocked. Run the interactive CLI script:

```bash
# For local D1 database:
bun run create-owner:local

# For remote Cloudflare D1 database:
bun run create-owner:remote
```

The CLI interactively prompts for:

- **Owner Name** (default: `Winterest`)
- **Owner Email** (e.g. `owner@winterest.tech`)
- **Owner Password** (masked with asterisks `*` and includes confirmation prompt)

### 6. Start Development Server

```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Setup Guard & Initialization Flow

The application includes an automated **Two-Stage Setup Guard** in the web app:

1. **Stage 1 — Database Migration Required**: If database tables have not been created yet, the web UI locks and displays the dedicated **Database Migration Required** screen with commands (`bun run db:migrate:local`).
2. **Stage 2 — Owner Account Required**: Once tables exist but no owner has been registered, the UI locks and displays the **Owner Account Required** screen with CLI commands (`bun run create-owner:local`).
3. **Stage 3 — Unlocked**: Once the owner account is created and the page refreshed, full access to public pages and the dashboard is unlocked.

---

## Available Scripts

### Development & Checks

```bash
bun run dev             # Start dev server
bun run typecheck       # TypeScript typecheck (tsc --noEmit)
bun run lint            # ESLint check
bun run test            # Run Vitest test suite
bun run build           # Build production Cloudflare Worker bundle
bun run preview         # Preview production build locally
bun run check           # Prettier formatting check
bun run format          # Format files with Prettier
bun run cf-typegen      # Regenerate Cloudflare worker configuration types
```

### Database Management

```bash
# Local D1 (Miniflare SQLite)
bun run db:migrate:local   # Apply pending D1 migrations locally
bun run db:reset:local     # Drop all tables using drizzle/scripts/reset.sql
bun run db:fresh:local     # Reset + apply all migrations locally
bun run create-owner:local # Create owner account on local D1
bun run db:seed:local      # Seed local database

# Remote Cloudflare D1
bun run db:migrate:remote   # Apply pending D1 migrations to Cloudflare
bun run db:reset:remote     # Drop all remote tables
bun run db:fresh:remote     # Reset + apply all migrations to remote
bun run create-owner:remote # Create owner account on remote D1
bun run db:seed:remote      # Seed remote Cloudflare D1 database

# Drizzle Kit
bun run db:generate         # Generate new SQL migration file from src/db/schema.ts
```

> **Note on `reset.sql` Maintenance**: Whenever new tables are added or modified in `src/db/schema.ts`, `drizzle/scripts/reset.sql` must be updated with corresponding `DROP TABLE IF EXISTS` statements.

---

## Authentication & RBAC

- **Authentication Foundation**: Better Auth with PBKDF2 Web Crypto password hashing and secure HTTP-only cookies.
- **Roles**:
  - `owner`: Full access to the platform, user management (promoting/demoting admins and editors), site settings, and content management. Exactly 1 owner account permitted.
  - `admin`: Content management, media uploads, and site settings.
  - `editor`: Create, edit, and manage portfolio content (projects, writing, lab, stack).
- **Public Signup Disabled**: All team accounts are invited and created privately by the owner via `/dashboard/users`.

---

## Routes Structure

- `/` — Homepage Hero, Featured Projects, Lab Showcase, Tech Stack highlights
- `/about` — Developer journey, timeline, principles, and workflow
- `/projects` & `/projects/$slug` — Case studies and portfolio projects
- `/lab` & `/lab/$slug` — Interactive dev experiments and UI demos
- `/writing` & `/writing/$slug` — Articles, learning notes, and devlogs
- `/stack` — Technology stack and tooling showcase
- `/contact` — Contact details and social links
- `/resume` — Clean, printable resume view
- `/login` — Secure single sign-in page for dashboard users
- `/dashboard` — Content and platform management CMS
  - `/dashboard/projects` — Projects management
  - `/dashboard/stack` — Technologies & Categories management
  - `/dashboard/users` — Team user accounts & role management
  - `/dashboard/media` — Media asset library
  - `/dashboard/settings` — Global site & SEO settings

---

## License

Winterest Portfolio is free and open-source software licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

See [`LICENSE`](./LICENSE) for full details.

### Commercial License

A commercial license is available for organizations or individuals requiring proprietary modifications, private extensions, or commercial distribution rights.

**Contact:** yudistiraadam3@gmail.com — See [`LICENSE-COMMERCIAL`](./LICENSE-COMMERCIAL) for details.
