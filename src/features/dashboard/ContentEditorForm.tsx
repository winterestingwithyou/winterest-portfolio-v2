import { Link, useNavigate } from '@tanstack/react-router'
import { Save, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

import { getDashboardCopy } from './copy'

type ContentKind = 'writing' | 'lab'

type ContentFormInitial = {
  id?: string
  locale?: 'en' | 'id' | null
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
const localeOptions = ['en', 'id'] as const

export function ContentEditorForm({
  kind,
  mode,
  entry,
}: ContentEditorFormProps) {
  const copy = getDashboardCopy()
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
      locale: String(formData.get('locale') ?? 'en'),
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
        throw new Error(result.error ?? copy.common.saveError)
      }

      setMessage(
        mode === 'create' ? copy.common.draftCreated : copy.common.changesSaved,
      )
      await navigateBack()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.common.saveError)
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
        throw new Error(result.error ?? copy.common.deleteError)
      }

      await navigateBack()
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : copy.common.deleteError,
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card grid gap-5 p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label={copy.form.title}
          name="title"
          defaultValue={entry?.title ?? ''}
        />
        <Field
          label={copy.form.slug}
          name="slug"
          defaultValue={entry?.slug ?? ''}
        />
      </div>
      <Select
        label={copy.form.language}
        name="locale"
        defaultValue={entry?.locale ?? 'en'}
        options={localeOptions}
      />
      <Field
        label={copy.form.summary}
        name="summary"
        defaultValue={entry?.summary ?? ''}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Select
          label={copy.form.status}
          name="status"
          defaultValue={entry?.status ?? 'draft'}
          options={statusOptions}
        />
        <Select
          label={copy.form.visibility}
          name="visibility"
          defaultValue={entry?.visibility ?? 'public'}
          options={visibilityOptions}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label={copy.form.coverImageUrl}
          name="coverImage"
          defaultValue={entry?.coverImage ?? ''}
        />
        <Field
          label={copy.form.tags}
          name="tags"
          defaultValue={(entry?.tags ?? []).join(', ')}
        />
        {kind === 'lab' ? (
          <>
            <Field
              label={copy.form.demoUrl}
              name="demoUrl"
              defaultValue={entry?.demoUrl ?? ''}
            />
            <Field
              label={copy.form.repositoryUrl}
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
          {copy.form.content}
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
            ? copy.common.saving
            : mode === 'create'
              ? copy.common.createDraft
              : copy.common.saveChanges}
        </button>
        {mode === 'edit' ? (
          <button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-sm font-bold text-red-700 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-200"
          >
            <Trash2 aria-hidden="true" className="size-4" />
            {copy.common.delete}
          </button>
        ) : null}
        {kind === 'writing' ? (
          <Link
            to="/dashboard/writing"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
          >
            {copy.common.back}
          </Link>
        ) : (
          <Link
            to="/dashboard/lab"
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:border-[var(--brand-orange)]"
          >
            {copy.common.back}
          </Link>
        )}
      </div>
    </form>
  )
}

function withoutLabFields(payload: {
  locale: string
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
