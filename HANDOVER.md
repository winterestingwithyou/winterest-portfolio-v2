# Winterest Portfolio V2 Handover

Last updated: 2026-06-13

## Project Identity

This repo is `winterest-portfolio-v2`, a personal portfolio platform for **Winterest**.

Direction from `AGENTS.md`:

- Personal portfolio, not a generic resume template.
- Cloudflare + Bun inspired aesthetic.
- Orange, white, black/dark gray, warm neutrals.
- Public portfolio + CMS dashboard + auth/RBAC + database-backed content.
- Cloudflare-first TanStack Start app with D1/Drizzle.
- Bilingual UI: `en` and `id`.

Important naming preference from the user:

- Use **Winterest** as the public nickname/brand.
- Do not use `winterestingwithyou` as public brand copy unless specifically needed for GitHub/reference context.

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

Status: Implemented baseline.

Implemented:

- Better Auth integration.
- Cloudflare-friendly PBKDF2 password hashing fix was made.
- Dashboard protection exists.
- Owner/bootstrap flow exists.
- Dashboard link appears in navbar only if logged in.
- Logout exists in dashboard shell.
- Login page was redesigned as its own auth layout, not using public header/footer.

Recent login page work:

- `src/routes/__root.tsx` hides public Header/Footer for `/login`.
- `src/routes/login.tsx` has a custom auth layout.
- Login page copy is bilingual via local `authCopy`.
- Login page uses Tailwind directly, not custom CSS.
- Copy was adjusted to avoid exposing internal technical wording like CMS/bootstrap/drafts in the hero area.
- Login title size was reduced.

Needs polish:

- The mode button still says `Bootstrap` / submit says `Create owner` for signup mode. This may be okay because signup is internal/manual, but if the user wants zero technical wording, rename it more softly.
- Better Auth errors are still shown directly if returned by API. Could map common errors to friendlier bilingual messages.

### Phase 5: Writing, Lab, Media

Status: Implemented baseline.

Implemented:

- Writing CRUD.
- Lab CRUD.
- Media metadata route/page.
- Writing/lab public routes read DB-backed published content.
- Migration `0002_add_writing_lab_media.sql` exists.

Needs polish:

- Media upload/R2 is not fully implemented yet; currently metadata/URL-oriented.
- Markdown rendering/sanitization should be reviewed before allowing rich content publicly.

### Phase 6: Visual Polish And 3D

Status: In progress.

Implemented:

- Static visual/character work exists, including `CharacterSpotlight`.
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
