import { Link, useNavigate } from '@tanstack/react-router'
import { Save, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'

import { TechIcon } from '#/components/ui/tech-icon'
import { useTechnologies } from '#/features/technologies/hooks'
import { getDashboardCopy } from './copy'

type ProjectFormInitial = {
  id?: string
  slug?: string | null
  title?: string | null
  summary?: string | null
  description?: string | null
  status?: 'draft' | 'published' | 'archived' | null
  visibility?: 'public' | 'private' | null
  repoVisibility?: 'public' | 'private' | null
  featured?: boolean | null
  category?: string | null
  coverImage?: string | null
  repoUrl?: string | null
  demoUrl?: string | null
  productionUrl?: string | null
  startedAt?: Date | string | null
  completedAt?: Date | string | null
  publishedAt?: Date | string | null
  technologyIds?: string[] | null
  translations?: Partial<Record<LocaleOption, ProjectTranslationInitial>>
}

type LocaleOption = 'en' | 'id'

type ProjectTranslationInitial = {
  title?: string | null
  summary?: string | null
  description?: string | null
  category?: string | null
}

type ProjectTranslationFormValue = {
  title: string
  summary: string
  description: string
  category: string
}

type ProjectEditorFormProps = {
  mode: 'create' | 'edit'
  project?: ProjectFormInitial
}

const statusOptions = ['draft', 'published', 'archived'] as const
const visibilityOptions = ['public', 'private'] as const
const localeOptions = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Indonesia' },
] as const

