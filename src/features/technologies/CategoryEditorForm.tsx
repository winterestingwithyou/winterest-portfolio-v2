import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

import type { CategoryRecord } from '#/features/technologies/queries'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type CategoryEditorFormProps = {
  mode: 'create' | 'edit'
  initialData?: CategoryRecord | null
}

export function CategoryEditorForm({
  mode,
  initialData,
}: CategoryEditorFormProps) {
  const navigate = useNavigate()

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [sortOrder, setSortOrder] = useState<number>(
    initialData?.sortOrder ?? 0,
  )

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNameChange = (val: string) => {
    setName(val)
    if (mode === 'create' || !initialData) {
      setSlug(slugify(val))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        sortOrder: Number(sortOrder),
      }

      if (!payload.name || !payload.slug) {
        throw new Error('Nama dan Slug wajib diisi.')
      }

      const isEdit = mode === 'edit' && initialData?.id
      const targetUrl = '/api/categories'
      const method = isEdit ? 'PUT' : 'POST'
      const body = isEdit
        ? JSON.stringify({ id: initialData.id, ...payload })
        : JSON.stringify(payload)

      const res = await fetch(targetUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      const result: { error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(result.error ?? 'Gagal menyimpan kategori.')
      }

      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Terjadi kesalahan.')
    } finally {
      setIsSaving(false)
    }
  }

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
      const res = await fetch(`/api/categories?id=${initialData.id}`, {
        method: 'DELETE',
      })
      const result: { error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(result.error ?? 'Gagal menghapus kategori.')
      }

      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Terjadi kesalahan.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
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
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-(--brand-ink)"
          >
            Nama Kategori <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Frontend"
            className="mt-2 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-bold text-(--brand-ink)"
          >
            Slug URL <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. frontend"
            className="mt-2 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none font-mono"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-bold text-(--brand-ink)"
          >
            Urutan Tampil (Sort Order)
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="1"
            className="mt-2 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none font-mono"
          />
          <p className="mt-1 text-xs text-(--brand-muted)">
            Angka lebih kecil akan ditampilkan lebih awal pada daftar kategori.
          </p>
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {mode === 'edit' && initialData ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Hapus...' : 'Hapus Kategori'}
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/stack"
            className="inline-flex min-h-11 items-center rounded-full border border-(--brand-line) bg-(--surface-strong) px-6 text-sm font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange)"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSaving || isDeleting}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-(--brand-orange) px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            <Save className="size-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Kategori'}
          </button>
        </div>
      </div>
    </form>
  )
}
