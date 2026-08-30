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
