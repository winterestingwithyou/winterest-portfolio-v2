# System Specification: Bilingual Copywriting & i18n Architecture

| Field                  | Value                                                                                                                                                                                                                                                                                                                                         |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Specification ID**   | `sys-i18n`                                                                                                                                                                                                                                                                                                                                    |
| **Status**             | `Implemented`                                                                                                                                                                                                                                                                                                                                 |
| **Scope**              | Cross-Cutting System Localization & Copywriting Standard                                                                                                                                                                                                                                                                                      |
| **Primary Code Paths** | [`src/paraglide/`](file:///d:/winterest-project/winterest-portfolio-v2/src/paraglide), [`src/features/portfolio/copy.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/portfolio/copy.ts), [`src/components/locale-switcher.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/components/locale-switcher.tsx) |
| **Supported Locales**  | `en` (English - Primary), `id` (Indonesian - Secondary)                                                                                                                                                                                                                                                                                       |
| **Last Updated**       | 2026-09-06                                                                                                                                                                                                                                                                                                                                    |

---

## 1. Overview & Capabilities

The internationalization (i18n) and copywriting subsystem ensures full bilingual support across **Winterest**. It pairs **Paraglide JS** compilation with strict feature-scoped copywriting contracts.

### Key Capabilities

- **Lightweight Runtime Localization**: Powered by `@inlang/paraglide-js` without heavy client-side bundle overhead.
- **Strict Separation of Concerns**:
  - `copy.ts`: Reserved exclusively for localized UI strings, form labels, headings, error messages, and button text.
  - `data.ts`: Reserved strictly for structured domain collections (e.g. `siteProfile`, `journeySteps`).
- **Feature-Scoped Colocation**: Each feature maintains its own `copy.ts` (e.g. `src/features/projects/copy.ts`). Monolithic, all-in-one copywriting files are forbidden.
- **Global Layout Copy**: Multi-page shared strings (Navbar, Footer, 404 page, Resume overview) reside in [`src/features/portfolio/copy.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/portfolio/copy.ts).
- **CMS Fallback Contract**: Serves as the immutable default fallback value for future CMS entities (`cmsData?.title ?? defaultCopy.title`).

---

## 2. Technical Standard & Type Pattern

Every domain feature exports a typed copy dictionary and a standard getter function:

```ts
import { getLocale } from '#/paraglide/runtime'

export const featureCopy = {
  en: {
    hero: { eyebrow: '...', title: '...' },
    actions: { save: 'Save', cancel: 'Cancel' },
  },
  id: {
    hero: { eyebrow: '...', title: '...' },
    actions: { save: 'Simpan', cancel: 'Batal' },
  },
} as const

export function getFeatureCopy() {
  const locale = getLocale() === 'id' ? 'id' : 'en'
  return featureCopy[locale]
}
```

---

## 3. UI Locale Switcher ([`src/components/locale-switcher.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/components/locale-switcher.tsx))

- Accessible UI dropdown toggle rendered in header navigation.
- Switches between English (`EN`) and Indonesian (`ID`).
- Persists user language preference through cookies/URL parameters.
- Triggers instant client-side reactivity across components calling `get*Copy()`.

---

## 4. CMS Fallback & Evolution Contract

When dynamic content from Cloudflare D1 (e.g., project titles or bio sections) is edited via the CMS:

1. If the database record contains a translated string for the active locale, render the database string.
2. If the field is null, empty, or unmigrated, fallback cleanly to `copy.ts`:
   ```tsx
   const copy = getHomeCopy()
   const title = cmsRecord?.title || copy.hero.title
   ```
3. **Guaranteed Uptime**: Prevents UI breakage or empty screens if the database is unpopulated or in draft status.

---

## 5. Acceptance Criteria & DoD Checklist

- [ ] All public UI labels, buttons, and error messages have corresponding `en` and `id` translations.
- [ ] Switching locale in the UI immediately re-renders page copy in the chosen language.
- [ ] No hardcoded Indonesian text appears when viewing the English locale, and vice versa.
- [ ] Static datasets in `data.ts` contain no UI button labels or layout text.
- [ ] TypeScript check passes: `bun run check`.
