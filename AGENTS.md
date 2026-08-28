# AGENTS.md

## Project Identity

This repository is `winterest-portfolio-v2`, the **primary personal portfolio platform** for **M. Adam Yudistira / Winterest**, built with TanStack Start and deployed to Cloudflare Workers.

### Critical Positioning & Replacement Role

- This project is **NOT** a secondary or companion portfolio. This is the **MAIN PRIMARY PORTFOLIO** designed to completely replace all previous portfolios.
- Treat it as the flagship personal developer platform and CMS dashboard for Winterest.

### Desired Atmosphere & Identity

- **Public Brand / Nickname**: `Winterest`
- **GitHub Username**: `winterestingwithyou`
- **Internal Repo Name**: `winterest-portfolio-v2` (internal repository name only)
- **Design Theme**: `Cloudflare + Bun`
- **Main Color Direction**: orange, white, black/dark gray, warm neutrals
- **Tone**: playful, clean, technical, personal, polished

---

## Strict UI Branding & Web Output Rule

- **DO NOT** display `"winterestingwithyou"`, `"winterest portfolio v2"`, `"Winterest Portfolio v2"`, `"winterest-portfolio-v2"`, or internal versioning phrases anywhere in the rendered web UI or web output code (`.tsx`, `.html`, metadata titles, headers, footers, seed data UI copy, etc.).
- Internal repo identifiers like `winterest-portfolio-v2` are ONLY allowed in documentation (`.md` files), git history, and system configurations (`package.json`, `wrangler.jsonc`, etc.).
- On the web UI, the site must be presented strictly as **Winterest** (or **Winterest Portfolio**), the official primary portfolio.

---

## Core Rules Index (`.agents/rules/`)

Guidelines are modularly organized in [`.agents/rules/`](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules):

1. **[01-identity-branding-copy.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/01-identity-branding-copy.md)**: Identity, strict UI branding, copywriting tone, and SEO standards.
2. **[02-agent-commands-behavior.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/02-agent-commands-behavior.md)**: Bun commands, forbidden agent commands, and Definition of Done.
3. **[03-routing-conventions-pages.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/03-routing-conventions-pages.md)**: Mandatory folder-based routing, active route map, and page responsibilities.
4. **[04-server-api-ofetch.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/04-server-api-ofetch.md)**: Server validation, mandatory `ofetch` standard, and form handling.
5. **[05-database-cloudflare.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/05-database-cloudflare.md)**: Cloudflare D1/Workers edge runtime, `schema.ts` as Single Source of Truth, and mandatory `reset.sql` maintenance.
6. **[06-auth-security-rbac.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/06-auth-security-rbac.md)**: Better Auth cookie sessions, PBKDF2 edge password hashing, RBAC (`owner`, `admin`, `editor`), and secrets security.
7. **[07-design-system-ui-3d.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/07-design-system-ui-3d.md)**: Design tokens, Tailwind CSS v4 variable syntax, animations, and 3D progressive enhancement.
8. **[08-architecture-code-standards.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/08-architecture-code-standards.md)**: Feature-based kebab-case architecture, code style, state management, testing, and things to avoid.
9. **[graphify.md](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/graphify.md)**: Knowledge graph query and update rules.

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
bun run db:studio
```

---

## Mandatory Technical Standards Summary

- **Package Manager**: Bun only.
- **Routing**: Strict folder-based routing. No flat dot route files.
- **HTTP Client**: Mandatory `ofetch` via `api` from `#/lib/api-client` (no native `fetch`).
- **Database**: Drizzle ORM + Cloudflare D1. [src/db/schema.ts](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts) is the Single Source of Truth. Always update `drizzle/scripts/reset.sql` when modifying schemas.
- **Auth & RBAC**: Better Auth with secure HTTP-only cookies and PBKDF2 Web Crypto password hashing. Roles: `owner`, `admin`, `editor`.
- **CSS Syntax**: Tailwind CSS v4 variable syntax: `text-(--brand-ink)`, `bg-(--brand-orange-soft)`, `border-(--brand-line)`.
- **File Naming**: Strict `kebab-case` for all project files and directories.
