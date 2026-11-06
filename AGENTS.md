# AGENTS.md

## Project Identity

This repository is `winterest-portfolio-v2`, the **primary personal portfolio platform** for **M. Adam Yudistira / Winterest**, built with TanStack Start and deployed to Cloudflare Workers.

### Critical Positioning & Replacement Role

- This project is **NOT** a secondary or companion portfolio. This is the **MAIN PRIMARY PORTFOLIO** designed to completely replace all previous portfolios.
- Treat it as the flagship personal developer platform and CMS dashboard for Winterest.

### Brand & Repository Identifiers

- **Public Brand / Nickname**: `Winterest`
- **GitHub Username**: `winterestingwithyou`
- **Internal Repo Name**: `winterest-portfolio-v2` (internal repository name only)

---

## Strict UI Branding & Web Output Rule

- **DO NOT** display `"winterestingwithyou"`, `"winterest portfolio v2"`, `"Winterest Portfolio v2"`, `"winterest-portfolio-v2"`, or internal versioning phrases anywhere in the rendered web UI or web output code (`.tsx`, `.html`, metadata titles, headers, footers, seed data UI copy, etc.).
- Internal repo identifiers like `winterest-portfolio-v2` are ONLY allowed in documentation (`.md` files), git history, and system configurations (`package.json`, `wrangler.jsonc`, etc.).
- On the web UI, the site must be presented strictly as **Winterest** (or **Winterest Portfolio**), the official primary portfolio.

---

## Core Rules Index (`.agents/rules/`)

Guidelines are modularly organized in [`.agents/rules/`](.agents/rules/):

1. **[01-identity-branding-copy.md](.agents/rules/01-identity-branding-copy.md)**: Identity, strict UI branding, copywriting tone, and SEO standards.
2. **[02-agent-commands-behavior.md](.agents/rules/02-agent-commands-behavior.md)**: Bun commands, forbidden agent commands, and Definition of Done.
3. **[03-routing-conventions-pages.md](.agents/rules/03-routing-conventions-pages.md)**: Mandatory folder-based routing, active route map, and page responsibilities.
4. **[04-server-api-ofetch.md](.agents/rules/04-server-api-ofetch.md)**: Server validation, mandatory `ofetch` standard, and form handling.
5. **[05-database-cloudflare.md](.agents/rules/05-database-cloudflare.md)**: Cloudflare D1/Workers edge runtime, `schema.ts` as Single Source of Truth, and mandatory `reset.sql` maintenance.
6. **[06-auth-security-rbac.md](.agents/rules/06-auth-security-rbac.md)**: Better Auth cookie sessions, PBKDF2 edge password hashing, RBAC (`owner`, `admin`, `editor`), and secrets security.
7. **[08-feature-architecture-structure.md](.agents/rules/08-feature-architecture-structure.md)**: Feature-based kebab-case architecture, directory layout, section/form/table component conventions.
8. **[09-copywriting-data-standards.md](.agents/rules/09-copywriting-data-standards.md)**: Feature-scoped `copy.ts` vs static `data.ts`, i18n helpers, global layout copy, and future CMS fallback contract.
9. **[10-code-quality-testing.md](.agents/rules/10-code-quality-testing.md)**: TypeScript & Clean React, state management, Vitest testing, Git standards, and things to avoid.
10. **[graphify.md](.agents/rules/graphify.md)**: Knowledge graph query and update rules.

Visual direction and component styling live in [`DESIGN.md`](DESIGN.md); consult it for UI work.

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

## Mandatory Technical Standards Summary

- **Package Manager**: Bun only.
- **Routing**: Strict folder-based routing. No flat dot route files.
- **HTTP Client & Server State**: Mandatory `ofetch` via `api` from `#/lib/api-client` (no native `fetch`). Components **MUST NEVER** invoke `api()` directly; all queries must use `queryOptions` in `src/features/<feature>/query-options.ts` (consumed via `loader` & `useSuspenseQuery` / `useQuery`) and mutations must use custom hooks in `src/features/<feature>/hooks.ts`.
- **Database**: Drizzle ORM + Cloudflare D1. [src/db/schema.ts](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts) is the Single Source of Truth. Always update `drizzle/scripts/reset.sql` when modifying schemas.
- **Auth & RBAC**: Better Auth with secure HTTP-only cookies and PBKDF2 Web Crypto password hashing. Roles: `owner`, `admin`, `editor`.
- **Styling**: Use Tailwind CSS v4 variable syntax such as `text-(--brand-ink)`, `bg-(--brand-orange-soft)`, and `border-(--brand-line)`. Follow [`DESIGN.md`](DESIGN.md) for visual direction, color, typography, surfaces, and component styling.
- **Copywriting & Data**: Feature-scoped `copy.ts` for localized UI strings (`en`/`id`) and `data.ts` strictly for static structured datasets. Global layout copy in `src/features/portfolio/copy.ts`.
- **File Naming**: Strict `kebab-case` for all project files and directories.
- **Engineering Workflow**: Use the Matt Pocock engineering skills for planning, ticket breakdown, triage, and implementation. Publish change specs and tickets to GitHub Issues; keep durable feature and system requirements in `docs/features/` and `docs/system/`. See `docs/agents/issue-tracker.md` and `docs/agents/domain.md`.
- **Knowledge Graph & Exploration (Graphify)**: Mandatory first step for exploring codebase, dependencies, or new feature implementations. Always call MCP `query_graph` or CLI `graphify query` before manual grep or file inspection, even if the user did not mention Graphify. Run `graphify update .` after code modifications.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues. Use `gh` for issue operations. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default labels `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo. Read relevant docs in `docs/features/` and `docs/system/`, plus the root `GLOSSARY.md` and relevant ADRs in `docs/adr/` when they exist. See `docs/agents/domain.md`.