export function ProjectEditorForm({ mode, project }: ProjectEditorFormProps) {
  const copy = getDashboardCopy()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [featured, setFeatured] = useState(Boolean(project?.featured))
  const { data: availableTechnologies = [] } = useTechnologies()
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>(
    project?.technologyIds ?? [],
  )

  const endpoint = useMemo(() => {
    if (mode === 'edit' && project?.id) {
      return `/api/projects/${project.id}`
    }

    if (mode === 'edit' && project?.slug) {
      return `/api/projects/${project.slug}`
    }

    return '/api/projects'
  }, [mode, project?.id, project?.slug])

  function toggleTech(id: string) {
    setSelectedTechIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      slug: String(formData.get('slug') ?? ''),
      status: String(formData.get('status') ?? 'draft'),
      visibility: String(formData.get('visibility') ?? 'public'),
      repoVisibility: String(formData.get('repoVisibility') ?? 'public'),
      featured,
      coverImage: String(formData.get('coverImage') ?? ''),
      repoUrl: String(formData.get('repoUrl') ?? ''),
      demoUrl: String(formData.get('demoUrl') ?? ''),
      productionUrl: String(formData.get('productionUrl') ?? ''),
      startedAt: formData.get('startedAt')
        ? String(formData.get('startedAt'))
        : undefined,
      completedAt: formData.get('completedAt')
        ? String(formData.get('completedAt'))
        : undefined,
      publishedAt: formData.get('publishedAt')
        ? String(formData.get('publishedAt'))
        : undefined,
      technologyIds: selectedTechIds,
      translations: Object.fromEntries(
        localeOptions.map(({ value }) => [
          value,
          {
            title: String(formData.get(`${value}.title`) ?? ''),
            summary: String(formData.get(`${value}.summary`) ?? ''),
            description: String(formData.get(`${value}.description`) ?? ''),
            category: String(formData.get(`${value}.category`) ?? 'Project'),
          },
        ]),
      ),
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
        throw new Error(result.error ?? copy.projects.saveError)
      }

      setMessage(
        mode === 'create' ? copy.common.draftCreated : copy.common.changesSaved,
      )
      await navigate({ to: '/dashboard/projects' })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : copy.projects.saveError,
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
        throw new Error(result.error ?? copy.projects.deleteSaveError)
      }

      await navigate({ to: '/dashboard/projects' })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : copy.projects.deleteSaveError,
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card grid gap-5 p-5">
      <div className="grid gap-5 md:grid-cols-3">
        <Field
          label={copy.form.slug}
          name="slug"
          defaultValue={project?.slug ?? ''}
        />
        <Select
          label={copy.form.status}
          name="status"
          defaultValue={project?.status ?? 'draft'}
          options={statusOptions}
        />
        <Select
          label="Visibilitas Project"
          name="visibility"
          defaultValue={project?.visibility ?? 'public'}
          options={visibilityOptions}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Select
          label="Visibilitas Repository"
          name="repoVisibility"
          defaultValue={project?.repoVisibility ?? 'public'}
          options={visibilityOptions}
        />
        <Field
          label={copy.form.coverImageUrl}
          name="coverImage"
          defaultValue={project?.coverImage ?? ''}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field
          label={copy.form.repositoryUrl}
          name="repoUrl"
          defaultValue={project?.repoUrl ?? ''}
        />
        <Field
          label={copy.form.demoUrl}
          name="demoUrl"
          defaultValue={project?.demoUrl ?? ''}
        />
        <Field
          label="URL Production / Live Site"
          name="productionUrl"
          defaultValue={project?.productionUrl ?? ''}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <DateField
          label="Tanggal Mulai (Started At)"
          name="startedAt"
          defaultValue={formatDateForInput(project?.startedAt)}
        />
        <DateField
          label="Tanggal Selesai (Completed At)"
          name="completedAt"
          defaultValue={formatDateForInput(project?.completedAt)}
        />
        <DateField
          label="Tanggal Publish (Published At)"
          name="publishedAt"
          defaultValue={formatDateForInput(project?.publishedAt)}
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-(--brand-line) bg-(--surface-strong) p-3 text-sm font-bold text-(--brand-ink)">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
          className="size-4 accent-(--brand-orange)"
        />
        {copy.form.featured}
      </label>

      {availableTechnologies.length > 0 ? (
        <div className="rounded-lg border border-(--brand-line) bg-(--surface-strong) p-4">
          <h2 className="mb-3 text-sm font-bold text-(--brand-ink)">
            Teknologi Terkait
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableTechnologies.map((tech) => {
              const isSelected = selectedTechIds.includes(tech.id)
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggleTech(tech.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-(--brand-orange) text-white'
                      : 'border border-(--brand-line) bg-(--surface-card) text-(--brand-muted) hover:border-(--brand-orange)'
                  }`}
                >
                  <TechIcon
                    src={tech.icon}
                    name={tech.name}
                    color={tech.color}
                    className="size-3.5"
                  />
                  {tech.name}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {localeOptions.map(({ value, label }) => {
        const translation = getTranslation(project, value)

        return (
          <section
            key={value}
            className="grid gap-5 rounded-lg border border-(--brand-line) bg-(--surface-strong) p-4"
          >
            <h2 className="text-lg font-semibold text-(--brand-ink)">
              {label}
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label={copy.form.title}
                name={`${value}.title`}
                defaultValue={translation.title}
              />
              <Field
                label={copy.form.category}
                name={`${value}.category`}
                defaultValue={translation.category}
              />
            </div>
            <Field
              label={copy.form.summary}
              name={`${value}.summary`}
              defaultValue={translation.summary}
            />
            <div>
              <label
                htmlFor={`${value}.description`}
                className="text-sm font-bold text-(--brand-ink)"
              >
                {copy.form.description}
              </label>
              <textarea
                id={`${value}.description`}
                name={`${value}.description`}
                rows={6}
                defaultValue={translation.description}
                className="mt-2 w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-3 text-sm leading-7 text-(--brand-ink)"
              />
            </div>
          </section>
        )
      })}

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

      <div className="flex flex-wrap gap-2 border-t border-(--brand-line) pt-5">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
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
        <Link
          to="/dashboard/projects"
          className="inline-flex min-h-10 items-center rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange)"
        >
          {copy.common.back}
        </Link>
      </div>
    </form>
  )
}

function getTranslation(
  project: ProjectFormInitial | undefined,
  locale: LocaleOption,
): ProjectTranslationFormValue {
  const translation = project?.translations?.[locale]

  return {
    title: translation?.title ?? (locale === 'en' ? project?.title : '') ?? '',
    summary:
      translation?.summary ?? (locale === 'en' ? project?.summary : '') ?? '',
    description:
      translation?.description ??
      (locale === 'en' ? project?.description : '') ??
      '',
    category:
      translation?.category ??
      (locale === 'en' ? project?.category : 'Project') ??
      'Project',
  }
}

function formatDateForInput(date?: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
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
      <label htmlFor={name} className="text-sm font-bold text-(--brand-ink)">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 text-sm text-(--brand-ink)"
      />
    </div>
  )
}

function DateField({
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
      <label htmlFor={name} className="text-sm font-bold text-(--brand-ink)">
        {label}
      </label>
      <input
        type="date"
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 text-sm text-(--brand-ink)"
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
      <label htmlFor={name} className="text-sm font-bold text-(--brand-ink)">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 min-h-11 w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 text-sm text-(--brand-ink)"
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
