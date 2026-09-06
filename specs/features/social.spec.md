# Feature Specification: Social Links Management

| Field                | Value                                                                                                            |
| :------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Feature ID**       | `feat-social`                                                                                                    |
| **Status**           | `Implemented`                                                                                                    |
| **Domain Module**    | [`src/features/social/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/social)                |
| **Dashboard Routes** | [`/dashboard/social`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard/social/index.tsx) |
| **Public Consumers** | Footer, Contact Page, About Page                                                                                 |
| **RBAC Permissions** | Public (Read Enabled), Editor/Admin/Owner (Full Management)                                                      |
| **Last Updated**     | 2026-09-06                                                                                                       |

---

## 1. Overview & Capabilities

The Social feature manages Winterest's public social media presence and communication channels. It provides a dedicated dashboard manager with platform-specific branding presets, visibility toggles, and sort ordering that seamlessly powers the site's footer, contact page, and social link previews.

### Capabilities

- **Supported Platform Presets**: Native support for 9 platforms: `github`, `linkedin`, `x`, `instagram`, `facebook`, `tiktok`, `youtube`, `discord`, and `telegram`.
- **Branded Metadata Map**: Automatic assignment of official brand icons, badges, colors, and URL placeholders (`platformMetaMap`).
- **Instant Visibility Toggle**: Quickly enable or disable specific social links from public rendering without deleting records.
- **Custom Ordering**: Integer `sortOrder` for arranging the sequence of public social links.
- **One Platform Single-Instance Invariant**: Each platform can only have a single link configured in the database (`uniqueIndex`).

---

## 2. Database & Storage Contract

Interacts with `social_links` in Cloudflare D1 ([`src/db/schema.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/db/schema.ts)):

```ts
export const socialLinks = sqliteTable(
  'social_links',
  {
    id: text('id').primaryKey(),
    platform: text('platform', { enum: socialPlatforms }).notNull(),
    username: text('username'),
    accountName: text('account_name'),
    url: text('url').notNull(),
    isEnabled: integer('is_enabled', { mode: 'boolean' })
      .notNull()
      .default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    uniqueIndex('social_links_platform_unique').on(table.platform),
    index('social_links_is_enabled_idx').on(table.isEnabled),
    index('social_links_sort_order_idx').on(table.sortOrder),
  ],
)
```

---

## 3. Server & API Contracts

### Endpoints

| Endpoint          | Method   | Auth               | Description                                                              |
| :---------------- | :------- | :----------------- | :----------------------------------------------------------------------- |
| `/api/social`     | `GET`    | Public / Dashboard | List social links (public gets `isEnabled: true` ordered by `sortOrder`) |
| `/api/social`     | `POST`   | `editor`+          | Upsert social link for a platform                                        |
| `/api/social/:id` | `PUT`    | `editor`+          | Update URL, username, enabled status, or sort order                      |
| `/api/social/:id` | `DELETE` | `editor`+          | Delete social link                                                       |

### Validation ([`src/features/social/types.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/social/types.ts))

- `socialLinkSchema`:
  - `platform`: One of the 9 allowed platform enums.
  - `url`: Must be a valid URL starting with `http://` or `https://`.
  - `isEnabled`: Boolean.
  - `sortOrder`: Non-negative integer.

---

## 4. UI & State Architecture

### Component Hierarchy

```txt
src/routes/dashboard/social/index.tsx -> SocialPage
└── SocialList (Cards per configured platform, sort handles, toggle switch)
    └── SocialEditorDialog (Modal form with platform selector, URL input, username)
```

### TanStack Query Keys & Hooks

- `socialQueryKeys.all`, `socialQueryKeys.list()`, `socialQueryKeys.detail(id)`
- Mutation Hooks in [`src/features/social/hooks.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/social/hooks.ts):
  - `useCreateSocialLink()`, `useUpdateSocialLink()`, `useDeleteSocialLink()`.

---

## 5. Security & Invariants

1. **Platform Uniqueness**: Database enforces unique platform index. Attempting to add a second GitHub link fails validation or updates the existing entry.
2. **Public Filtering**: Public queries strictly filter on `isEnabled = true` to protect unverified or draft profiles.

---

## 6. Acceptance Criteria & DoD Checklist

- [ ] Adding a social link creates the record and renders the correct brand icon.
- [ ] Toggling `isEnabled` immediately reflects on public footer and contact page.
- [ ] Duplicate platform creation is handled gracefully or prevented by UI dropdown.
- [ ] Social query options and validation pass Vitest suite ([`src/features/social/__tests__/validation.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/social/__tests__/validation.test.ts), [`query-options.test.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/social/__tests__/query-options.test.ts)).
- [ ] TypeScript check passes: `bun run check`.
