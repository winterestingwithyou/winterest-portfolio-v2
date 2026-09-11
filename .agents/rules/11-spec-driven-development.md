---
trigger: always_on
---

# Spec-Driven Development (SDD) & Living Documentation Standards

## Principles of SDD

This repository practices **Spec-Driven Development (SDD)**. Every major capability, schema mutation, public endpoint, and dashboard workflow must be grounded in a well-defined specification.

- **Spec Before Code**: For non-trivial features, refactors, or schema changes, define or update the contract in `specs/` before writing production code.
- **Living Documentation**: Specs are not archived dead documents; they are kept up-to-date as the active contract of the application.
- **Contract-Driven**: Specs must prioritize technical boundaries: Drizzle schemas, Zod validation, API shapes, RBAC roles, and TanStack Query keys.

---

## Mandatory Spec Directory Structure

All specifications reside strictly under `specs/` in the repository root (never scattered in `src/`):

```txt
specs/
  README.md                  # Index of all specs, status matrix, and SDD guidelines
  system/                    # Cross-cutting architecture and system-wide specs
    auth-rbac.spec.md        # Better Auth, PBKDF2 edge hashing, cookie sessions, 3 roles
    media-storage.spec.md    # Cloudflare R2 bucket, D1 metadata, public streaming endpoint
    setup-guard.spec.md      # Two-stage migration & owner bootstrap root guard
    i18n-copy.spec.md        # Bilingual copy contract (en/id), Paraglide, CMS fallback
  features/                  # 1-to-1 mirror of src/features/ domain modules
    projects.spec.md         # Public project showcase, slug details, dashboard CRUD, translations
    technologies.spec.md     # Stack categories, technology entities, isUltimate marquee
    media.spec.md            # Media library, image uploader, picker modal
    contact.spec.md          # Public contact form, Cloudflare Turnstile, Resend email
    users.spec.md            # User management, role elevation, owner-only CLI/dashboard
    settings.spec.md         # Site settings (General, Social, SEO, System)
    account.spec.md          # Profile settings, password change with current password check
    home.spec.md             # Landing page sections, hero, featured projects, tech marquee
    about.spec.md            # Journey, content-collections (jobs, education), timeline
  changes/                   # RFCs & proposals for upcoming features before implementation
    YYYY-MM-[proposal-name].md # Active proposals (Draft, In Progress)
    implemented/             # Completed proposals merged into living specs
      YYYY-MM-[proposal-name].md
```

---

## Mandatory Spec Content & Technical Contracts

Every feature spec (`specs/features/<feature>.spec.md`) must follow this standardized contract structure:

1. **Metadata & Status**: Feature ID (`feat-[name]`), Status (`Implemented`, `In Progress`, `Draft`, `Deprecated`), related code paths, routes, and last updated date.
2. **Overview & Capabilities**: Problem statement, user personas, and testable capabilities.
3. **Database & Storage Contract (D1 & R2)**:
   - D1 tables touched (referencing `src/db/schema.ts`).
   - Cascade rules, unique indexes, and enum constraints (`ContentStatus`, `UserRole`, etc.).
   - Cloudflare R2 bindings and asset URL patterns (if applicable).
4. **Server & API Contracts (Zod & ofetch)**:
   - Endpoints (`GET`, `POST`, `PUT`, `DELETE`).
   - Zod validation schemas (referencing `src/features/<feature>/validation.ts`).
   - Cloudflare Turnstile bot verification requirement (`true`/`false`).
   - Error response shapes and status codes.
5. **UI & State Architecture**:
   - Route gateway and feature page component pairing.
   - TanStack Query options and query key factories (`query-options.ts`).
   - TanStack Form fields and client validation (`validation.ts`).
   - Bilingual copy tokens in `copy.ts` (`en` & `id`).
6. **Security & RBAC Rules**: Explicit permissions for `owner`, `admin`, `editor`, and public visitors.
7. **Edge Cases & Invariants**: Missing tables (SetupGuard), duplicate slugs, file upload limits, translation fallbacks.
8. **Acceptance Criteria & Verification Checklist**: Testable criteria, required Vitest suites, and DoD commands (`bun run check`, `bun run test`).

---

## SDD Workflow Lifecycle

When developing new capabilities or refactoring existing ones:

1. **Map with Graphify (Mandatory Zero-Prompt Step)**: Before writing any plan or code, query the knowledge graph (`query_graph` or `graphify query "<feature-or-module>"`) to map existing nodes, caller relationships, affected components, and routes. Do not rely on manual brute-force grep.
2. **Draft Spec**: Create proposal in `specs/changes/YYYY-MM-[feature].md`.
3. **Lock Contracts**: Finalize D1 schema, Zod validation, and API signatures before writing UI code.
4. **Implementation**: Implement code across `src/db/schema.ts`, `validation.ts`, `queries.ts`, `query-options.ts`, and components.
5. **Verification**: Verify against the spec checklist and run all quality gates (`bun run check`, `bun run test`, `bun run build`).
6. **Merge, Archive & Sync**:
   - Consolidate the change spec into the living spec (`specs/features/<feature>.spec.md` or `specs/system/<system>.spec.md`).
   - Mark RFC status as `Implemented` and move the file into `specs/changes/implemented/` to keep `specs/changes/` root clean with only active/in-progress proposals.
   - Synchronize the knowledge graph with `graphify update .`.

---

## Reverse-Spec & Maintenance Guidelines

For existing features where documentation is missing or outdated:

- Use `graphify query "<feature-name>"` to map existing queries, components, and routes.
- Create or update the living spec to document existing baseline behaviors before introducing modifications.
- Keep specs concise and technical; avoid prose fluff and focus on technical contracts.
