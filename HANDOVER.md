# Winterest Portfolio V2 Handover

Last updated: 2026-08-27

## Recent Major Milestones

### 1. Two-Stage Setup Guard (Migration & Owner Enforcement)

- Implemented automated root layout guard in `src/routes/__root.tsx` and `src/components/system/setup-required.tsx`.
- Stage 1: If database tables are not migrated, web UI locks and displays dedicated **Database Migration Required** screen with `bun run db:migrate:local` / `bun run db:migrate:remote` instructions.
- Stage 2: If database is migrated but no owner exists, web UI locks and displays dedicated **Owner Account Required** screen with `bun run create-owner:local` / `bun run create-owner:remote` instructions.
- Stage 3: When owner is created, web app unlocks full public portfolio & dashboard access.
- Added bilingual copy in `src/features/system/copy.ts`.
- Disabled extraneous queries (e.g. `useSiteSettings`) during locked setup state.

### 2. Interactive CLI Owner Creation Script

- Interactive CLI in `src/db/create-owner-cli.ts` (`bun run create-owner:local` & `bun run create-owner:remote`).
- Prompts for Name, Email, and Password with **masked asterisk input (`*`)**, backspace support, and password confirmation prompt.
- Secure PBKDF2 Web Crypto password hashing compatible with Better Auth.

### 3. Strict 1-Owner RBAC & Clean Auth

- Enforced strict 1 Owner rule across queries and forms.
- Removed deprecated `viewer` role; remaining roles are `owner`, `admin`, `editor`.
- Disabled public registration hook in Better Auth; all additional accounts are created by Owner via dashboard.

### 4. Cloudflare R2 Object Storage & Media Library Integration

- Configured R2 bucket binding `MEDIA_BUCKET` (`winterest-portfolio-media`) in `wrangler.jsonc`.
- Generated Worker types via `bun run cf-typegen` for `env.MEDIA_BUCKET: R2Bucket`.
- Backend endpoints:
  - `POST /api/media`: Uploads `multipart/form-data` to Cloudflare R2, extracts metadata, saves to D1 `media` table.
  - `GET /api/media`: Lists media assets with search filtering.
  - `DELETE /api/media/:id`: Deletes object from R2 and removes record from D1.
  - `GET /api/media/file/*`: Public edge streaming handler with `Cache-Control: public, max-age=31536000, immutable`, `ETag`, and `304 Not Modified` conditional responses.
- Frontend components:
  - `ImageUploader` (`src/components/media/image-uploader.tsx`): Drag-and-drop upload zone, direct file selection, live aspect ratio preview, and manual URL fallback.
  - `MediaPickerDialog` (`src/components/media/media-picker-dialog.tsx`): Modal gallery for picking previously uploaded assets or uploading on-the-fly.
  - `ProjectEditorForm`: Integrated `ImageUploader` for project `coverImage`.
  - `/dashboard/media` (`src/routes/dashboard/media.tsx`): Full Media Library manager with upload dropzone, search filter, size formatting, copy URL button, and deletion modal.

### 5. Database Reset & Migration Cleanliness

- Centralized `drizzle/scripts/reset.sql` dropping all tables cleanly without breaking migration replay.

## Form Architecture & Refactoring State (Standardized)

All forms across the application have been refactored to use:

