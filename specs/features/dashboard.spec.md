# Feature Specification: CMS Dashboard & Analytics Overview

| Field                | Value                                                                                                         |
| :------------------- | :------------------------------------------------------------------------------------------------------------ |
| **Feature ID**       | `feat-dashboard`                                                                                              |
| **Status**           | `Implemented`                                                                                                 |
| **Domain Module**    | [`src/features/dashboard/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/dashboard)       |
| **Dashboard Routes** | [`/dashboard`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard/index.tsx) (Overview) |
| **Layout Shell**     | [`src/routes/dashboard.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/dashboard.tsx)    |
| **RBAC Permissions** | Authenticated (`editor`, `admin`, `owner`)                                                                    |
| **Last Updated**     | 2026-09-09                                                                                                    |

---

## 1. Overview & Capabilities

The Dashboard feature serves as the central administrative workspace for managing Winterest's portfolio platform. It provides an overview analytics dashboard, role-aware sidebar navigation, and quick access to content editing workflows.

### Capabilities

- **Role-Gated Shell Layout**: Persistent sidebar and topbar header wrapping all `/dashboard/*` sub-routes, automatically filtering navigation items by active user role.
- **Content Health Metrics**: Overview cards displaying total projects, featured showcases, draft counts, and published entries.
- **Recent Content Feed**: Quick list of the 5 most recently updated projects with direct links to edit screens.
- **Topbar Control Center**: Integrated breadcrumb trail, Paraglide bilingual switcher, theme toggle, and authenticated user dropdown.

---

## 2. Server Contract & Summary Loader

### Server Function: `getDashboardSummary` ([`src/features/dashboard/loaders.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/dashboard/loaders.ts))

Executed during `/dashboard` route evaluation:

```ts
export type DashboardSummary = {
  totalItems: number
  featuredCount: number
  draftCount: number
  publishedCount: number
  contentMix: Array<{ key: 'projects'; value: number }>
  recentProjects: DashboardSummaryItem[]
}
```

- Authenticates session via `getDashboardUserFromRequest(getRequest())`.
- Aggregates project statistics directly from D1.
- Catches unmigrated table states cleanly and returns `emptySummary`.

---

## 3. UI & Layout Architecture

### Component Hierarchy

```txt
src/routes/dashboard.tsx (Dashboard Layout Shell)
├── DashboardSidebar (Role-aware menu: Overview, Projects, Stack, Media, Social, Settings, Users)
└── SidebarInset
    ├── DashboardHeader (Breadcrumbs, LocaleSwitcher, ThemeToggle, UserMenu)
    └── Outlet -> src/routes/dashboard/index.tsx -> DashboardPage
        ├── MetricsGrid (4 Summary Cards: Total, Published, Draft, Featured)
        ├── QuickActionToolbar (New Project, Upload Media, Edit Stack)
        └── RecentProjectsList (Title, status badge, relative updated time)
```

---

## 4. Security & RBAC Rules

1. **Dashboard Entry Gate**: Visiting `/dashboard/*` without an active session immediately redirects to `/login?redirectTo=...`.
2. **Sidebar Menu Trimming**:
   - `editor`: Access to Overview, Projects, Stack, Media, Social, Account.
   - `admin`: Above + Settings.
   - `owner`: Above + User Management (`/dashboard/users`).
3. **Route Guard**: Direct access to `/dashboard/users/*` by non-owner roles or `/dashboard/settings` by non-admin/owner roles is trapped in `beforeLoad` and redirected safely to `/dashboard`.

---

## 5. Acceptance Criteria & DoD Checklist

- [x] Unauthenticated requests to `/dashboard` are redirected to `/login`.
- [x] Summary cards calculate accurate project counts (total, published, draft, featured).
- [x] Sidebar navigation adapts dynamically based on whether user is editor, admin, or owner.
- [x] Clicking a recent project opens its corresponding edit form.
- [x] TypeScript check passes: `bun run check`.
