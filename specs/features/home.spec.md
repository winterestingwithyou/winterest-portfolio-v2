# Feature Specification: Home Landing Page

| Field             | Value                                                                                         |
| :---------------- | :-------------------------------------------------------------------------------------------- |
| **Feature ID**    | `feat-home`                                                                                   |
| **Status**        | `Implemented`                                                                                 |
| **Domain Module** | [`src/features/home/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/home) |
| **Public Routes** | [`/` (Homepage)](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/index.tsx)    |
| **RBAC Access**   | Public                                                                                        |
| **Last Updated**  | 2026-09-06                                                                                    |

---

## 1. Overview & Capabilities

The Home feature serves as Winterest's flagship personal portal. Built with a technical, high-polish Cloudflare + Bun aesthetic, it delivers a strong hero statement, featured case studies, focus area cards, an infinite tech stack marquee, and a clear contact conversion CTA.

### Capabilities

- **Branded Hero Showcase**: Dynamic greeting, technical profile overview, CV download button linking to localized PDF, and quick navigation anchors.
- **Featured Projects Spotlight**: Automatically pulls and renders projects flagged with `featured = true` and `status = 'published'`, with translated titles, summaries, and tech tags.
- **Engineering Enthusiasms Grid**: 6 modular cards highlighting core engineering disciplines (Software Engineer, Frontend, Backend, Fullstack, DevOps, Cloud).
- **Interactive Tech Stack Marquee**: Continuous dual-direction marquee displaying favorite flagship technologies (`isUltimate = true`) with SimpleIcons/Lucide integration.
- **Contact CTA Banner**: High-contrast footer conversion section driving visitor engagement to `/contact`.

---

## 2. Database & Data Integration

Consumes data from multiple D1 domain collections via server loaders:

- `projects`: Filters for `featured = true`, `status = 'published'`, and `visibility = 'public'`.
- `technologies`: Filters for `isUltimate = true` for the marquee section.
- `site_settings`: Reads `cvEnUrl` and `cvIdUrl` via `resolveActiveCv(locale, settings)`.

---

## 3. UI & Component Architecture

### Component Hierarchy

```txt
src/routes/index.tsx (Thin Route Gateway)
└── src/features/home/pages/home-page.tsx
    ├── HomeHero (Personal introduction, CV button, social links)
    ├── FeaturedProjectsSection (ProjectCard grid, case study links)
    ├── EnthusiasmsSection (6 engineering discipline cards)
    ├── TechMarqueeSection (Infinite scrolling marquee of ultimate tools)
    └── ContactCtaSection (Closing conversion banner & button)
```

### Motion & Micro-Animations

- Framer Motion / Motion primitives defined in [`src/lib/motion.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/lib/motion.ts):
  - `fadeUp`, `staggerContainer`, `scaleIn`.
  - Respects `prefers-reduced-motion` settings.

### Copywriting ([`src/features/home/copy.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/home/copy.ts))

- Complete bilingual structure (`hero`, `featured`, `enthusiasms`, `techMarquee`, `cta`).
- Accessed via helper `getHomeCopy()`.

---

## 4. Acceptance Criteria & DoD Checklist

- [ ] Homepage loads with high visual fidelity, correct fonts, and responsive layout across 360px-1440px.
- [ ] Featured projects section gracefully handles empty states when 0 projects are featured.
- [ ] Tech marquee scrolls smoothly without layout shifts or horizontal scrollbar leaks.
- [ ] CV download button dynamically points to English or Indonesian CV based on active locale.
- [ ] Switching locale via header switches all section headings and descriptions immediately.
- [ ] TypeScript check passes: `bun run check`.
