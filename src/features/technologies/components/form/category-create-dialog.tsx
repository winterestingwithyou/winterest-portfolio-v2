import { useForm } from '@tanstack/react-form'
import { AlertCircle, FolderPlus, Loader2, Plus } from 'lucide-react'
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
import { getDashboardCopy } from '#/features/dashboard/copy'
import { useCreateCategory } from '#/features/technologies/hooks'
import type { CategoryRecord } from '#/features/technologies/queries'
import { getCategoryFormSchema } from '#/features/technologies/validation'
import { getApiErrorMessage } from '#/lib/api-client'
import { slugify } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

type CategoryCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultSortOrder?: number
  onSuccess?: (newCategory: CategoryRecord) => void
}

export function CategoryCreateDialog({
  open,
  onOpenChange,
  defaultSortOrder = 0,
  onSuccess,
}: CategoryCreateDialogProps) {
  const copy = getDashboardCopy()
  const techFormCopy = copy.stack.techForm
  const categoryFormCopy = copy.stack.categoryForm
  const locale = getLocale() === 'id' ? 'id' : 'en'

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateCategory()

  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      sortOrder: defaultSortOrder,
    },
    validators: {
      onSubmit: getCategoryFormSchema(locale),
    },
    onSubmit: async ({ value }) => {
      setError(null)
      setIsSaving(true)

      try {
        const payload = {
          name: value.name.trim(),
          slug: value.slug.trim(),
          sortOrder: Number(value.sortOrder),
        }

        const newCategory = await createMutation.mutateAsync(payload)
        form.reset()
        onSuccess?.(newCategory)
        onOpenChange(false)
      } catch (caught) {
        setError(getApiErrorMessage(caught, categoryFormCopy.saveError))
      } finally {
        setIsSaving(false)
      }
    },
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setError(null)
      form.reset()
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden border border-(--brand-line) bg-card p-0 text-card-foreground shadow-2xl sm:max-w-md">
        {/* Sticky Header with responsive padding */}
        <DialogHeader className="shrink-0 border-b border-(--brand-line) bg-card/95 p-4 pr-11 sm:p-5 sm:pr-12 text-left backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-(--brand-line) bg-(--brand-orange-soft) text-(--brand-orange) sm:size-10">
              <FolderPlus className="size-4.5 sm:size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="truncate text-base font-bold tracking-tight text-(--brand-ink) sm:text-lg">
                {techFormCopy.quickAddTitle}
              </DialogTitle>
              <DialogDescription className="mt-0.5 line-clamp-2 text-xs text-(--brand-muted)">
                {techFormCopy.quickAddDescription}
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
              {/* Category Name */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={`dialog-${field.name}`}
                        className="text-xs font-bold text-(--brand-ink)"
                      >
                        {categoryFormCopy.name}{' '}
                        <span className="font-bold text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={`dialog-${field.name}`}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const val = e.target.value
                          field.handleChange(val)
                          form.setFieldValue('slug', slugify(val))
                        }}
                        placeholder={categoryFormCopy.namePlaceholder}
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

              {/* Category Slug */}
              <form.Field
                name="slug"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={`dialog-${field.name}`}
                        className="text-xs font-bold text-(--brand-ink)"
                      >
                        {categoryFormCopy.slug}{' '}
                        <span className="font-bold text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={`dialog-${field.name}`}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={categoryFormCopy.slugPlaceholder}
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

              {/* Sort Order */}
              <form.Field
                name="sortOrder"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={`dialog-${field.name}`}
                        className="text-xs font-bold text-(--brand-ink)"
                      >
                        {categoryFormCopy.sortOrder}
                      </FieldLabel>
                      <Input
                        id={`dialog-${field.name}`}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === '' ? 0 : Number(e.target.value),
                          )
                        }
                        placeholder={categoryFormCopy.sortOrderPlaceholder}
                        aria-invalid={isInvalid}
                        className="h-11 rounded-xl border border-(--brand-line) bg-background text-base text-(--brand-ink) placeholder:text-(--brand-muted)/50 focus-visible:border-(--brand-orange) focus-visible:ring-2 focus-visible:ring-(--brand-orange)/20 sm:text-sm"
                      />
                      <FieldDescription className="text-[11px] text-(--brand-muted)">
                        {categoryFormCopy.sortOrderDesc}
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </div>

          {/* Sticky Modal Footer (responsive flex-col-reverse on mobile, flex-row on desktop) */}
          <DialogFooter className="shrink-0 border-t border-(--brand-line) bg-card/95 p-3.5 sm:p-4 backdrop-blur-xs flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
              className="h-11 w-full sm:h-10 sm:w-auto cursor-pointer rounded-xl border border-(--brand-line) bg-background/60 px-4 text-xs font-semibold text-(--brand-ink) transition hover:bg-muted sm:text-sm"
            >
              {categoryFormCopy.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full sm:h-10 sm:w-auto cursor-pointer gap-2 rounded-xl bg-(--brand-orange) px-5 text-xs font-bold text-white shadow-xs transition hover:bg-(--brand-orange-deep) active:scale-[0.98] disabled:opacity-50 sm:text-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {categoryFormCopy.saving}
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  {categoryFormCopy.save}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
