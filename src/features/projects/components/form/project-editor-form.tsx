import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
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
import { DatePicker, formatDateToIso } from '#/components/ui/date-picker'
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
import { MarkdownTextarea } from '#/components/ui/markdown-textarea'
import { ImageUploader } from '#/components/media/image-uploader'
import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '#/features/projects/hooks'
import { getProjectFormSchema } from '#/features/projects/validation'
import { techQueryOptions } from '#/features/technologies/query-options'
import { TechnologyCreateDialog } from '#/features/technologies/components/form/technology-create-dialog'
import type { TechnologyWithCategories } from '#/features/technologies/queries'
import type { ContentStatus } from '#/db/schema'
import { getApiErrorMessage } from '#/lib/api-client'
import { getLocale } from '#/paraglide/runtime'

type ProjectFormInitial = {
  id?: string
  slug?: string | null
  title?: string | null
  summary?: string | null
  description?: string | null
  status?: ContentStatus | null
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

const localeOptions = [
  { value: 'en' as const, label: 'English', flag: '🇬🇧' },
  { value: 'id' as const, label: 'Indonesia', flag: '🇮🇩' },
] as const

function formatDateForInput(date?: Date | string | null): string {
  return formatDateToIso(date)
}

function parseDateForPayload(val?: string | null): Date | undefined {
  if (!val || val.trim() === '') return undefined
  const trimmed = val.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
  }
  const d = new Date(trimmed)
  return isNaN(d.getTime()) ? undefined : d
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

export function ProjectEditorForm({ mode, project }: ProjectEditorFormProps) {
  const copy = getDashboardCopy()
  const locale = getLocale() === 'id' ? 'id' : 'en'
  const formCopy = copy.projects.form
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

  const statusOptions = [
    { value: 'draft' as const, label: formCopy.statusDraft },
    { value: 'in_progress' as const, label: formCopy.statusInProgress },
    { value: 'published' as const, label: formCopy.statusPublished },
    { value: 'archived' as const, label: formCopy.statusArchived },
  ]

  const visibilityOptions = [
    { value: 'public' as const, label: formCopy.visibilityPublic },
    { value: 'private' as const, label: formCopy.visibilityPrivate },
  ]

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
      onSubmit: getProjectFormSchema(locale),
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
        startedAt: parseDateForPayload(value.startedAt),
        completedAt: parseDateForPayload(value.completedAt),
        publishedAt: parseDateForPayload(value.publishedAt),
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
        className="space-y-8 pb-12 w-full min-w-0 max-w-full"
      >
        {/* Top action bar */}
        <div className="flex items-center justify-between w-full min-w-0 max-w-full">
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
              onClick={() => setIsDeleteDialogOpen(true)}
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
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400 w-full min-w-0 max-w-full">
            <AlertCircle className="size-5 shrink-0" />
            <span className="break-words min-w-0 flex-1">{error}</span>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 w-full min-w-0 max-w-full">
            <CheckCircle2 className="size-5 shrink-0" />
            <span className="break-words min-w-0 flex-1">{message}</span>
          </div>
        )}

        {/* Main Settings Card */}
        <div className="surface-card space-y-6 p-4 sm:p-8 w-full min-w-0 max-w-full">
          <div className="border-b border-(--brand-line) pb-4">
            <h2 className="text-lg font-bold text-(--brand-ink)">
              {formCopy.mainSettingsTitle}
            </h2>
            <p className="text-xs text-(--brand-muted)">
              {formCopy.mainSettingsDesc}
            </p>
          </div>

          <FieldGroup className="w-full min-w-0 max-w-full">
            {/* Slug, Status, Visibility & Repo Visibility Grid */}
            <div className="grid w-full min-w-0 max-w-full gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <form.Field
                name="slug"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-full min-w-0 max-w-full"
                    >
                      <FieldLabel htmlFor={field.name}>
                        {formCopy.slug} <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={formCopy.slugPlaceholder}
                        aria-invalid={isInvalid}
                        className="h-11 font-mono rounded-xl border-(--brand-line) bg-surface text-sm w-full min-w-0"
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
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.status}
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as ContentStatus)
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="h-11 w-full rounded-xl border-(--brand-line) bg-surface text-sm min-w-0"
                      >
                        <SelectValue placeholder={formCopy.statusPlaceholder} />
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
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.visibility}
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
                        className="h-11 w-full rounded-xl border-(--brand-line) bg-surface text-sm min-w-0"
                      >
                        <SelectValue
                          placeholder={formCopy.visibilityPlaceholder}
                        />
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
                name="repoVisibility"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.repoVisibility}
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
                        className="h-11 w-full rounded-xl border-(--brand-line) bg-surface text-sm min-w-0"
                      >
                        <SelectValue
                          placeholder={formCopy.repoVisibilityPlaceholder}
                        />
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

            {/* Cover Image Dedicated Full-Width Container */}
            <div className="w-full min-w-0 max-w-full pt-1">
              <form.Field
                name="coverImage"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="w-full min-w-0 max-w-full"
                    >
                      <ImageUploader
                        value={field.state.value}
                        onChange={(url) => field.handleChange(url ?? '')}
                        label={formCopy.coverImage}
                        description={formCopy.coverImageDesc}
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
            <div className="grid w-full min-w-0 max-w-full gap-6 md:grid-cols-3">
              <form.Field
                name="repoUrl"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.repoUrl}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={formCopy.repoUrlPlaceholder}
                      className="h-11 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm font-mono"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="demoUrl"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.demoUrl}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={formCopy.demoUrlPlaceholder}
                      className="h-11 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm font-mono"
                    />
                  </Field>
                )}
              />

              <form.Field
                name="productionUrl"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.productionUrl}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={formCopy.productionUrlPlaceholder}
                      className="h-11 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm font-mono"
                    />
                  </Field>
                )}
              />
            </div>

            {/* Dates Grid */}
            <div className="grid w-full min-w-0 max-w-full gap-6 md:grid-cols-3">
              <form.Field
                name="startedAt"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.startedAt}
                    </FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(_, iso) => field.handleChange(iso)}
                      placeholder="DD/MM/YYYY"
                      clearLabel={formCopy.clearDate}
                      locale={locale}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="completedAt"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.completedAt}
                    </FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(_, iso) => field.handleChange(iso)}
                      placeholder="DD/MM/YYYY"
                      clearLabel={formCopy.clearDate}
                      locale={locale}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="publishedAt"
                children={(field) => (
                  <Field className="w-full min-w-0 max-w-full">
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.publishedAt}
                    </FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(_, iso) => field.handleChange(iso)}
                      placeholder="DD/MM/YYYY"
                      clearLabel={formCopy.clearDate}
                      locale={locale}
                    />
                  </Field>
                )}
              />
            </div>

            {/* Featured Toggle */}
            <form.Field
              name="featured"
              children={(field) => (
                <div className="rounded-xl border border-(--brand-line) bg-surface-strong p-4">
                  <Field
                    orientation="horizontal"
                    className="justify-between items-center cursor-pointer"
                  >
                    <FieldContent>
                      <FieldLabel
                        htmlFor={field.name}
                        className="font-bold text-sm text-(--brand-ink) cursor-pointer"
                      >
                        {formCopy.featuredTitle}
                      </FieldLabel>
                      <FieldDescription>
                        {formCopy.featuredDesc}
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
        <div className="space-y-6 w-full min-w-0 max-w-full">
          {localeOptions.map(({ value: langCode, label, flag }) => (
            <div
              key={langCode}
              className="surface-card space-y-6 p-4 sm:p-8 w-full min-w-0 max-w-full border-l-4 border-l-(--brand-orange)"
            >
              <div className="flex items-center gap-2.5 border-b border-(--brand-line) pb-4">
                <span className="text-lg">{flag}</span>
                <div>
                  <h3 className="text-base font-bold text-(--brand-ink) flex items-center gap-2">
                    <Globe className="size-4 text-(--brand-orange)" />
                    {formCopy.contentHeading(label)}
                  </h3>
                  <p className="text-xs text-(--brand-muted)">
                    {formCopy.contentDesc(label)}
                  </p>
                </div>
              </div>

              <FieldGroup className="w-full min-w-0 max-w-full">
                <div className="grid w-full min-w-0 max-w-full gap-6 md:grid-cols-2">
                  {/* Title */}
                  <form.Field
                    name={`translations.${langCode}.title`}
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field
                          data-invalid={isInvalid}
                          className="w-full min-w-0 max-w-full"
                        >
                          <FieldLabel htmlFor={field.name}>
                            {formCopy.title} ({label}){' '}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={formCopy.titlePlaceholder(label)}
                            aria-invalid={isInvalid}
                            className="h-11 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm"
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
                        <Field
                          data-invalid={isInvalid}
                          className="w-full min-w-0 max-w-full"
                        >
                          <FieldLabel htmlFor={field.name}>
                            {formCopy.category} ({label}){' '}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={formCopy.categoryPlaceholder(label)}
                            aria-invalid={isInvalid}
                            className="h-11 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm"
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
                      <Field
                        data-invalid={isInvalid}
                        className="w-full min-w-0 max-w-full"
                      >
                        <FieldLabel htmlFor={field.name}>
                          {formCopy.summary} ({label}){' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={formCopy.summaryPlaceholder(label)}
                          aria-invalid={isInvalid}
                          className="h-11 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm"
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
                      <Field
                        data-invalid={isInvalid}
                        className="w-full min-w-0 max-w-full"
                      >
                        <FieldLabel htmlFor={field.name}>
                          {formCopy.description} ({label}){' '}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <MarkdownTextarea
                          id={field.name}
                          name={field.name}
                          rows={6}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={formCopy.descriptionPlaceholder(label)}
                          aria-invalid={isInvalid}
                          labels={formCopy.markdownEditor}
                          className="min-h-36 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm leading-relaxed"
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
        <div className="flex flex-col-reverse gap-3 pt-6 border-t border-(--brand-line) sm:flex-row sm:items-center sm:justify-between w-full min-w-0 max-w-full">
          {mode === 'edit' && project ? (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isPending}
                className="w-full sm:w-auto min-h-11 sm:min-h-9 gap-2 rounded-xl sm:rounded-full bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                {isPending ? copy.common.saving : copy.common.delete}
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
            <div className="hidden sm:block" />
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              asChild
              className="w-full sm:w-auto min-h-11 sm:min-h-9 order-2 sm:order-1 rounded-xl sm:rounded-full border-(--brand-line) font-bold text-(--brand-ink) hover:bg-surface-soft"
            >
              <Link to="/dashboard/projects">{copy.common.back}</Link>
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto min-h-11 sm:min-h-9 order-1 sm:order-2 gap-2 rounded-xl sm:rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) px-6 font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
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
