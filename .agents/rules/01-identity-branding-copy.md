---
trigger: always_on
---

# Identity, Branding & Copywriting Rules

## Project Identity

This repository is `winterest-portfolio-v2`, the **primary personal portfolio platform** for **M. Adam Yudistira / Winterest**, built with TanStack Start and deployed to Cloudflare Workers.

### Critical Positioning & Replacement Role

- This project is **NOT** a secondary or companion portfolio. This is the **MAIN PRIMARY PORTFOLIO** designed to completely replace all previous portfolios.
- Treat it as the flagship personal developer platform and CMS dashboard for Winterest.

### Desired Atmosphere & Identity

- **Public Brand / Nickname**: `Winterest`
- **GitHub Username**: `winterestingwithyou`
- **Internal Repo Name**: `winterest-portfolio-v2` (internal repository and documentation name only)
- **Design Theme**: `Cloudflare + Bun`
- **Main Color Palette**: Cloudflare orange, white, black/dark gray, warm neutrals
- **Tone & Persona**: playful, clean, technical, personal, polished, confident

---

## Strict UI Branding & Web Output Rule

- **DO NOT** display `"winterestingwithyou"`, `"winterest portfolio v2"`, `"Winterest Portfolio v2"`, `"winterest-portfolio-v2"`, or internal versioning phrases anywhere in the rendered web UI or web output code (`.tsx`, `.html`, metadata titles, headers, footers, seed data UI copy, etc.).
- Internal repo identifiers like `winterest-portfolio-v2` are **ONLY** allowed in documentation (`.md` files), git history, and system configurations (`package.json`, `wrangler.jsonc`, etc.).
- On the web UI, the site must be presented strictly as **Winterest** (or **Winterest Portfolio**), the official primary portfolio.

---

## Content Writing Style & Tone

Portfolio copy across public pages should sound:

- Confident, friendly, and technical without corporate fluff.
- Aligned with an engineer building practical web systems and developer tools.

### What to Avoid

- Fake exaggerated claims or generic "passionate developer" clichés.
- Overused startup buzzwords and excessive emojis in professional UI copy.
- Inconsistent tone or mixing languages randomly in UI copy.

### Good Direction References

- _"I build practical web systems and developer tools around modern fullstack architecture."_
- _"Cloudflare-powered portfolio and CMS for long-term personal work."_

---

## Feature Copywriting Structure (`copy.ts`)

- **Colocation**: Every feature stores its localized copywriting (`en` and `id`) in `src/features/<feature>/copy.ts` (e.g. `src/features/home/copy.ts`, `src/features/projects/copy.ts`).
- **Global Layout Copy**: Shared navigation and footer copy belongs in `src/features/portfolio/copy.ts`.
- **Static Datasets**: Static domain collections / datasets belong in `src/features/<feature>/data.ts` (e.g. `siteProfile` in `src/features/portfolio/data.ts`).
- **No Monoliths**: Avoid monolithic data files storing copy for unrelated pages.

---

## SEO & Metadata Expectations

Each public page should have:

- Meaningful, descriptive `<title>` (e.g. "Winterest — Projects", "Winterest — About").
- Compelling meta description summarizing page content accurately.
- Semantic single `<h1>` hierarchy per page.
- Canonical URL where appropriate.
- Open Graph and Twitter card metadata for social sharing.
- Clean URL slugs.
- Descriptive `alt` attributes for all meaningful imagery.
- Avoid generic template starter metadata (such as "TanStack Start Starter").

---

## Sitemap & Search Engine Crawling Guidelines

The application generates a dynamic `sitemap.xml` on-demand via Cloudflare Workers (`src/routes/sitemap[.]xml.ts`) and enforces strict crawl rules in `public/robots.txt`.

### 1. Adding New Public Routes
- **Single Source of Truth**: The catalog of static public routes is defined in `STATIC_PUBLIC_ROUTES` inside `src/features/portfolio/sitemap.ts`.
- **Mandatory Registration**: When introducing a new static public route (e.g. `/blog`, `/experience`), you **MUST** register its path in `STATIC_PUBLIC_ROUTES` with appropriate `priority` (`0.1` to `1.0`) and `changefreq` (`weekly` / `monthly`).
- **Update Tests**: Update `src/features/portfolio/sitemap.test.ts` to assert inclusion of the new route.

### 2. Adding New Dynamic Content Entities (CMS / D1)
- When introducing new publicly accessible dynamic content collections from D1 (e.g. articles, case studies), integrate their public query and slugs into `generateSitemapXml()` with valid `lastmod` dates derived from `updatedAt` or `publishedAt`.

### 3. Strict Exclusion of Private & Auth Routes
- **Forbidden from Sitemap**: Never include `/login`, `/dashboard/*`, or `/api/*` in `sitemap.xml`.
- **Robots.txt Protection**: Keep private and sensitive routes explicitly disallowed in `public/robots.txt`:
  ```txt
  Allow: /
  Disallow: /dashboard/
  Disallow: /login
  Disallow: /api/
  ```
- **HTML Head Discovery**: Always preserve `<link rel="sitemap" type="application/xml" href="/sitemap.xml" />` in `src/routes/__root.tsx`.

