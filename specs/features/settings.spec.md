# Feature Specification: Site Settings & Global Configuration

| Field                | Value                                                                                                          |
| :------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-settings`                                                                                                |
| **Status**           | `Implemented`                                                                                                  |
| **Domain Module**    | [`src/features/settings/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/settings)          |
| **Dashboard Routes** | [`/dashboard/settings`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard/settings.tsx) |
| **RBAC Permissions** | Owner & Admin Only                                                                                             |
| **Last Updated**     | 2026-09-09                                                                                                     |

---

## 1. Overview & Capabilities

The Site Settings feature provides a centralized administrative control center for global portfolio parameters, dynamic SEO metadata, Open Graph assets, and bilingual CV document links.

### Capabilities

- **Four Configuration Domains**: Tabbed interface covering General, Social/OG, SEO, and System settings.
- **Dynamic Bilingual SEO**: Manages English and Indonesian meta titles, descriptions, and page title templates (`%s | Winterest`).
- **Interactive OpenGraph Preview**: Real-time card preview showing how shared links will appear on social networks (X, LinkedIn).
- **Dual-Language CV Link Management**: Stores separate official PDF links for English and Indonesian CVs, with automatic locale-aware fallback via `resolveActiveCv()`.
- **System Maintenance Mode**: Boolean toggle for maintenance state.

---

## 2. Database & Storage Contract

Interacts with the `site_settings` key-value table in Cloudflare D1 ([`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts)):

```ts
export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})
```

- Configuration is stored serialized or keyed into core settings records.

---

## 3. Server & API Contracts

### Endpoints

| Endpoint        | Method | Auth               | Description                                                 |
| :-------------- | :----- | :----------------- | :---------------------------------------------------------- |
| `/api/settings` | `GET`  | Public / Dashboard | Returns parsed `SiteSettingsInput` or `defaultSiteSettings` |
| `/api/settings` | `PUT`  | `admin`, `owner`   | Validates and persists updated site settings                |

### Validation ([`src/features/settings/types.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/settings/types.ts))

- `siteSettingsSchema`: Comprehensive schema validating fields such as `siteName`, `contactEmail`, `defaultLocale`, `heroVisualUrl`, `cvPdfUrlEn`, `cvPdfUrlId`, `metaTitleEn`, `metaTitleId`, `metaDescriptionEn`, `metaDescriptionId`, `ogImageUrl`, `maintenanceMode`.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
src/routes/dashboard/settings.tsx -> SettingsPage
└── SettingsEditorForm
    ├── TabsList ("General", "Social", "SEO", "System")
    ├── Tab: General (Site name, tagline, email, default locale)
    ├── Tab: Social & SEO (Bilingual meta, Open Graph image, title template)
    │   └── SocialCardPreview (Live X/Twitter card preview)
    ├── Tab: Assets & CV (Hero visual, English CV PDF, Indonesian CV PDF)
    └── Tab: System (Maintenance mode switch)
```

### TanStack Query Keys & Hooks

- `settingsQueryKeys.all` (`['site-settings']`)
- Query Option: `settingsQueryOptions.get()`
- Mutation Hook: `useUpdateSettings()` invalidates `settingsQueryKeys.all` on success.

---

## 5. Security & RBAC Rules

- **Role Requirement**: Only `owner` and `admin` roles can access and mutate settings (`requireSettingsUser()`).
- **Sidebar Trimming**: The Settings menu item (`/dashboard/settings`) is completely hidden from `editor` accounts.
- **Route Guard**: Direct access to `/dashboard/settings` by `editor` or unauthorized roles is trapped by `beforeLoad` and redirected safely to `/dashboard`.

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] Updating site settings persists changes across tabs and survives page reloads.
- [ ] Social card preview reflects typed titles and uploaded OG image in real-time.
- [ ] `resolveActiveCv()` returns Indonesian CV on ID locale, falling back to English CV.
- [x] Non-admin accounts are blocked from accessing `/dashboard/settings`.
- [ ] Settings types and resolver pass Vitest suite ([`src/features/settings/__tests__/types.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/settings/__tests__/types.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
