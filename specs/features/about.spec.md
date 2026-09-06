# Feature Specification: About & Personal Developer Journey

| Field             | Value                                                                                           |
| :---------------- | :---------------------------------------------------------------------------------------------- |
| **Feature ID**    | `feat-about`                                                                                    |
| **Status**        | `Implemented`                                                                                   |
| **Domain Module** | [`src/features/about/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/about) |
| **Public Routes** | [`/about`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/about.tsx)            |
| **RBAC Access**   | Public                                                                                          |
| **Last Updated**  | 2026-09-06                                                                                      |

---

## 1. Overview & Capabilities

The About feature communicates Winterest's (M. Adam Yudistira) background, engineering philosophy, developmental timeline, and personality. It moves beyond a dry CV to present a human, technical narrative.

### Capabilities

- **Developer Mindset & Identity**: Introduces personality markers (INTJ/4w5, Computer Science graduate from Universitas Sriwijaya) and core software engineering values.
- **Interactive Chronological Journey**: Visual timeline detailing milestones across high school, university, solo engineering projects, and fullstack specialization.
- **Workflow & Architectural Principles**: Highlights Winterest's engineering approach: spec-driven planning, trade-off evaluation, and edge-first deployment.
- **Experience & Education Integration**: Connects with `@content-collections` (`content/jobs/` and `content/education/`) to render verified career and academic history.
- **Personal Culture & Hobbies**: Curated personal interest modules (K-Pop music favorites with Spotify links, gaming inspirations) adding authentic personality.

---

## 2. Content & Data Integration

- **Content Collections**: Reads structured markdown frontmatter from:
  - `content/jobs/` (work experience, roles, responsibilities).
  - `content/education/` (degrees, academic institutions, honors).
- **Localized Copy Dictionary ([`src/features/about/copy.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/about/copy.ts))**:
  - Full English and Indonesian sets for hero narrative, journey timeline, core principles, and workflow steps.

---

## 3. UI & Component Architecture

### Component Hierarchy

```txt
src/routes/about.tsx (Thin Route Gateway)
└── src/features/about/pages/about-page.tsx
    ├── AboutHero (Identity badges, developer mindset quote)
    ├── DrivesSection (Core engineering values & principles)
    ├── JourneySection (Timeline of milestone years & accomplishments)
    ├── WorkflowSection (4-step engineering process cards)
    ├── ExperienceSection (Jobs & education timeline cards)
    └── FavoritesSection (K-Pop music cards & cultural influences)
```

---

## 4. Acceptance Criteria & DoD Checklist

- [ ] `/about` renders clean, accessible typography and responsive timeline on mobile and desktop.
- [ ] Timeline steps render with active locale translations.
- [ ] Content collections for jobs and education load without hydration errors.
- [ ] External Spotify and documentation links open securely with `rel="noopener noreferrer"`.
- [ ] TypeScript check passes: `bun run check`.
