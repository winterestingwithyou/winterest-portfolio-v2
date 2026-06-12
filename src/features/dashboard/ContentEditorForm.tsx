import { Link, useNavigate } from '@tanstack/react-router'
import { Save, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

type ContentKind = 'writing' | 'lab'

type ContentFormInitial = {
  id?: string
  slug?: string | null
  title?: string | null
  summary?: string | null
  content?: string | null
  status?: 'draft' | 'published' | 'archived' | null
  visibility?: 'public' | 'private' | null
  coverImage?: string | null
  tags?: string[] | null
  demoUrl?: string | null
  repoUrl?: string | null
}

type ContentEditorFormProps = {
  kind: ContentKind
  mode: 'create' | 'edit'
  entry?: ContentFormInitial
}

const statusOptions = ['draft', 'published', 'archived'] as const
const visibilityOptions = ['public', 'private'] as const

export function ContentEditorForm({
  kind,
  mode,
  entry,
}: ContentEditorFormProps) {
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const endpoint = useMemo(() => {
    const base = kind === 'writing' ? '/api/writing' : '/api/lab'

    if (mode === 'edit' && entry?.id) {
      return `${base}/${entry.id}`
    }

    if (mode === 'edit' && entry?.slug) {
      return `${base}/${entry.slug}`
    }

    return base
  }, [entry?.id, entry?.slug, kind, mode])

  async function navigateBack() {
    await navigate({
      to: kind === 'writing' ? '/dashboard/writing' : '/dashboard/lab',
    })
  }

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
      content: String(formData.get('content') ?? ''),
      status: String(formData.get('status') ?? 'draft'),
      visibility: String(formData.get('visibility') ?? 'public'),
      coverImage: String(formData.get('coverImage') ?? ''),
      tags: String(formData.get('tags') ?? ''),
      demoUrl: String(formData.get('demoUrl') ?? ''),
      repoUrl: String(formData.get('repoUrl') ?? ''),
    }

    try {
      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(
          kind === 'writing' ? withoutLabFields(payload) : payload,
        ),
      })
      const result: { error?: string } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Content save failed.')
      }

      setMessage(mode === 'create' ? 'Draft created.' : 'Changes saved.')
      await navigateBack()
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Content save failed.',
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
        throw new Error(result.error ?? 'Content delete failed.')
      }

      await navigateBack()
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Content delete failed.',
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card grid gap-5 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={entry?.title ?? ''} />
        <Field label="Slug" name="slug" defaultValue={entry?.slug ?? ''} />
      </div>
      <Field
        label="Summary"
        name="summary"
        defaultValue={entry?.summary ?? ''}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Select
          label="Status"
          name="status"
          defaultValue={entry?.status ?? 'draft'}
          options={statusOptions}
        />
        <Select
          label="Visibility"
          name="visibility"
          defaultValue={entry?.visibility ?? 'public'}
          options={visibilityOptions}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Cover image URL"
          name="coverImage"
          defaultValue={entry?.coverImage ?? ''}
        />
        <Field
          label="Tags"
          name="tags"
          defaultValue={(entry?.tags ?? []).join(', ')}
        />
        {kind === 'lab' ? (
          <>
            <Field
              label="Demo URL"
              name="demoUrl"
              defaultValue={entry?.demoUrl ?? ''}
            />
            <Field
              label="Repository URL"
              name="repoUrl"
              defaultValue={entry?.repoUrl ?? ''}
            />
          </>
        ) : null}
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
          rows={12}
          defaultValue={entry?.content ?? ''}
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
        {kind === 'writing' ? (
          <Link
            to="/dashboard/writing"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
          >
            Back
          </Link>
        ) : (
          <Link
            to="/dashboard/lab"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
          >
            Back
          </Link>
        )}
      </div>
    </form>
  )
}

function withoutLabFields(payload: {
  slug: string
  title: string
  summary: string
  content: string
  status: string
  visibility: string
  coverImage: string
  tags: string
  demoUrl: string
  repoUrl: string
}) {
  const { demoUrl: _demoUrl, repoUrl: _repoUrl, ...writingPayload } = payload
  return writingPayload
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
