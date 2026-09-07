# RFC: {{TITLE}}

- **Feature ID**: `{{ID}}`
- **Date**: `{{DATE}}`
- **Status**: `Draft`
- **Target Routes**: `{{TARGET_ROUTES}}`
- **Target Modules**: `{{TARGET_MODULES}}`

---

## 1. Overview & Problem Statement

<!-- What problem does this solve? Why is it needed? -->

### User Personas & Capabilities

- **Visitor / Reader**:
- **Editor / Admin**:

---

## 2. Database & Storage Contract (D1 & R2)

<!-- D1 tables, columns, indexes, or R2 bucket storage -->

### D1 Tables & Schema Changes

- **New Tables**:
- **Modified Tables**:
- **Indexes & Constraints**:

### R2 Storage (if applicable)

- **Bucket**: `MEDIA_BUCKET`
- **Key Pattern**:

---

## 3. Server & API Contracts (Zod & ofetch)

<!-- HTTP endpoints, methods, Zod schemas, Turnstile -->

| Endpoint   | Method | Role    | Turnstile | Purpose |
| :--------- | :----- | :------ | :-------- | :------ |
| `/api/...` | `GET`  | Public  | No        | ...     |
| `/api/...` | `POST` | Editor+ | Yes       | ...     |

### Zod Validation Schemas

- `src/features/{{MODULE}}/validation.ts`:
  - `{{SCHEMA_NAME}}`:

---

## 4. UI & State Architecture

<!-- Route gateway, components, TanStack Query options, copy tokens -->

- **Route Gateway**: `src/routes/...`
- **Page Component**: `src/features/{{MODULE}}/pages/...`
- **Components**:
  - `src/features/{{MODULE}}/components/section/...`
  - `src/features/{{MODULE}}/components/form/...`
- **Query Options & Hooks**:
  - `src/features/{{MODULE}}/query-options.ts`: `{{QUERY_KEYS}}`
  - `src/features/{{MODULE}}/hooks.ts`: `{{MUTATION_HOOKS}}`
- **Copywriting (`copy.ts`)**:
  - Bilingual keys (`en` & `id`) in `src/features/{{MODULE}}/copy.ts`.

---

## 5. Security & RBAC Rules

<!-- Explicit authorization boundaries -->

- **Public**:
- **Editor**:
- **Admin**:
- **Owner**:

---

## 6. Edge Cases & Invariants

<!-- System constraints, limits, fallbacks -->

- **Invariant 1**:
- **Invariant 2**:
- **Fallback**:

---

## 7. Acceptance Criteria & Verification Checklist

<!-- DoD checklist before merging into living spec -->

- [ ] Schema migration verified locally (`bun run db:generate`)
- [ ] TypeScript check passes cleanly (`bun run check`)
- [ ] Unit & validation tests written in `src/features/{{MODULE}}/__tests__/` (`bun run test`)
- [ ] Production build succeeds (`bun run build`)
- [ ] Living spec updated and synchronized (`graphify update .`)
