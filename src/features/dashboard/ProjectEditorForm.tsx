import { Link, useNavigate } from '@tanstack/react-router'
import { Save, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

type ProjectFormInitial = {
  id?: string
  slug?: string | null
  title?: string | null
  summary?: string | null
  description?: string | null
  content?: string | null
  status?: 'draft' | 'published' | 'archived' | null
  visibility?: 'public' | 'private' | null
  featured?: boolean | null
  category?: string | null
  coverImage?: string | null
  repoUrl?: string | null
  demoUrl?: string | null
  caseStudyUrl?: string | null
}

type ProjectEditorFormProps = {
  mode: 'create' | 'edit'
  project?: ProjectFormInitial
}

const statusOptions = ['draft', 'published', 'archived'] as const
const visibilityOptions = ['public', 'private'] as const

export function ProjectEditorForm({ mode, project }: ProjectEditorFormProps) {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [featured, setFeatured] = useState(Boolean(project?.featured))

  const endpoint = useMemo(() => {
    if (mode === 'edit' && project?.id) {
      return `/api/projects/${project.id}`
    }

    if (mode === 'edit' && project?.slug) {
      return `/api/projects/${project.slug}`
    }

    return '/api/projects'
  }, [mode, project?.id, project?.slug])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      slug: String(formData.get('slug') ?? ''),
      title: String(formData.get('title') ?? ''),
      summary: String(formData.get('summary') ?? ''),
      description: String(formData.get('description') ?? ''),
      content: String(formData.get('content') ?? ''),
      status: String(formData.get('status') ?? 'draft'),
      visibility: String(formData.get('visibility') ?? 'public'),
      featured,
      category: String(formData.get('category') ?? 'Project'),
      coverImage: String(formData.get('coverImage') ?? ''),
      repoUrl: String(formData.get('repoUrl') ?? ''),
      demoUrl: String(formData.get('demoUrl') ?? ''),
      caseStudyUrl: String(formData.get('caseStudyUrl') ?? ''),
    }

    try {
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result: { error?: string } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Project save failed.')
      }

      setMessage(mode === 'create' ? 'Draft created.' : 'Changes saved.')
      await navigate({ to: '/dashboard/projects' })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Project save failed.',
      )
    } finally {
      setIsPending(false)
    }
  }

  async function handleDelete() {
    if (mode !== 'edit') {
      return
    }

    setIsPending(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch(endpoint, { method: 'DELETE' })
      const result: { error?: string } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Project delete failed.')
      }

      await navigate({ to: '/dashboard/projects' })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Project delete failed.',
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card grid gap-5 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={project?.title ?? ''} />
        <Field label="Slug" name="slug" defaultValue={project?.slug ?? ''} />
      </div>
      <Field
        label="Summary"
        name="summary"
        defaultValue={project?.summary ?? ''}
      />
      <Field
        label="Description"
        name="description"
        defaultValue={project?.description ?? ''}
      />
      <div className="grid gap-5 md:grid-cols-3">
        <Field
          label="Category"
          name="category"
          defaultValue={project?.category ?? 'Project'}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={project?.status ?? 'draft'}
          options={statusOptions}
        />
        <Select
          label="Visibility"
          name="visibility"
          defaultValue={project?.visibility ?? 'public'}
          options={visibilityOptions}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Repository URL"
          name="repoUrl"
          defaultValue={project?.repoUrl ?? ''}
        />
        <Field
          label="Demo URL"
          name="demoUrl"
          defaultValue={project?.demoUrl ?? ''}
        />
        <Field
          label="Case study URL"
          name="caseStudyUrl"
          defaultValue={project?.caseStudyUrl ?? ''}
        />
        <Field
          label="Cover image URL"
          name="coverImage"
          defaultValue={project?.coverImage ?? ''}
        />
      </div>
      <label className="flex items-center gap-3 rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] p-3 text-sm font-bold text-[var(--brand-ink)]">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
          className="size-4 accent-[var(--brand-orange)]"
        />
        Featured project
      </label>
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
          defaultValue={project?.content ?? ''}
          className="mt-2 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-3 text-sm leading-7 text-[var(--brand-ink)]"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-200">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-[var(--brand-line)] pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save aria-hidden="true" className="size-4" />
          {isPending
            ? 'Saving...'
            : mode === 'create'
              ? 'Create draft'
              : 'Save changes'}
        </button>
        {mode === 'edit' ? (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-200"
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Delete
          </button>
        ) : null}
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

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue: string
  options: readonly string[]
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-bold text-[var(--brand-ink)]"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--brand-ink)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
