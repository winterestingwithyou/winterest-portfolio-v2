import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Code2, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { TechIcon } from '#/components/ui/tech-icon'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { useCreateTechnology } from '#/features/technologies/hooks'
import type { TechnologyWithCategories } from '#/features/technologies/queries'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import { getTechnologyFormSchema } from '#/features/technologies/validation'
import { getApiErrorMessage } from '#/lib/api-client'
import { slugify } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

const SIMPLE_ICONS_PREFIX = 'https://cdn.simpleicons.org/'

type TechnologyCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newTech: TechnologyWithCategories) => void
}

export function TechnologyCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: TechnologyCreateDialogProps) {
  const copy = getDashboardCopy()
  const techFormCopy = copy.stack.techForm
  const locale = getLocale() === 'id' ? 'id' : 'en'

  const [iconSource, setIconSource] = useState<'simpleicons' | 'custom'>(
    'simpleicons',
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery(
    categoryQueryOptions.list(),
  )

  const createMutation = useCreateTechnology()

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      icon: '',
      color: '',
      url: '',
      isUltimate: false,
      categoryIds: [] as string[],
    },
    validators: {
      onSubmit: getTechnologyFormSchema(locale),
    },
    onSubmit: async ({ value }) => {
      setError(null)
      setIsSaving(true)

      try {
        let finalIcon: string | null = null
        const trimmedIcon = value.icon.trim()
        if (trimmedIcon) {
          if (iconSource === 'simpleicons') {
            const cleanSlug = trimmedIcon.replace(
              /^https:\/\/cdn\.simpleicons\.org\//,
              '',
            )
            finalIcon = cleanSlug ? `${SIMPLE_ICONS_PREFIX}${cleanSlug}` : null
          } else {
            finalIcon = trimmedIcon
          }
        }

        const payload = {
          name: value.name.trim(),
          slug: value.slug.trim(),
          icon: finalIcon,
          color: value.color.trim() || null,
          url: value.url.trim() || null,
          isUltimate: false,
          categoryIds: value.categoryIds,
        }

        const newTech = await createMutation.mutateAsync(payload)
        form.reset()
        setIconSource('simpleicons')
        onSuccess?.(newTech)
        onOpenChange(false)
      } catch (caught) {
        setError(getApiErrorMessage(caught, techFormCopy.saveError))
      } finally {
        setIsSaving(false)
      }
    },
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setError(null)
      form.reset()
      setIconSource('simpleicons')
    }
    onOpenChange(nextOpen)
  }

  const handleSourceChange = (newSource: 'simpleicons' | 'custom') => {
    if (newSource === iconSource) return
    setIconSource(newSource)
    const currentVal = form.getFieldValue('icon').trim()
    if (newSource === 'simpleicons') {
      if (currentVal.startsWith(SIMPLE_ICONS_PREFIX)) {
        form.setFieldValue('icon', currentVal.slice(SIMPLE_ICONS_PREFIX.length))
      }
    } else {
      if (
        currentVal &&
        !currentVal.startsWith('http://') &&
        !currentVal.startsWith('https://') &&
        !currentVal.startsWith('/')
      ) {
        form.setFieldValue('icon', `${SIMPLE_ICONS_PREFIX}${currentVal}`)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden border border-(--brand-line) bg-card p-0 text-card-foreground shadow-2xl sm:max-w-lg">
        {/* Sticky Header */}
        <DialogHeader className="shrink-0 border-b border-(--brand-line) bg-card/95 p-4 pr-11 text-left backdrop-blur-xs sm:p-5 sm:pr-12">
          <div className="flex items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-(--brand-line) bg-(--brand-orange-soft) text-(--brand-orange) sm:size-10">
              <Code2 className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="truncate text-base font-bold tracking-tight text-(--brand-ink) sm:text-lg">
                {techFormCopy.quickAddTechTitle}
              </DialogTitle>
              <DialogDescription className="mt-0.5 line-clamp-2 text-xs text-(--brand-muted)">
                {techFormCopy.quickAddTechDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-6">
            {error ? (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <FieldGroup className="space-y-4">
              {/* Name & Slug Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={`tech-dialog-${field.name}`}
                          className="text-xs font-bold text-(--brand-ink)"
                        >
                          {techFormCopy.name}{' '}
                          <span className="font-bold text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id={`tech-dialog-${field.name}`}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const val = e.target.value
                            field.handleChange(val)
                            form.setFieldValue('slug', slugify(val))
                          }}
                          placeholder={techFormCopy.namePlaceholder}
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl border border-(--brand-line) bg-background text-base text-(--brand-ink) placeholder:text-(--brand-muted)/50 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20 sm:text-sm"
                          autoFocus
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                {/* Slug */}
                <form.Field
                  name="slug"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={`tech-dialog-${field.name}`}
                          className="text-xs font-bold text-(--brand-ink)"
                        >
                          {techFormCopy.slug}{' '}
                          <span className="font-bold text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id={`tech-dialog-${field.name}`}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={techFormCopy.slugPlaceholder}
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl border border-(--brand-line) bg-background font-mono text-base text-(--brand-ink) placeholder:text-(--brand-muted)/50 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20 sm:text-sm"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </div>

              {/* Icon Selection & Preview */}
              <form.Field
                name="icon"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  const rawVal = field.state.value.trim()
                  const currentPreviewUrl =
                    iconSource === 'simpleicons'
                      ? rawVal
                        ? `${SIMPLE_ICONS_PREFIX}${rawVal.replace(
                            /^https:\/\/cdn\.simpleicons\.org\//,
                            '',
                          )}`
                        : null
                      : rawVal || null

                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FieldLabel className="text-xs font-bold text-(--brand-ink)">
                          {techFormCopy.icon}
                        </FieldLabel>
                        <div className="inline-flex rounded-lg border border-(--brand-line) bg-background/50 p-0.5">
                          <button
                            type="button"
                            onClick={() => handleSourceChange('simpleicons')}
                            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                              iconSource === 'simpleicons'
                                ? 'bg-(--brand-orange) text-white shadow-xs'
                                : 'text-(--brand-muted) hover:text-(--brand-ink)'
                            }`}
                          >
                            {techFormCopy.iconSourceSimple}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSourceChange('custom')}
                            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                              iconSource === 'custom'
                                ? 'bg-(--brand-orange) text-white shadow-xs'
                                : 'text-(--brand-muted) hover:text-(--brand-ink)'
                            }`}
                          >
                            {techFormCopy.iconSourceCustom}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-(--brand-line) bg-background p-2 shadow-xs">
                          {currentPreviewUrl ? (
                            <TechIcon
                              src={currentPreviewUrl}
                              name={field.state.value}
                              color={form.getFieldValue('color')}
                              className="size-6"
                            />
                          ) : (
                            <Code2 className="size-6 text-(--brand-muted)/40" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <Input
                            id={`tech-dialog-${field.name}`}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={
                              iconSource === 'simpleicons'
                                ? techFormCopy.simpleIconsSlugPlaceholder
                                : techFormCopy.customIconUrlPlaceholder
                            }
                            aria-invalid={isInvalid}
                            className="h-11 rounded-xl border border-(--brand-line) bg-background font-mono text-base text-(--brand-ink) placeholder:text-(--brand-muted)/50 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20 sm:text-sm"
                          />
                        </div>
                      </div>

                      <FieldDescription className="text-[11px] text-(--brand-muted)">
                        {iconSource === 'simpleicons' ? (
                          <>
                            {techFormCopy.simpleIconsDesc}{' '}
                            <a
                              href="https://simpleicons.org"
                              target="_blank"
                              rel="noreferrer noopener"
                              className="font-semibold text-(--brand-orange-deep) underline hover:opacity-80"
                            >
                              simpleicons.org
                            </a>
                          </>
                        ) : (
                          techFormCopy.customIconDesc
                        )}
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              {/* Color & Website URL Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Brand Color */}
                <form.Field
                  name="color"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={`tech-dialog-${field.name}`}
                          className="text-xs font-bold text-(--brand-ink)"
                        >
                          {techFormCopy.color}
                        </FieldLabel>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={
                              field.state.value &&
                              field.state.value.startsWith('#')
                                ? field.state.value
                                : '#F6821F'
                            }
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="size-11 shrink-0 cursor-pointer rounded-xl border border-(--brand-line) bg-transparent p-1"
                          />
                          <Input
                            id={`tech-dialog-${field.name}`}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder={techFormCopy.colorPlaceholder}
                            aria-invalid={isInvalid}
                            className="h-11 rounded-xl border border-(--brand-line) bg-background font-mono text-base text-(--brand-ink) placeholder:text-(--brand-muted)/50 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20 sm:text-sm"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                {/* Website URL */}
                <form.Field
                  name="url"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={`tech-dialog-${field.name}`}
                          className="text-xs font-bold text-(--brand-ink)"
                        >
                          {techFormCopy.websiteUrl}
                        </FieldLabel>
                        <Input
                          id={`tech-dialog-${field.name}`}
                          name={field.name}
                          type="url"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={techFormCopy.websiteUrlPlaceholder}
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl border border-(--brand-line) bg-background text-base text-(--brand-ink) placeholder:text-(--brand-muted)/50 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20 sm:text-sm"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </div>

              {/* Category Assignment */}
              <form.Field
                name="categoryIds"
                children={(field) => (
                  <Field className="space-y-2">
                    <FieldLabel className="text-xs font-bold text-(--brand-ink)">
                      {techFormCopy.categoriesTitle}
                    </FieldLabel>

                    {isLoadingCategories ? (
                      <p className="text-xs text-(--brand-muted)">
                        {techFormCopy.categoriesLoading}
                      </p>
                    ) : categories.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-(--brand-line) bg-(--brand-orange-soft)/5 p-3 text-center">
                        <p className="text-xs text-(--brand-muted)">
                          {techFormCopy.noCategories}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {categories.map((cat) => {
                          const isSelected = field.state.value.includes(cat.id)
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  field.handleChange(
                                    field.state.value.filter(
                                      (id) => id !== cat.id,
                                    ),
                                  )
                                } else {
                                  field.handleChange([
                                    ...field.state.value,
                                    cat.id,
                                  ])
                                }
                              }}
                              className={`inline-flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                isSelected
                                  ? 'bg-(--brand-orange) text-white shadow-xs'
                                  : 'border border-(--brand-line) bg-background text-(--brand-muted) hover:border-(--brand-orange) hover:text-(--brand-ink)'
                              }`}
                            >
                              {cat.name}
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

          {/* Sticky Modal Footer */}
          <DialogFooter className="shrink-0 border-t border-(--brand-line) bg-card/95 p-3.5 sm:p-4 backdrop-blur-xs flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
              className="h-11 w-full sm:h-10 sm:w-auto cursor-pointer rounded-xl border border-(--brand-line) bg-background/60 px-4 text-xs font-semibold text-(--brand-ink) transition hover:bg-muted sm:text-sm"
            >
              {techFormCopy.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full sm:h-10 sm:w-auto cursor-pointer gap-2 rounded-xl bg-(--brand-orange) px-5 text-xs font-bold text-white shadow-xs transition hover:bg-(--brand-orange-deep) active:scale-[0.98] disabled:opacity-50 sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {techFormCopy.saving}
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  {techFormCopy.save}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
