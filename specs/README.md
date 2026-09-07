# Specifications Index & Living Documentation

Welcome to the **Winterest** specifications repository. This directory serves as the Single Source of Truth for system architecture, feature contracts, database schemas, and API behaviors, following the principles established in [`.agents/rules/11-spec-driven-development.md`](file:///d:/winterest-project/winterest-portfolio-v2/.agents/rules/11-spec-driven-development.md).

---

## Directory Organization

```txt
specs/
├── README.md                  # This index & SDD workflow catalog
├── system/                    # Cross-cutting architecture and foundational systems
│   ├── auth-rbac.spec.md      # Better Auth, PBKDF2 edge hashing, cookie sessions, 3 roles
│   ├── media-storage.spec.md  # Cloudflare R2 bucket, D1 metadata, public streaming endpoint
│   ├── setup-guard.spec.md    # Two-stage migration & owner bootstrap root guard
│   └── i18n-copy.spec.md      # Bilingual copy contract (en/id), Paraglide, CMS fallback
├── features/                  # 1-to-1 mirror of src/features/ domain modules
│   ├── auth.spec.md           # Login portal, Turnstile, TanStack Form, redirects
│   ├── projects.spec.md       # Project gallery, slug detail, dashboard CRUD, translations
│   ├── technologies.spec.md   # Tech stack, categories, isUltimate marquee
│   ├── media.spec.md          # Media library, image uploader, asset picker modal
│   ├── contact.spec.md        # Public contact form, Turnstile, Resend email dispatch
│   ├── users.spec.md          # User management, role elevation, owner-only CLI/dashboard
│   ├── settings.spec.md       # Site settings (General, Social, SEO, System)
│   ├── account.spec.md        # Profile settings, password change with current password check
│   ├── social.spec.md         # Social links management, brand metadata, visibility toggle
│   ├── home.spec.md           # Landing page sections, hero, featured projects, tech marquee
│   ├── about.spec.md          # Journey, content-collections (jobs, education), timeline
│   ├── dashboard.spec.md      # CMS dashboard shell, analytics summary cards, recent feed
│   ├── portfolio.spec.md      # Global layout shell, resume, dynamic sitemap XML
│   └── system.spec.md         # System setup status query, setup-required UI screens
└── changes/                   # Proposed specifications & RFCs before implementation
    └── 2026-09-search-filter-pagination.md # Search, Filter & Pagination across public & dashboard (Implemented)
```

---

## Specification Status Matrix

| ID                  | Domain / Feature                  | Type    | Status        | Target Code                                       | Primary Spec Document                                                                                                            |
| :------------------ | :-------------------------------- | :------ | :------------ | :------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| `sys-auth-rbac`     | Auth & RBAC Foundation            | System  | `Implemented` | `src/lib/auth/`, `src/features/auth/`             | [`specs/system/auth-rbac.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/system/auth-rbac.spec.md)           |
| `sys-media-r2`      | R2 Media & Streaming              | System  | `Implemented` | `src/routes/api/media/`, `wrangler.jsonc`         | [`specs/system/media-storage.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/system/media-storage.spec.md)   |
| `sys-setup-guard`   | Two-Stage Setup Guard             | System  | `Implemented` | `src/components/system/setup-required.tsx`        | [`specs/system/setup-guard.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/system/setup-guard.spec.md)       |
| `sys-i18n`          | Bilingual Copy Architecture       | System  | `Implemented` | `src/paraglide/`, `src/features/*/copy.ts`        | [`specs/system/i18n-copy.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/system/i18n-copy.spec.md)           |
| `feat-auth`         | Auth Portal & Login               | Feature | `Implemented` | `src/features/auth/`, `src/routes/login.tsx`      | [`specs/features/auth.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/auth.spec.md)                 |
| `feat-projects`     | Projects & Case Studies           | Feature | `Implemented` | `src/features/projects/`                          | [`specs/features/projects.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/projects.spec.md)         |
| `feat-technologies` | Tech Stack & Marquee              | Feature | `Implemented` | `src/features/technologies/`                      | [`specs/features/technologies.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/technologies.spec.md) |
| `feat-media`        | Media Library & Picker            | Feature | `Implemented` | `src/features/media/`                             | [`specs/features/media.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/media.spec.md)               |
| `feat-contact`      | Contact & Turnstile               | Feature | `Implemented` | `src/features/contact/`, `src/routes/contact.tsx` | [`specs/features/contact.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/contact.spec.md)           |
| `feat-users`        | User Management (Owner)           | Feature | `Implemented` | `src/features/users/`                             | [`specs/features/users.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/users.spec.md)               |
| `feat-settings`     | Site Settings                     | Feature | `Implemented` | `src/features/settings/`                          | [`specs/features/settings.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/settings.spec.md)         |
| `feat-account`      | Account & Password                | Feature | `Implemented` | `src/features/account/`                           | [`specs/features/account.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/account.spec.md)           |
| `feat-social`       | Social Links Management           | Feature | `Implemented` | `src/features/social/`                            | [`specs/features/social.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/social.spec.md)             |
| `feat-home`         | Home Landing Page                 | Feature | `Implemented` | `src/features/home/`                              | [`specs/features/home.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/home.spec.md)                 |
| `feat-about`        | About & Journey                   | Feature | `Implemented` | `src/features/about/`                             | [`specs/features/about.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/about.spec.md)               |
| `feat-dashboard`    | CMS Dashboard Overview            | Feature | `Implemented` | `src/features/dashboard/`                         | [`specs/features/dashboard.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/dashboard.spec.md)       |
| `feat-portfolio`    | Portfolio Shell, Resume & Sitemap | Feature | `Implemented` | `src/features/portfolio/`                         | [`specs/features/portfolio.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/portfolio.spec.md)       |
| `feat-system`       | System Status & Setup UI          | Feature | `Implemented` | `src/features/system/`                            | [`specs/features/system.spec.md`](file:///d:/winterest-project/winterest-portfolio-v2/specs/features/system.spec.md)             |

---

## SDD Workflow Rules

1. **Before modifying or creating features**: Consult the relevant spec in `specs/system/` or `specs/features/`.
2. **For new non-trivial features**: Create an RFC in `specs/changes/YYYY-MM-[proposal-name].md` defining the 8 mandatory sections. Lock the contracts before writing UI code.
3. **After implementation**: Update the living spec (`specs/features/` or `specs/system/`), execute verification checks (`bun run check`, `bun run test`, `bun run build`), and synchronize the knowledge graph (`graphify update .`).
