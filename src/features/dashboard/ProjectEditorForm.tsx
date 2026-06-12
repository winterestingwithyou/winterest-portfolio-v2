import { Link } from '@tanstack/react-router'
import { Save } from 'lucide-react'

import type { featuredProjects } from '#/features/portfolio/data'

type ProjectSeed = (typeof featuredProjects)[number]

type ProjectEditorFormProps = {
  mode: 'create' | 'edit'
  project?: ProjectSeed
}

export function ProjectEditorForm({ mode, project }: ProjectEditorFormProps) {
  const title = project?.title ?? ''
  const slug = project?.slug ?? ''
  const summary = project?.summary ?? ''
  const category = project?.category ?? 'Project'
  const status = project?.status ?? 'Draft'

  return (
    <form className="surface-card grid gap-5 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={title} />
        <Field label="Slug" name="slug" defaultValue={slug} />
      </div>
      <Field label="Summary" name="summary" defaultValue={summary} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category" name="category" defaultValue={category} />
        <Field label="Status" name="status" defaultValue={status} />
      </div>
      <div>
        <label
          htmlFor="content"
          className="text-sm font-bold text-[var(--brand-ink)]"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          defaultValue={project?.result ?? ''}
          className="mt-2 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-3 text-sm leading-7 text-[var(--brand-ink)]"
        />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-[var(--brand-line)] pt-5">
        <button
          type="button"
          disabled
          className="inline-flex min-h-10 cursor-not-allowed items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white opacity-60"
        >
          <Save aria-hidden="true" className="size-4" />
          {mode === 'create' ? 'Create draft' : 'Save changes'}
        </button>
        <Link
          to="/dashboard/projects"
          className="inline-flex min-h-10 items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
        >
          Back
        </Link>
      </div>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string
  name: string
  defaultValue: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-bold text-[var(--brand-ink)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--brand-ink)]"
      />
    </div>
  )
}
