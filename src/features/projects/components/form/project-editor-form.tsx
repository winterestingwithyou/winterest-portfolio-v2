import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { TechIcon } from '#/components/ui/tech-icon'
import { Textarea } from '#/components/ui/textarea'
import { ImageUploader } from '#/components/media/image-uploader'
import { useQuery } from '@tanstack/react-query'

import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '#/features/projects/hooks'
import { techQueryOptions } from '#/features/technologies/query-options'
import { TechnologyCreateDialog } from '#/features/technologies/components/form/technology-create-dialog'
import type { TechnologyWithCategories } from '#/features/technologies/queries'
import { getApiErrorMessage } from '#/lib/api-client'

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

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
] as const

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
] as const

const localeOptions = [
  { value: 'en' as const, label: 'English', flag: '🇬🇧' },
  { value: 'id' as const, label: 'Indonesia', flag: '🇮🇩' },
] as const

function formatDateForInput(date?: Date | string | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

function getTranslation(
  project: ProjectFormInitial | undefined,
  locale: LocaleOption,
): ProjectTranslationFormValue {
  const translation = project?.translations?.[locale]

  return {
    title:
      translation?.title ?? (locale === 'en' ? (project?.title ?? '') : ''),
    summary:
      translation?.summary ?? (locale === 'en' ? (project?.summary ?? '') : ''),
    description:
      translation?.description ??
      (locale === 'en' ? (project?.description ?? '') : ''),
    category:
      translation?.category ??
      (locale === 'en' ? (project?.category ?? 'Project') : 'Project'),
  }
}

const projectSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  status: z.enum(['draft', 'published', 'archived'] as const),
  visibility: z.enum(['public', 'private'] as const),
  repoVisibility: z.enum(['public', 'private'] as const),
  featured: z.boolean(),
  coverImage: z.string(),
  repoUrl: z.string(),
  demoUrl: z.string(),
  productionUrl: z.string(),
  startedAt: z.string(),
  completedAt: z.string(),
  publishedAt: z.string(),
  technologyIds: z.array(z.string()),
  translations: z.object({
    en: z.object({
      title: z.string().min(1, 'Title (English) wajib diisi.'),
      summary: z.string().min(1, 'Summary (English) wajib diisi.'),
      description: z.string().min(1, 'Description (English) wajib diisi.'),
      category: z.string().min(1, 'Category (English) wajib diisi.'),
    }),
    id: z.object({
      title: z.string().min(1, 'Judul (Indonesia) wajib diisi.'),
      summary: z.string().min(1, 'Ringkasan (Indonesia) wajib diisi.'),
      description: z.string().min(1, 'Deskripsi (Indonesia) wajib diisi.'),
      category: z.string().min(1, 'Kategori (Indonesia) wajib diisi.'),
    }),
  }),
})

