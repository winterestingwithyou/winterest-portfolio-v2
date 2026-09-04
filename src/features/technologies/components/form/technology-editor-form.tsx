import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus, Save, Trash2, Zap } from 'lucide-react'
import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

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
import { TechIcon } from '#/components/ui/tech-icon'
import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  useCreateTechnology,
  useDeleteTechnology,
  useUpdateTechnology,
} from '#/features/technologies/hooks'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/queries'
import { CategoryCreateDialog } from './category-create-dialog'
import { getApiErrorMessage } from '#/lib/api-client'
import { cn, slugify } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'
import { getTechnologyFormSchema } from '#/features/technologies/validation'

const SIMPLE_ICONS_PREFIX = 'https://cdn.simpleicons.org/'

function parseInitialIcon(icon?: string | null): {
  source: 'simpleicons' | 'custom'
  value: string
} {
  if (!icon) {
    return { source: 'simpleicons', value: '' }
  }
  if (icon.startsWith(SIMPLE_ICONS_PREFIX)) {
    return {
      source: 'simpleicons',
      value: icon.slice(SIMPLE_ICONS_PREFIX.length),
    }
  }
  return { source: 'custom', value: icon }
}

type TechnologyEditorFormProps = {
  mode: 'create' | 'edit'
  initialData?: TechnologyWithCategories | null
}