- `@tanstack/react-form` for state management, field validation, and submit handling.
- `zod` for declarative schema validation.
- `src/components/ui/field.tsx` components (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`).
- Standardized UI controls (`Input`, `Textarea`, `Checkbox`, `Select`, `Button`).

Refactored forms:

- `src/features/technologies/category-editor-form.tsx` (Stack category CRUD + auto-slug)
- `src/features/technologies/technology-editor-form.tsx` (Tech stack CRUD + Checkbox ultimate toggle + categories multi-select)
- `src/features/users/user-editor-form.tsx` (User CRUD + password reset form + role selector)
- `src/routes/contact.tsx` (Public contact form)
- `src/features/dashboard/project-editor-form.tsx` (Project CRUD + multilingual translations en/id + select dropdowns)
- `src/features/settings/settings-editor-form.tsx` (Dashboard Settings form with 4 tabs: General, Social, SEO, System)
- `src/features/account/account-editor-form.tsx` (Account Settings form: Profile update, Password change with current password verification, Sessions info)

## Verification Recently Run

After Branding & Visual settings tab, Hero Visual dynamic media integration, and character-spotlight cleanup, these passed cleanly:

```bash
bunx tsc --noEmit (clean TypeScript check - 0 errors)
bun run lint (eslint - 0 errors)
bun run test (vitest - 18 tests passed)
bun run build (vite client + Cloudflare Worker SSR bundle passed)
```

## Project Identity

This repository (`winterest-portfolio-v2`) is the **MAIN PRIMARY PERSONAL PORTFOLIO PLATFORM** for **Winterest**, designed to replace all previous portfolios.

Direction from `AGENTS.md`:

- Primary personal portfolio platform, NOT a companion/secondary portfolio.
- Cloudflare + Bun inspired aesthetic.
- Orange, white, black/dark gray, warm neutrals.
- Public portfolio + CMS dashboard + auth/RBAC + database-backed content.
- Cloudflare-first TanStack Start app with D1/Drizzle.
- Bilingual UI: `en` and `id`.

Important naming & UI rules:

- Use **Winterest** (or **Winterest Portfolio**) as the public brand.
- **DO NOT** display `"winterest portfolio v2"`, `"Winterest Portfolio v2"`, `"winterest-portfolio-v2"`, or `"winterestingwithyou"` in rendered web code (`.tsx`, `.html`, UI copy, metadata titles, etc.).
- Repo name `winterest-portfolio-v2` is ONLY allowed in `.md` docs, git, and system configs.

## Hard Rules For The Next Agent

Do not run these unless the user explicitly asks in the same turn:

```bash
bun run dev
bun --bun run dev
vite dev
bun run db:migrate
bun run db:push
bun run db:pull
bun run db:studio
```

The user runs dev server and DB migration commands personally.

Allowed when relevant:

```bash
bun run check
bunx tsc --noEmit
bun run lint
bun run test
bun run build
bun run preview
bun run cf-typegen
```

Use Bun by default. Do not switch to npm/pnpm.

Prefer Tailwind for page/component styling. The user explicitly pushed back when auth page styling was added as raw CSS.

## Current Progress Compared To `AGENTS.md`

### Phase 1: Clean Starter And Public Shell

Status: Mostly done.

Implemented:

- Public shell/layout.
- Header/footer.
- Homepage and public pages.
- Cloudflare/Bun-inspired visual tokens and orange brand direction.
- Public nav uses React Bits GooeyNav on desktop.
- Mobile nav is a full-width dropdown under the header with hamburger-to-X animation.
- Brand in nav says `Winterest`.

Needs polish:

- Continue visual QA on mobile widths.
- Keep copy personal to Winterest, not about the project implementation.

### Phase 2: Portfolio Content

Status: Done enough for current iteration.

Implemented:

- Public pages for about, projects, lab, writing, stack, contact, resume.
- Project/detail, lab/detail, writing/detail routes exist.
- Public empty states were rewritten to be user-friendly rather than CMS-instructional.
- Public content copy was revised to use Winterest identity more strongly.

Needs polish:

- More real portfolio content and assets.
- Review page-level copy to remove remaining AGENTS.md-like wording.

### Phase 3: Database And CMS Foundation

Status: Implemented and extended.

Implemented:

- D1/Drizzle setup.
- Migrations moved to `drizzle/migrations`.
- Reset scripts moved to `drizzle/scripts`.
- CMS dashboard shell.
- CRUD foundations for projects, writing, lab, and media.
- Public portfolio data now reads from DB-backed loaders instead of only hardcoded dummy data.
- Seed scripts exist for local/remote.
- Content translations model added for multilingual content.

Important architecture decision:

- Projects, writing, and lab entries are not “one locale at a time”.
- Each content entity should have translations for every supported locale (`en`, `id` now, extensible later).
- Public data should display the translation matching the selected locale.

Needs polish:

- Ensure all CRUD forms make translation completeness obvious.
- Consider validation that required locales are present before publishing.

### Phase 4: Auth And RBAC

Status: Implemented & Refined (Strict 1 Owner, No Viewer, CLI Owner Setup).

Implemented:

- Better Auth integration with Cloudflare-friendly PBKDF2 password hashing.
- Strictly **1 Owner Rule**: Portfolio permits exactly 1 owner account. Dashboard prevents creating a second owner, promoting to owner, demoting the owner, or deleting the owner.
- Role `viewer` removed. Active roles: `owner`, `admin`, `editor`.
- Public register/bootstrap UI and API hooks removed. `/login` is a pure Single Sign-In page.
- Interactive CLI scripts for owner setup:
  - `bun run create-owner:local`
  - `bun run create-owner:remote`
- Dashboard protection and RBAC permissions enforced across API routes and forms.
- Dashboard link appears in navbar only when authenticated.
- Login page has dedicated aesthetic auth layout with language & theme popovers.

### Phase 5: Writing, Lab, Media

Status: Implemented & Integrated with Cloudflare R2.

Implemented:

- Writing CRUD.
- Lab CRUD.
- Media Library and Cloudflare R2 upload/streaming handler fully implemented.
- Reusable `ImageUploader` and `MediaPickerDialog` components integrated into `project-editor-form.tsx`.
- Writing/lab public routes read DB-backed published content.
- Migration `0002_add_writing_lab_media.sql` exists.

Needs polish:

- Markdown rendering/sanitization should be reviewed before allowing rich content publicly.

### Phase 6: Visual Polish And 3D

Status: In progress.

Implemented:

- Hero Visual dynamic media integration in new **Branding & Visual** tab in `/dashboard/settings`.
- Fallback mascot `/assets/characters/winterest.png` when `heroVisualUrl` is not set.
- Removed obsolete `character-spotlight.tsx`, CSS classes, and unused copy.
- Homepage/about visual polish has been improved.
- React Bits GooeyNav integrated and moved under `src/components/react-bits/gooey-nav`.
- GooeyNav colors were tuned to orange/header background and root route clears active highlight.
- Language and theme controls were redesigned as popovers.

Needs polish:

- No heavy 3D should be added until core portfolio/CMS is stable.
- If adding 3D later, follow `AGENTS.md`: lazy load, reduced motion, mobile-safe fallback.

## Recent Navigation/Auth UI State

Files recently touched:

- `src/components/Header.tsx`
- `src/components/LocaleSwitcher.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/ui/popover.tsx`
- `src/components/react-bits/gooey-nav/GooeyNav.tsx`
- `src/components/react-bits/gooey-nav/GooeyNav.css`
- `src/routes/__root.tsx`
- `src/routes/login.tsx`
- `src/styles.css`

Current behavior:

- Desktop nav uses GooeyNav for public nav links.
- Mobile nav uses full-width dropdown under header.
- Language selector is a popover, not segmented radio buttons.
- Theme selector is a popover with Light/Dark/System.
- Login page has its own auth chrome with back link, language selector, and theme selector.
- Public Header/Footer are hidden on `/dashboard` and `/login`.

Styling preference:

- Use Tailwind for new page-level UI whenever feasible.
- Existing global CSS still contains reusable design tokens/classes and React Bits CSS.

## Internationalization State

Project supports:

- `en`
- `id`

Paraglide messages:

- `messages/en.json`
- `messages/id.json`

Some newer page copy is local object-based copy instead of Paraglide messages. This is acceptable as a short-term pattern already used in the codebase, but long-term it may be better to consolidate user-facing UI copy into messages or dedicated copy modules.

Important:

- Public content from CMS must respond to selected locale.
- Dashboard copy has partial bilingual support.
- Login copy currently follows `getLocale()`.

## Database/Migrations Notes

Migrations are in:

```txt
drizzle/migrations
```

Reset scripts are in:

```txt
drizzle/scripts
```

Reason:

- Reset SQL should not live beside migrations, because Wrangler picked it up as a migration file.
- **Rule**: Always keep `drizzle/scripts/reset.sql` updated with `DROP TABLE IF EXISTS` for all tables when altering or creating new tables in `src/db/schema.ts`. Otherwise, `bun run db:fresh:local` / `remote` leaves orphaned tables that cause migration collisions.

Do not run migrations unless user explicitly asks.

## Verification Recently Run

After recent UI/auth changes, these passed:

```bash
bun run check
bunx tsc --noEmit
bun run lint
```

Dev server was not run due project rule.

## Suggested Next Steps

1. Continue copy polish across public pages.
   - Remove wording that explains the project implementation.
   - Keep wording focused on Winterest as a person/creator.

2. Review dashboard copy and UX.
   - Make dashboard fully bilingual.
   - Keep dashboard practical and less decorative than public pages.

3. Improve content translation workflow.
   - Make missing `en`/`id` translations obvious.
   - Consider blocking publish until required locale versions exist.

4. Polish login further if requested.
   - Rename internal labels like `Bootstrap` / `Create owner` if the user wants softer wording.
   - Map auth errors to bilingual friendly messages.

5. Visual QA.
   - Check header controls on narrow mobile widths.
   - Check popover width/position for language and theme.
   - Check login layout on mobile and dark mode.

6. Content/assets.
   - Replace placeholders with real projects, writing, lab entries, and images.
   - Keep assets optimized and Cloudflare-friendly.

## Current User Preferences Learned

- Casual Indonesian tone is preferred.
- User likes direct practical changes.
- User wants Winterest as the main public identity.
- Avoid wording that exposes internal project/CMS implementation to public visitors.
- Avoid overly large hero/title text when it harms balance.
- Use Tailwind for new component/page styling.
- Keep Cloudflare orange theme, not generic slate/dark-blue UI.