export function ProjectEditorForm({ mode, project }: ProjectEditorFormProps) {
  const copy = getDashboardCopy()
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTechDialogOpen, setIsTechDialogOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { data: availableTechnologies = [] } = useQuery(techQueryOptions.list())

  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject(project?.id ?? '')
  const deleteMutation = useDeleteProject()

  const form = useForm({
    defaultValues: {
      slug: project?.slug ?? '',
      status: project?.status ?? 'draft',
      visibility: project?.visibility ?? 'public',
      repoVisibility: project?.repoVisibility ?? 'public',
      featured: Boolean(project?.featured),
      coverImage: project?.coverImage ?? '',
      repoUrl: project?.repoUrl ?? '',
      demoUrl: project?.demoUrl ?? '',
      productionUrl: project?.productionUrl ?? '',
      startedAt: formatDateForInput(project?.startedAt),
      completedAt: formatDateForInput(project?.completedAt),
      publishedAt: formatDateForInput(project?.publishedAt),
      technologyIds: project?.technologyIds ?? [],
      translations: {
        en: getTranslation(project, 'en'),
        id: getTranslation(project, 'id'),
      },
    },
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      setIsPending(true)
      setError(null)
      setMessage(null)

      const payload = {
        slug: value.slug.trim(),
        status: value.status,
        visibility: value.visibility,
        repoVisibility: value.repoVisibility,
        featured: value.featured,
        coverImage: value.coverImage.trim() || undefined,
        repoUrl: value.repoUrl.trim() || undefined,
        demoUrl: value.demoUrl.trim() || undefined,
        productionUrl: value.productionUrl.trim() || undefined,
        startedAt: value.startedAt ? new Date(value.startedAt) : undefined,
        completedAt: value.completedAt
          ? new Date(value.completedAt)
          : undefined,
        publishedAt: value.publishedAt
          ? new Date(value.publishedAt)
          : undefined,
        technologyIds: value.technologyIds,
        translations: value.translations,
      }

      try {
        if (mode === 'create') {
          await createMutation.mutateAsync(payload)
        } else {
          await updateMutation.mutateAsync(payload)
        }

        setMessage(
          mode === 'create'
            ? copy.common.draftCreated
            : copy.common.changesSaved,
        )
        await navigate({ to: '/dashboard/projects' })
      } catch (caught) {
        setError(getApiErrorMessage(caught, copy.projects.saveError))
      } finally {
        setIsPending(false)
      }
    },
  })

  async function handleDelete() {
    if (mode !== 'edit' || !project?.id) {
      return
    }

    setIsPending(true)
    setError(null)
    setMessage(null)

    try {
      await deleteMutation.mutateAsync(project.id)
      setIsDeleteDialogOpen(false)
      await navigate({ to: '/dashboard/projects' })
    } catch (caught) {
      setError(getApiErrorMessage(caught, copy.projects.deleteSaveError))
      setIsDeleteDialogOpen(false)
    } finally {
      setIsPending(false)
    }
  }

  const handleTechnologyCreated = (newTech: TechnologyWithCategories) => {
    const currentTechIds = form.getFieldValue('technologyIds')
    if (!currentTechIds.includes(newTech.id)) {
      form.setFieldValue('technologyIds', [...currentTechIds, newTech.id])
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-8 pb-12"
      >
        {/* Top action bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-(--brand-line) font-semibold text-(--brand-ink) hover:bg-surface-soft"
          >
            <Link to="/dashboard/projects">
              <ArrowLeft className="size-4" />
              {copy.common.back}
            </Link>
          </Button>

          {mode === 'edit' && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleDelete()}
              disabled={isPending}
              className="gap-2 bg-red-600 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {isPending ? copy.common.delete + '...' : copy.common.delete}
            </Button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Main Settings Card */}
        <div className="surface-card space-y-6 p-6 sm:p-8">
          <div className="border-b border-(--brand-line) pb-4">
            <h2 className="text-lg font-bold text-(--brand-ink)">
              Pengaturan Utama Project
            </h2>
            <p className="text-xs text-(--brand-muted)">
              Slug URL, status publikasi, dan pengaturan visibilitas.
            </p>
          </div>

          <FieldGroup>
            {/* Slug, Status, Visibility Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <form.Field
                name="slug"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {copy.form.slug} <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="e.g. cloud-analytics-platform"
                        aria-invalid={isInvalid}
                        className="h-11 font-mono rounded-xl border-(--brand-line) bg-surface text-sm"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="status"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {copy.form.status}
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(
                          val as 'draft' | 'published' | 'archived',
                        )
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="h-11 w-full rounded-xl border-(--brand-line) bg-surface text-sm"
                      >
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <form.Field
                name="visibility"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Visibilitas Project
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as 'public' | 'private')
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="h-11 w-full rounded-xl border-(--brand-line) bg-surface text-sm"
                      >
                        <SelectValue placeholder="Pilih visibilitas" />
                      </SelectTrigger>
                      <SelectContent>
                        {visibilityOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            {/* Repo Visibility & Cover Image */}
            <div className="grid gap-6 md:grid-cols-2">
              <form.Field
                name="repoVisibility"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Visibilitas Repository
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as 'public' | 'private')
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="h-11 w-full rounded-xl border-(--brand-line) bg-surface text-sm"
                      >
                        <SelectValue placeholder="Pilih visibilitas repository" />
                      </SelectTrigger>
                      <SelectContent>
                        {visibilityOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <form.Field
                name="coverImage"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid} className="md:col-span-2">
                      <ImageUploader
                        value={field.state.value}
                        onChange={(url) => field.handleChange(url ?? '')}
                        label={copy.form.coverImageUrl}
                        description={copy.media.coverImageRecommended}
                        aspectRatio="wide"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* URLs Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <form.Field
                name="repoUrl"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {copy.form.repositoryUrl}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://github.com/..."
                      className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm font-mono"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="demoUrl"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {copy.form.demoUrl}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://preview.example.com"
                      className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm font-mono"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="productionUrl"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      URL Production / Live Site
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="https://example.com"
                      className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm font-mono"
                    />
                  </Field>
                )}
              />
            </div>

            {/* Dates Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <form.Field
                name="startedAt"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Tanggal Mulai</FieldLabel>
                    <Input
                      type="date"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="completedAt"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Tanggal Selesai
                    </FieldLabel>
                    <Input
                      type="date"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="publishedAt"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Tanggal Publish
                    </FieldLabel>
                    <Input
                      type="date"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                    />
                  </Field>
                )}
              />
            </div>

            {/* Featured Toggle */}
            <form.Field
              name="featured"
              children={(field) => (
                <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-4">
                  <Field
                    orientation="horizontal"
                    className="justify-between items-center cursor-pointer"
                  >
                    <FieldContent>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-bold text-sm text-(--brand-ink) cursor-pointer"
                      >
                        {copy.form.featured}
                      </FieldLabel>
                      <FieldDescription>
                        Tampilkan di deretan project unggulan (Featured
                        Projects) pada homepage.
                      </FieldDescription>
                    </FieldContent>
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(Boolean(checked))
                      }
                      className="size-5 border-(--brand-line) data-[state=checked]:bg-(--brand-orange) data-[state=checked]:border-(--brand-orange)"
                    />
                  </Field>
                </div>
              )}
            />

            {/* Technologies Multi-Select */}
            <form.Field
              name="technologyIds"
              children={(field) => (
                <Field>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel>{copy.projects.technologiesTitle}</FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setIsTechDialogOpen(true)}
                      className="h-7 cursor-pointer gap-1.5 rounded-full border border-(--brand-line) bg-card px-3 text-xs font-semibold text-(--brand-orange-deep) shadow-2xs transition-all hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)/20 hover:text-(--brand-orange)"
                    >
                      <Plus className="size-3.5 text-(--brand-orange)" />
                      {copy.projects.addTechnologyBtn}
                    </Button>
                  </div>
                  {availableTechnologies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--brand-line) bg-(--brand-orange-soft)/5 p-6 text-center">
                      <p className="mb-3 text-xs text-(--brand-muted)">
                        {copy.projects.noTechnologies}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsTechDialogOpen(true)}
                        className="h-9 cursor-pointer gap-1.5 rounded-full bg-(--brand-orange) px-4 text-xs font-bold text-white shadow-xs transition hover:bg-(--brand-orange-deep)"
                      >
                        <Plus className="size-4" />
                        {copy.projects.addTechnologyEmpty}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {availableTechnologies.map((tech) => {
                        const isSelected = field.state.value.includes(tech.id)
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.handleChange(
                                  field.state.value.filter(
                                    (id) => id !== tech.id,
                                  ),
                                )
                              } else {
                                field.handleChange([
                                  ...field.state.value,
                                  tech.id,
                                ])
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              isSelected
                                ? 'bg-(--brand-orange) text-white shadow-xs'
                                : 'border border-(--brand-line) bg-(--surface-card) text-(--brand-muted) hover:border-(--brand-orange) hover:text-(--brand-ink)'
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
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Multilingual Translation Cards */}
        <div className="space-y-6">
          {localeOptions.map(({ value: langCode, label, flag }) => (
            <div
              key={langCode}
              className="surface-card space-y-6 p-6 sm:p-8 border-l-4 border-l-(--brand-orange)"
            >
              <div className="flex items-center gap-2.5 border-b border-(--brand-line) pb-4">
                <span className="text-lg">{flag}</span>
                <div>
                  <h3 className="text-base font-bold text-(--brand-ink) flex items-center gap-2">
                    <Globe className="size-4 text-(--brand-orange)" />
                    Konten ({label})
                  </h3>
                  <p className="text-xs text-(--brand-muted)">
                    Informasi judul, kategori, ringkasan, dan deskripsi dalam
                    bahasa {label}.
                  </p>
                </div>
              </div>

              <FieldGroup>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Title */}
                  <form.Field
                    name={`translations.${langCode}.title`}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {copy.form.title} ({label}){' '}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={`Judul project (${label})`}
                            aria-invalid={isInvalid}
                            className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  />

                  {/* Category */}
                  <form.Field
                    name={`translations.${langCode}.category`}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            {copy.form.category} ({label}){' '}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={`Kategori (${label}) e.g. Fullstack Web App`}
                            aria-invalid={isInvalid}
                            className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  />
                </div>

                {/* Summary */}
                <form.Field
                  name={`translations.${langCode}.summary`}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          {copy.form.summary} ({label}){' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={`Ringkasan singkat project (${label})`}
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                {/* Description */}
                <form.Field
                  name={`translations.${langCode}.description`}
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          {copy.form.description} ({label}){' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          rows={6}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={`Deskripsi lengkap project (${label}). Mendukung format markdown...`}
                          aria-invalid={isInvalid}
                          className="min-h-32 rounded-xl border-(--brand-line) bg-surface text-sm leading-relaxed"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>
            </div>
          ))}
        </div>

        {/* Form Action Footer */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-(--brand-line)">
          {mode === 'edit' && project ? (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isPending}
                className="gap-2 rounded-full bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                {isPending ? copy.common.delete + '...' : copy.common.delete}
              </Button>

              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {copy.projects.deleteTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {copy.projects.deleteConfirm(
                        project.translations?.en?.title ||
                          project.translations?.id?.title ||
                          project.slug ||
                          '',
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                      {copy.common.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={isPending}
                      onClick={(e) => {
                        e.preventDefault()
                        void handleDelete()
                      }}
                    >
                      {isPending ? copy.common.saving : copy.common.delete}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              asChild
              className="rounded-full border-(--brand-line) font-bold text-(--brand-ink) hover:bg-surface-soft"
            >
              <Link to="/dashboard/projects">{copy.common.back}</Link>
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) px-6 font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
            >
              <Save className="size-4" />
              {isPending
                ? copy.common.saving
                : mode === 'create'
                  ? copy.common.createDraft
                  : copy.common.saveChanges}
            </Button>
          </div>
        </div>
      </form>

      <TechnologyCreateDialog
        open={isTechDialogOpen}
        onOpenChange={setIsTechDialogOpen}
        onSuccess={handleTechnologyCreated}
      />
    </>
  )
}