export function TechnologyEditorForm({
  mode,
  initialData,
}: TechnologyEditorFormProps) {
  const copy = getDashboardCopy()
  const formCopy = copy.stack.techForm
  const locale = getLocale() === 'id' ? 'id' : 'en'
  const navigate = useNavigate()
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery(
    categoryQueryOptions.list(),
  )
  const initialIcon = parseInitialIcon(initialData?.icon)
  const [iconSource, setIconSource] = useState<'simpleicons' | 'custom'>(
    initialIcon.source,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateTechnology()
  const updateMutation = useUpdateTechnology(initialData?.id ?? '')
  const deleteMutation = useDeleteTechnology()

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      icon: initialIcon.value,
      color: initialData?.color ?? '',
      url: initialData?.url ?? '',
      isUltimate: initialData?.isUltimate ?? false,
      categoryIds: initialData?.categoryIds ?? [],
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
          isUltimate: value.isUltimate,
          categoryIds: value.categoryIds,
        }

        if (mode === 'edit' && initialData?.id) {
          await updateMutation.mutateAsync(payload)
        } else {
          await createMutation.mutateAsync(payload)
        }

        void navigate({ to: '/dashboard/stack' })
      } catch (caught) {
        setError(getApiErrorMessage(caught, formCopy.saveError))
      } finally {
        setIsSaving(false)
      }
    },
  })

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

  const handleDelete = async () => {
    if (!initialData?.id) return

    setError(null)
    setIsDeleting(true)

    try {
      await deleteMutation.mutateAsync(initialData.id)
      setIsDeleteDialogOpen(false)
      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(getApiErrorMessage(caught, formCopy.deleteError))
      setIsDeleteDialogOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCategoryCreated = (newCategory: CategoryRecord) => {
    const currentCategoryIds = form.getFieldValue('categoryIds')
    if (!currentCategoryIds.includes(newCategory.id)) {
      form.setFieldValue('categoryIds', [...currentCategoryIds, newCategory.id])
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
        className="w-full space-y-6"
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/dashboard/stack"
            className="inline-flex items-center gap-2 text-sm font-bold text-(--brand-orange-deep) no-underline hover:-translate-x-0.5 transition"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {copy.stack.actions.backToStack}
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
            {error}
          </div>
        ) : null}

        <div className="surface-card space-y-6 p-6 sm:p-8">
          <FieldGroup>
            {/* Name & Slug Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {formCopy.name} <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const val = e.target.value
                          field.handleChange(val)
                          if (mode === 'create' || !initialData) {
                            form.setFieldValue('slug', slugify(val))
                          }
                        }}
                        placeholder={formCopy.namePlaceholder}
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

              <form.Field
                name="slug"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
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
                        className="h-11 font-mono rounded-xl border-(--brand-line) bg-surface text-sm"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* Icon & Color Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
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
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center justify-between gap-2">
                        <FieldLabel htmlFor={field.name}>
                          {iconSource === 'simpleicons'
                            ? formCopy.simpleIconsSlug
                            : formCopy.customIconUrl}
                        </FieldLabel>
                        <div className="inline-flex rounded-lg border border-(--brand-line) bg-(--surface-strong) p-0.5 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => handleSourceChange('simpleicons')}
                            className={cn(
                              'rounded-md px-2.5 py-0.5 transition cursor-pointer',
                              iconSource === 'simpleicons'
                                ? 'bg-(--brand-orange) text-white shadow-xs'
                                : 'text-(--brand-muted) hover:text-(--brand-ink)',
                            )}
                          >
                            {formCopy.iconSourceSimple}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSourceChange('custom')}
                            className={cn(
                              'rounded-md px-2.5 py-0.5 transition cursor-pointer',
                              iconSource === 'custom'
                                ? 'bg-(--brand-orange) text-white shadow-xs'
                                : 'text-(--brand-muted) hover:text-(--brand-ink)',
                            )}
                          >
                            {formCopy.iconSourceCustom}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-(--brand-line) bg-(--surface-strong)">
                          <form.Subscribe
                            selector={(state) => [
                              state.values.name,
                              state.values.color,
                            ]}
                            children={([currentName, currentColor]) => (
                              <TechIcon
                                src={currentPreviewUrl}
                                name={currentName}
                                color={currentColor}
                                className="size-6"
                              />
                            )}
                          />
                        </div>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            let val = e.target.value
                            if (
                              iconSource === 'simpleicons' &&
                              val.startsWith(SIMPLE_ICONS_PREFIX)
                            ) {
                              val = val.slice(SIMPLE_ICONS_PREFIX.length)
                            }
                            field.handleChange(val)
                          }}
                          placeholder={
                            iconSource === 'simpleicons'
                              ? formCopy.simpleIconsSlugPlaceholder
                              : formCopy.customIconUrlPlaceholder
                          }
                          aria-invalid={isInvalid}
                          className="h-11 font-mono rounded-xl border-(--brand-line) bg-surface text-sm"
                        />
                      </div>
                      <FieldDescription>
                        {iconSource === 'simpleicons' ? (
                          <>
                            {formCopy.simpleIconsDesc}{' '}
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
                          formCopy.customIconDesc
                        )}
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="color"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        {formCopy.color}
                      </FieldLabel>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={
                            field.state.value &&
                            field.state.value.startsWith('#')
                              ? field.state.value
                              : '#61DAFB'
                          }
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="size-11 shrink-0 cursor-pointer rounded-xl border border-(--brand-line) bg-transparent p-1"
                        />
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={formCopy.colorPlaceholder}
                          aria-invalid={isInvalid}
                          className="h-11 font-mono rounded-xl border-(--brand-line) bg-surface text-sm"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* Website URL */}
            <form.Field
              name="url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.websiteUrl}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={formCopy.websiteUrlPlaceholder}
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

            {/* Ultimate Tech Stack Toggle */}
            <form.Field
              name="isUltimate"
              children={(field) => (
                <div className="rounded-xl border border-(--brand-orange-soft) bg-(--brand-orange-soft)/10 p-4">
                  <Field
                    orientation="horizontal"
                    className="justify-between items-center cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-(--brand-orange) text-white shadow-sm">
                        <Zap className="size-4 fill-white" />
                      </div>
                      <FieldContent>
                        <FieldLabel
                          htmlFor={field.name}
                          className="font-bold text-sm text-(--brand-ink) cursor-pointer"
                        >
                          {formCopy.ultimateTitle}
                        </FieldLabel>
                        <FieldDescription>
                          {formCopy.ultimateDesc}
                        </FieldDescription>
                      </FieldContent>
                    </div>
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

            {/* Category Mappings */}
            <form.Field
              name="categoryIds"
              children={(field) => (
                <Field>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel>{formCopy.categoriesTitle}</FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setIsCategoryDialogOpen(true)}
                      className="h-7 cursor-pointer gap-1.5 rounded-full border border-(--brand-line) bg-card px-3 text-xs font-semibold text-(--brand-orange-deep) shadow-2xs transition-all hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)/20 hover:text-(--brand-orange)"
                    >
                      <Plus className="size-3.5 text-(--brand-orange)" />
                      {formCopy.addCategoryBtn}
                    </Button>
                  </div>
                  {isLoadingCategories ? (
                    <p className="text-xs text-(--brand-muted)">
                      {formCopy.categoriesLoading}
                    </p>
                  ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--brand-line) bg-(--brand-orange-soft)/5 p-6 text-center">
                      <p className="mb-3 text-xs text-(--brand-muted)">
                        {formCopy.noCategories}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setIsCategoryDialogOpen(true)}
                        className="h-9 cursor-pointer gap-1.5 rounded-full bg-(--brand-orange) px-4 text-xs font-bold text-white shadow-xs transition hover:bg-(--brand-orange-deep)"
                      >
                        <Plus className="size-3.5" />
                        {formCopy.addCategoryEmpty}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
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
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none',
                              isSelected
                                ? 'bg-(--brand-orange) text-white shadow-xs'
                                : 'border border-(--brand-line) bg-card text-(--brand-muted) hover:border-(--brand-orange)/60 hover:text-(--brand-ink)',
                            )}
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

        {/* Form Action Footer */}
        <div className="flex flex-col-reverse gap-3 pt-6 border-t border-(--brand-line) sm:flex-row sm:items-center sm:justify-between">
          {mode === 'edit' && initialData ? (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting || isSaving}
                className="w-full sm:w-auto min-h-11 sm:min-h-9 gap-2 rounded-xl sm:rounded-full bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                {isDeleting ? formCopy.deleting : formCopy.delete}
              </Button>

              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{formCopy.delete}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {formCopy.deleteConfirm(initialData.name)}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      {formCopy.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={(e) => {
                        e.preventDefault()
                        void handleDelete()
                      }}
                    >
                      {isDeleting ? formCopy.deleting : formCopy.delete}
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
              <Link to="/dashboard/stack">{formCopy.cancel}</Link>
            </Button>

            <Button
              type="submit"
              disabled={isSaving || isDeleting}
              className="w-full sm:w-auto min-h-11 sm:min-h-9 order-1 sm:order-2 gap-2 rounded-xl sm:rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
            >
              <Save className="size-4" />
              {isSaving ? formCopy.saving : formCopy.save}
            </Button>
          </div>
        </div>
      </form>

      <CategoryCreateDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        defaultSortOrder={categories.length}
        onSuccess={handleCategoryCreated}
      />
    </>
  )
}
