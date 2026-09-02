import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2, Zap } from 'lucide-react'
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
import type { TechnologyWithCategories } from '#/features/technologies/queries'
import { getApiErrorMessage } from '#/lib/api-client'
import { slugify } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'
import { getTechnologyFormSchema } from '#/features/technologies/validation'

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
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateTechnology()
  const updateMutation = useUpdateTechnology(initialData?.id ?? '')
  const deleteMutation = useDeleteTechnology()

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      icon: initialData?.icon ?? '',
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
        const payload = {
          name: value.name.trim(),
          slug: value.slug.trim(),
          icon: value.icon.trim() || null,
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

  return (
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
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {formCopy.icon}
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-(--brand-line) bg-(--surface-strong)">
                        <form.Subscribe
                          selector={(state) => [
                            state.values.name,
                            state.values.color,
                          ]}
                          children={([currentName, currentColor]) => (
                            <TechIcon
                              src={field.state.value}
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={formCopy.iconPlaceholder}
                        aria-invalid={isInvalid}
                        className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                      />
                    </div>
                    <FieldDescription>{formCopy.iconDesc}</FieldDescription>
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
                          field.state.value && field.state.value.startsWith('#')
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
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                <FieldLabel>{formCopy.categoriesTitle}</FieldLabel>
                {isLoadingCategories ? (
                  <p className="text-xs text-(--brand-muted)">
                    {formCopy.categoriesLoading}
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-(--brand-muted)">
                    {formCopy.noCategories}
                  </p>
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
                                field.state.value.filter((id) => id !== cat.id),
                              )
                            } else {
                              field.handleChange([...field.state.value, cat.id])
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-(--brand-orange) text-white shadow-sm'
                              : 'border border-(--brand-line) bg-(--surface-strong) text-(--brand-muted) hover:border-(--brand-orange)'
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

      {/* Form Action Footer */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {mode === 'edit' && initialData ? (
          <>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting || isSaving}
              className="gap-2 rounded-full bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-50"
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
          <div />
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            asChild
            className="rounded-full border-(--brand-line) font-bold text-(--brand-ink) hover:bg-surface-soft"
          >
            <Link to="/dashboard/stack">{formCopy.cancel}</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSaving || isDeleting}
            className="gap-2 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {isSaving ? formCopy.saving : formCopy.save}
          </Button>
        </div>
      </div>
    </form>
  )
}
