# RFC: Fix UI Project Table Description Overflow

- **Feature ID**: `fix-project-table-description-overflow`
- **Date**: `2026-09-11`
- **Status**: `Implemented`
- **Target Routes**: `/dashboard/projects`
- **Target Modules**: `src/features/projects/components/table/`

---

## 1. Overview & Problem Statement

In the CMS dashboard projects table (`/dashboard/projects`), project entries display the project's title, summary (description), and slug within the primary "Project" column (`dashboard-projects-table-columns.tsx`).

### The Bug

1. **Inherited `whitespace-nowrap`**: The shared primitive `TableCell` in `src/components/ui/table.tsx` applies `whitespace-nowrap` by default. Because `white-space` is an inheritable CSS property, child elements (such as `<p className="text-xs leading-relaxed text-(--brand-muted)">{project.summary}</p>`) inherit `nowrap`.
2. **Horizontal Bleed & Overflow**: Long project summaries do not wrap onto new lines. Without `whitespace-normal` or overflow clipping on the paragraph or container, the text continues on a single horizontal line that stretches past the column boundary and bleeds over adjacent columns (`Status`, `Featured`, `Language`, `Visibility`, `Category`, `Actions`).
3. **Unclamped Title & Slug**: While summaries are the primary offender, long titles and long slugs can also cause horizontal distortion if not defensively constrained.

### Proposed Solution

- In `src/features/projects/components/table/dashboard-projects-table-columns.tsx`:
  - **Summary**: Explicitly apply `whitespace-normal line-clamp-2 break-words` to override `nowrap`, clamp the summary to at most 2 lines, break long words safely, and provide `title={project.summary}` for instant full-text discovery on hover.
  - **Title**: Add `line-clamp-1` / `truncate` and `title={project.title}` to safeguard against oversized project titles.
  - **Slug**: Add `truncate font-mono` and `title={`/projects/${project.slug}`}` to prevent long paths from stretching the column.
  - **Column Cell Container**: Ensure `<div className="min-w-64 max-w-sm sm:max-w-md space-y-1.5 overflow-hidden">` retains rigid bounds without pushing adjacent columns.

---

## 2. Database & Storage Contract (D1 & R2)

This is a pure client-side UI/CSS styling fix.

- **D1 Tables**: No changes.
- **R2 Storage**: No changes.

---

## 3. Server & API Contracts (Zod & ofetch)

No backend endpoints, queries, or validation schemas are affected.

| Endpoint | Method | Role | Turnstile | Purpose |
| :------- | :----- | :--- | :-------- | :------ |
| N/A      | N/A    | N/A  | N/A       | Pure UI |

---

## 4. UI & State Architecture

### Affected Files

- `src/features/projects/components/table/dashboard-projects-table-columns.tsx`
  - Update `title` column cell renderer:
    ```tsx
    columnHelper.accessor('title', {
      header: tableCopy.project,
      cell: (info) => {
        const project = info.row.original
        return (
          <div className="min-w-64 max-w-sm sm:max-w-md space-y-1.5 overflow-hidden">
            <p
              className="truncate font-semibold text-(--brand-ink)"
              title={project.title}
            >
              {project.title}
            </p>
            <p
              className="line-clamp-2 break-words whitespace-normal text-xs leading-relaxed text-(--brand-muted)"
              title={project.summary}
            >
              {project.summary}
            </p>
            <p
              className="truncate font-mono text-xs text-(--brand-muted)"
              title={`/projects/${project.slug}`}
            >
              /projects/{project.slug}
            </p>
          </div>
        )
      },
    }),
    ```

### Copywriting & Localization

- No new copy tokens needed. Tooltips utilize the existing dynamic project strings (`project.title`, `project.summary`, and `/projects/${project.slug}`).

---

## 5. Security & RBAC Rules

- Access to the Projects dashboard remains restricted to authenticated users with roles `owner`, `admin`, or `editor` as governed by `src/routes/dashboard/route.tsx`.

---

## 6. Edge Cases & Invariants

1. **Unbroken Words & URLs**: Descriptions containing continuous unspaced strings (e.g. `https://some-long-url...` or `aaaaaaaaaaaaaaaa`) must not breach the cell border; `break-words` ensures words break to subsequent lines if necessary.
2. **Two-Line Clamp Boundary**: Summaries exceeding two lines must truncate cleanly with an ellipsis (`...`) via `line-clamp-2`.
3. **Full Content Discoverability**: Hovering over the clamped summary or truncated title/slug displays the entire string via native browser `title` attributes, ensuring accessibility and ease of review without navigating to the edit page.
4. **Empty Summary**: If a project summary is empty or whitespace, the container collapses cleanly without displaying broken layout artifacts.

---

## 7. Acceptance Criteria & Verification Checklist

- [ ] `dashboard-projects-table-columns.tsx` applies `whitespace-normal line-clamp-2 break-words` to the project summary.
- [ ] Project title and slug have defensive `truncate` and `title` tooltip attributes.
- [ ] Cell wrapper maintains responsive maximum width (`max-w-sm sm:max-w-md`) with `overflow-hidden`.
- [ ] In the dashboard UI, long descriptions wrap onto at most 2 lines and never spill into the `Status`, `Featured`, `Language`, `Visibility`, `Category`, or `Actions` columns.
- [ ] Hovering over the truncated summary reveals the full description in a tooltip.
- [ ] TypeScript checks pass cleanly (`bun run check`).
- [ ] Linter passes cleanly (`bun run lint`).
- [ ] Production build succeeds (`bun run build`).
