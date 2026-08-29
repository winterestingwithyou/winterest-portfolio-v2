import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '#/features/technologies/hooks'
import type { CategoryRecord } from '#/features/technologies/queries'
import { getApiErrorMessage } from '#/lib/api-client'
import { slugify } from '#/lib/utils'

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi.'),
  slug: z
    .string()
    .min(1, 'Slug URL wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  sortOrder: z.number(),
})

type CategoryEditorFormProps = {
  mode: 'create' | 'edit'
  initialData?: CategoryRecord | null
}

export function CategoryEditorForm({
  mode,
  initialData,
}: CategoryEditorFormProps) {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory(initialData?.id ?? '')
  const deleteMutation = useDeleteCategory()

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      sortOrder: initialData?.sortOrder ?? 0,
    },
    validators: {
      onSubmit: categorySchema,
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

        if (mode === 'edit' && initialData?.id) {
          await updateMutation.mutateAsync(payload)
        } else {
          await createMutation.mutateAsync(payload)
        }

        void navigate({ to: '/dashboard/stack' })
      } catch (caught) {
        setError(getApiErrorMessage(caught, 'Gagal menyimpan kategori.'))
      } finally {
        setIsSaving(false)
      }
    },
  })

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus kategori "${initialData.name}"?`,
      )
    ) {
      return
    }

    setError(null)
    setIsDeleting(true)

    try {
      await deleteMutation.mutateAsync(initialData.id)
      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(getApiErrorMessage(caught, 'Gagal menghapus kategori.'))
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
      {/* Header Link */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/dashboard/stack"
          className="inline-flex items-center gap-2 text-sm font-bold text-(--brand-orange-deep) no-underline hover:-translate-x-0.5 transition"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Kembali ke Stack Management
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          {error}
        </div>
      ) : null}

      <div className="surface-card space-y-6 p-6 sm:p-8">
        <FieldGroup>
          {/* Name Field */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nama Kategori <span className="text-red-500">*</span>
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
                    placeholder="e.g. Frontend"
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

          {/* Slug Field */}
          <form.Field
            name="slug"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Slug URL <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. frontend"
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

          {/* Sort Order Field */}
          <form.Field
            name="sortOrder"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Urutan Tampil (Sort Order)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value))
                    }
                    placeholder="1"
                    aria-invalid={isInvalid}
                    className="h-11 font-mono rounded-xl border-(--brand-line) bg-surface text-sm"
                  />
                  <FieldDescription>
                    Angka lebih kecil akan ditampilkan lebih awal pada daftar kategori.
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

      {/* Form Action Footer */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {mode === 'edit' && initialData ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isDeleting || isSaving}
            className="gap-2 rounded-full bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Hapus...' : 'Hapus Kategori'}
          </Button>
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
            <Link to="/dashboard/stack">Batal</Link>
          </Button>

          <Button
            type="submit"
            disabled={isSaving || isDeleting}
            className="gap-2 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Kategori'}
          </Button>
        </div>
      </div>
    </form>
  )
}
