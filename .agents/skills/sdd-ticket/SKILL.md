---
name: sdd-ticket
description: >-
  Use this skill whenever the user asks to create, add, or draft a ticket, RFC proposal,
  change spec, or feature request in specs/changes/ (e.g. "buat ticket", "add ticket",
  "bikin proposal fitur", "buat RFC"). It conducts an interactive interview, validates
  technical contracts (D1, R2, Zod, API, RBAC, Turnstile), and scaffolds a standardized
  spec file in specs/changes/YYYY-MM-[slug].md.
---

# SDD Ticket & Proposal Generator (`sdd-ticket`)

This skill guides the creation of standardized RFC change proposals and tickets under `specs/changes/` following the Spec-Driven Development (SDD) standard codified in Rule 11.

---

## Workflow Steps

### Step 1: Determine Ticket Type

Identify whether the request is:

1. **Feature RFC (`feat-[slug]`)**: New public or dashboard capability (e.g. blog, analytics, 3D visual).
2. **Architectural Change (`arch-[slug]`)**: Major refactor, runtime upgrade, or cross-cutting overhaul.
3. **Major Bugfix / Investigation (`fix-[slug]`)**: Bug requiring schema mutation, API contract redesign, or security mitigation.

### Step 2: Interactive Interview (Targeted Discovery)

Before writing the file, briefly clarify key technical details if not provided by the user:

- **Title & Slug**: Short descriptive name (e.g. `blog-engine`, `activity-stream`).
- **Route Gateway**: Will this live on public routes (e.g. `/blog`), dashboard (`/dashboard/articles`), or API-only?
- **Database (D1) & Storage (R2)**:
  - Any new D1 tables or columns in `src/db/schema.ts`?
  - Any media uploaded to Cloudflare R2 (`MEDIA_BUCKET`)?
- **Security & RBAC**:
  - Who can access / mutate? (`public`, `editor`, `admin`, `owner`).
  - Does any mutation form require Cloudflare Turnstile bot verification?
- **Localization (i18n)**:
  - Does it introduce user-facing UI text requiring bilingual copy (`en`/`id`) in `copy.ts`?

### Step 3: Scaffold File in `specs/changes/`

1. Determine file path using current date: `specs/changes/YYYY-MM-[slug].md` (e.g. `specs/changes/2026-09-blog-engine.md`).
2. Populate the file using the standard 8-section template located in [`./resources/ticket-template.md`](./resources/ticket-template.md):
   - **Section 1: Metadata & Status** (`Status: Draft`)
   - **Section 2: Overview & Problem Statement**
   - **Section 3: Database & Storage Contract (D1 & R2)**
   - **Section 4: Server & API Contracts (Zod & ofetch)**
   - **Section 5: UI & State Architecture**
   - **Section 6: Security & RBAC Rules**
   - **Section 7: Edge Cases & Invariants**
   - **Section 8: Acceptance Criteria & Verification Checklist**

### Step 4: Formatting & Quality Check

1. Run Prettier format on the generated markdown:
   ```bash
   bun run format
   ```
2. Present the user with a clickable link to the created ticket (e.g. `[2026-09-blog-engine.md](file:///d:/winterest-project/winterest-portfolio-v2/specs/changes/2026-09-blog-engine.md)`).
3. Outline next actionable steps (e.g. reviewing open questions, locking contracts before implementation).
