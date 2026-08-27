import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

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
import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/queries'
import { api, getApiErrorMessage } from '#/lib/api-client'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const technologySchema = z.object({
  name: z.string().min(1, 'Nama teknologi wajib diisi.'),
  slug: z
    .string()
    .min(1, 'Slug URL wajib diisi.')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).',
    ),
  icon: z.string(),
  color: z.string(),
  url: z.string().refine(
    (val) => !val || z.string().url().safeParse(val).success,
    {
      message: 'Format URL tidak valid.',
    },
  ),
  isUltimate: z.boolean(),
  categoryIds: z.array(z.string()),
})

type TechnologyEditorFormProps = {
  mode: 'create' | 'edit'
  initialData?: TechnologyWithCategories | null
}

export function TechnologyEditorForm({
  mode,
  initialData,
}: TechnologyEditorFormProps) {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const json = await api<{ data?: CategoryRecord[] }>('/api/categories')
        setCategories(json.data ?? [])
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    void loadCategories()
  }, [])

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
      onSubmit: technologySchema,
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

        const isEdit = mode === 'edit' && initialData?.id
        await api('/api/technologies', {
          method: isEdit ? 'PUT' : 'POST',
          body: isEdit ? { id: initialData.id, ...payload } : payload,
        })

        void navigate({ to: '/dashboard/stack' })
      } catch (caught) {
        setError(getApiErrorMessage(caught, 'Gagal menyimpan teknologi.'))
      } finally {
        setIsSaving(false)
      }
    },
  })

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus teknologi "${initialData.name}"?`,
      )
    ) {
      return
    }

    setError(null)
    setIsDeleting(true)

    try {
      await api('/api/technologies', {
        method: 'DELETE',
        query: { id: initialData.id },
      })

      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(getApiErrorMessage(caught, 'Gagal menghapus teknologi.'))
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
                      Nama Teknologi <span className="text-red-500">*</span>
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
                      placeholder="e.g. React"
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
                      Slug URL <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. react"
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
                    <FieldLabel htmlFor={field.name}>Icon URL</FieldLabel>
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
                        placeholder="https://... atau /assets/..."
                        aria-invalid={isInvalid}
                        className="h-11 rounded-xl border-(--brand-line) bg-surface text-sm"
                      />
                    </div>
                    <FieldDescription>
                      Masukkan URL gambar icon (SVG/PNG/WebP).
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
                    <FieldLabel htmlFor={field.name}>Warna Hex / CSS</FieldLabel>
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
                        placeholder="#61DAFB"
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
                    Official Website URL
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="url"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://react.dev"
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
                        Ultimate Tech Stack
                      </FieldLabel>
                      <FieldDescription>
                        Tampilkan di bagian paling atas halaman Stack dan Marquee
                        Homepage.
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
                <FieldLabel>Kategori Teknologi</FieldLabel>
                {isLoadingCategories ? (
                  <p className="text-xs text-(--brand-muted)">
                    Memuat kategori...
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-(--brand-muted)">
                    Belum ada kategori. Silakan buat kategori baru terlebih
                    dahulu.
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
                              field.handleChange([
                                ...field.state.value,
                                cat.id,
                              ])
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
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isDeleting || isSaving}
            className="gap-2 rounded-full bg-red-600 font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Hapus...' : 'Hapus Teknologi'}
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
            {isSaving ? 'Menyimpan...' : 'Simpan Teknologi'}
          </Button>
        </div>
      </div>
    </form>
  )
}
