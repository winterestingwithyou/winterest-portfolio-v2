---
trigger: always_on
---

# Routing Conventions & Active Page Responsibilities

## TanStack Router File-Based Routing

The project uses TanStack Router file-based routing with strict folder-based organization.

---

## Mandatory Folder-Based Route Structure

- **Strict Folder-Based Routing**: All route files, nested routes, and API endpoints **MUST** use a folder/directory-based structure instead of flat dot-separated file names (flat dot files).
- **No Flat Dot Routes**: Do **NOT** create flat route files with dot notation (e.g., avoid `src/routes/dashboard.projects.new.tsx`, `src/routes/dashboard.settings.tsx`, `src/routes/api.users.reset-password.ts`, `src/routes/projects.index.tsx`).
- **Directory Layouts & Index Files**:
  - Index routes must be inside their feature folder as `index.tsx` / `index.ts` (e.g., `src/routes/projects/index.tsx`, `src/routes/dashboard/users/index.tsx`, `src/routes/api/users/index.ts`).
  - Sub-resources and dynamic parameters must be nested within dedicated folders (e.g., `src/routes/dashboard/users/$id.tsx`, `src/routes/dashboard/users/new.tsx`, `src/routes/dashboard/stack/categories/$id.tsx`, `src/routes/dashboard/stack/technologies/new.tsx`).
  - Layout routes should use directory layouts (e.g., `src/routes/dashboard/route.tsx` or parent `src/routes/dashboard.tsx`).
  - Group nested actions/sub-routes into feature folders (e.g., `src/routes/api/users/reset-password.ts`).

---

## General Routing Rules

- Public routes should be simple, clean, and SEO-friendly.
- Dynamic slugs should be stable, validated, and return 404 for unknown entries.
- Dashboard routes must validate authentication and role authorization server-side before rendering.
- API/server routes must validate input with Zod.
- Do not expose admin-only data in public route loaders.
- Prefer meaningful route names over generic names.

---

## Active Route Structure

```txt
src/routes/
  __root.tsx
  index.tsx            # Homepage: Hero section, tech highlights, featured projects, contact CTA
  about.tsx            # Personal story, developer journey, principles, workflow
  contact.tsx          # Contact form, direct channels, social links
  login.tsx            # Auth login portal for dashboard access
  resume.tsx           # Printable, clean, professional resume
  stack.tsx            # Tech stack catalog, categorized tools, rationale
  projects/
    index.tsx          # Filterable project gallery (by stack/category/status)
    $slug.tsx          # In-depth project details (problem, goal, role, architecture, metrics)
  dashboard/
    route.tsx          # Dashboard shell layout & server auth guard
    index.tsx          # Overview analytics, quick stats, content health
    media.tsx          # Media library & uploaded assets management
    settings.tsx       # Global site settings
    projects/
      index.tsx        # Project list table
      new.tsx          # Create new project
      $id.tsx          # Edit project details
    stack/
      index.tsx        # Tech stack & categories management
      categories/
        new.tsx
        $id.tsx
      technologies/
        new.tsx
        $id.tsx
    users/
      index.tsx        # User management list (owner only)
      new.tsx          # Invite/create user (owner only)
      $id.tsx          # Edit user details / role (owner only)
  api/
    auth/
      $.ts             # Better Auth edge handler
    categories.ts      # Categories API
    contact.ts         # Contact submission handler
    settings.ts        # Site settings API
    stack.ts           # Public tech stack API
    technologies.ts    # Technologies API
    projects/
      index.ts         # Projects collection endpoint
      $id.ts           # Project detail endpoint
    users/
      index.ts         # User management endpoint
      reset-password.ts# Password reset endpoint
```

---

## Public Page Responsibilities

- **`/` (Homepage)**: Strong hero section, short personal intro, featured projects, tech stack highlights, contact CTA, subtle character/mascot visual, Cloudflare+Bun atmosphere.
- **`/about`**: Personal developer journey, academic/project background, areas of interest, timeline, core principles, tools and workflow.
- **`/projects`**: Project index with filters by stack, category, and status; featured projects; project cards linking to GitHub, demo, and details.
- **`/projects/$slug`**: Project detail view covering problem, goal, role, stack, architecture, screenshots, key features, challenges, results, and live links.
- **`/stack`**: Interactive tech stack catalog with favorite tools, categorization, usage notes, and rationale.
- **`/contact`**: Direct communication channels, contact form, GitHub, LinkedIn, social links.
- **`/resume`**: Clean, printable resume format suitable for professional review.

---

## CMS Dashboard Direction

- Clean, usable admin layout with sidebar navigation and topbar user menu.
- Prioritize clear tables, list views, and intuitive create/edit forms over visual gimmicks.
- Distinct draft/published status badges and action toolbars.
