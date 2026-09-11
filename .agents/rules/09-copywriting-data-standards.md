---
trigger: always_on
---

# Feature Copywriting, Localization & Data Standards

## Separation of Concerns: `copy.ts` vs `data.ts`

To ensure clean encapsulation, high modularity, and readiness for future CMS capabilities:

---

## 1. `copy.ts` (UI Copy & Localized Strings)

- Every feature that has user-facing text, section headings, badges, form labels, tooltips, or action messages **MUST** place its localized strings directly in `src/features/<feature>/copy.ts`.
- Format copy as a typed object supporting `en` and `id` translations, and export a helper `get<Feature>Copy()` using Paraglide's `getLocale()`:

  ```ts
  import { getLocale } from '#/paraglide/runtime'

  export const homeCopy = {
    en: {
      hero: { eyebrow: '...', title: '...' },
    },
    id: {
      hero: { eyebrow: '...', title: '...' },
    },
  } as const

  export function getHomeCopy() {
    const locale = getLocale() === 'id' ? 'id' : 'en'
    return homeCopy[locale]
  }
  ```

- **Direct Placement**: Always place `copy.ts` directly in the root of the feature directory (`src/features/<feature>/copy.ts`). Do NOT create unnecessary nested directories (e.g., avoid `src/features/auth/content/auth-copy.ts`).

---

## 2. `data.ts` (Static Structured Datasets)

- Reserved strictly for static structured domain datasets, collections, or global metadata (e.g. `siteProfile` in `src/features/portfolio/data.ts`, `journeySteps` / `kpopFavorites` in `src/features/about/data.ts`).
- Do NOT dump general page UI copywriting into `data.ts`.

---

## 3. Global & Layout Copy

- Global layout copywriting that spans multiple routes (Navbar, Footer, 404 Not Found, Resume overview) **MUST** be stored in `src/features/portfolio/copy.ts`.
- Global identity and base developer profile metadata (`siteProfile`) remains in `src/features/portfolio/data.ts`.

---

## 4. CMS Fallback & Evolution Contract

- For pages intended to be CMS-driven in the future (such as Home and About), `copy.ts` serves as the **contract and default fallback value** (`cmsData?.title ?? defaultCopy.title`).
- This guarantees the application never breaks if the database is empty or unmigrated, and keeps static UI labels (e.g. button texts, placeholders) cleanly separated from dynamic CMS content.

---

## 5. Dashboard Copywriting Scope & Feature Colocation

To prevent monolithic copy files:

- `src/features/dashboard/copy.ts` is reserved strictly for dashboard shell framing (`shell`: navigation, header, breadcrumbs, logout), overview analytics (`overview`: metrics, activity, charts), and shared common primitives (`common`: unsaved changes dialog, common filter labels, confirmation dialogs).
- Domain-specific dashboard copy (Projects, Stack/Technologies, Media, Settings, Account, Users, Social) **MUST** be colocated in their respective feature directory (`src/features/<feature>/copy.ts`).
- For hybrid features (e.g. `projects` and `technologies`), nest dashboard strings under a typed `dashboard: { ... }` namespace alongside public strings (`meta`, `list`, `detail`).
- For pure dashboard features (`settings`, `account`, `users`, `media`, `social`), the feature's `copy.ts` directly defines its tabs, forms, tables, and dialog copy.
