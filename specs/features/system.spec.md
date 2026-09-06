# Feature Specification: System Status & Setup UI

| Field                   | Value                                                                                                                                                                                                                                            |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Feature ID**          | `feat-system`                                                                                                                                                                                                                                    |
| **Status**              | `Implemented`                                                                                                                                                                                                                                    |
| **Domain Module**       | [`src/features/system/`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/system)                                                                                                                                                |
| **Root Integration**    | [`src/routes/__root.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/routes/__root.tsx), [`src/components/system/setup-required.tsx`](file:///d:/winterest-project/winterest-portfolio-v2/src/components/system/setup-required.tsx) |
| **System Architecture** | [`specs/system/setup-guard.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/system/setup-guard.spec.md)                                                                                                                       |
| **RBAC Access**         | Public / Initial Provisioning                                                                                                                                                                                                                    |
| **Last Updated**        | 2026-09-06                                                                                                                                                                                                                                       |

---

## 1. Overview & Capabilities

The System feature implements the front-end user experience and server evaluation for the Two-Stage Setup Guard. When the database is unmigrated or lacks an initial Owner, this feature takes over the entire viewport to deliver interactive terminal commands and status polling.

### Capabilities

- **Bilingual Step-by-Step Instructions**: Localized guidance in English and Indonesian guiding the developer through D1 migration and Owner creation.
- **Interactive Terminal Snippets**: Tabbed terminal cards displaying exact Bun commands for Local D1 (`bun run db:migrate:local`, `bun run create-owner:local`) and Remote D1 (`bun run db:migrate:remote`, `bun run create-owner:remote`).
- **One-Click Clipboard Copying**: Copies the active command directly to the clipboard with animated feedback.
- **Live State Reload**: Interactive refresh button triggering page reload to re-query `getSystemStatus()` and unlock the app upon successful terminal provisioning.

---

## 2. Server & Status Contract

### Server Function: `getSystemStatus` ([`src/features/system/server-functions.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/system/server-functions.ts))

Returns status object evaluated at root loader:

- `isMigrated`: Boolean indicating if SQLite tables exist in D1.
- `hasOwner`: Boolean indicating if at least one user with `role = 'owner'` exists.
- `error`: Optional error string when database query fails.

---

## 3. UI & Component Architecture

### Component Hierarchy

```txt
src/routes/__root.tsx (Root Layout Guard)
└── SetupRequiredScreen (when isMigrated === false || hasOwner === false)
    ├── BrandHeader (Winterest logo, LocaleSwitcher, ThemeToggle)
    ├── StatusBadge (Migration Required / Setup Required)
    ├── CommandCard (Tabs: "Local D1 SQLite" / "Remote Cloudflare D1")
    │   ├── TerminalSnippet
    │   └── CopyButton (Clipboard integration)
    ├── StepInstructions (3-step actionable list)
    └── ActionFooter (RefreshButton, DB checking spinner)
```

### Localized Copy Tokens ([`src/features/system/copy.ts`](file:///d:/winterest-project/winterest-portfolio-v2/src/features/system/copy.ts))

- Evaluated via `getSystemSetupCopy('migration' | 'owner')`:
  - `migration`: titles, commands, and steps for applying D1 schema migrations.
  - `owner`: titles, commands, and steps for running interactive CLI owner bootstrap.

---

## 4. Acceptance Criteria & DoD Checklist

- [ ] Setup screen renders responsive technical layout in both light and dark themes.
- [ ] Tab switching toggles between `:local` and `:remote` command variations.
- [ ] Copy button copies command and shows "Copied!" feedback for 2 seconds.
- [ ] Refresh button reloads the page to re-verify status with Cloudflare D1.
- [ ] Switching language via header updates all setup text without losing tab state.
- [ ] TypeScript check passes: `bun run check`.
