import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2, Zap } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { TechIcon } from '#/components/ui/tech-icon'
import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/queries'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [icon, setIcon] = useState(initialData?.icon ?? '')
  const [color, setColor] = useState(initialData?.color ?? '')
  const [url, setUrl] = useState(initialData?.url ?? '')
  const [isUltimate, setIsUltimate] = useState(initialData?.isUltimate ?? false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categoryIds ?? [],
  )

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories')
        const json: { data?: CategoryRecord[] } = await res.json()
        setCategories(json.data ?? [])
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setIsLoadingCategories(false)
      }
    }
    void loadCategories()
  }, [])

  const handleNameChange = (val: string) => {
    setName(val)
    if (mode === 'create' || !initialData) {
      setSlug(slugify(val))
    }
  }

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        icon: icon.trim() || null,
        color: color.trim() || null,
        url: url.trim() || null,
        isUltimate,
        categoryIds: selectedCategoryIds,
      }

      if (!payload.name || !payload.slug) {
        throw new Error('Nama dan Slug wajib diisi.')
      }

      const isEdit = mode === 'edit' && initialData?.id
      const targetUrl = '/api/technologies'
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
        throw new Error(result.error ?? 'Gagal menyimpan teknologi.')
      }

      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Terjadi kesalahan.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    if (!confirm(`Apakah Anda yakin ingin menghapus teknologi "${initialData.name}"?`)) {
      return
    }

    setError(null)
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/technologies?id=${initialData.id}`, {
        method: 'DELETE',
      })
      const result: { error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(result.error ?? 'Gagal menghapus teknologi.')
      }

      void navigate({ to: '/dashboard/stack' })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Terjadi kesalahan.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
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
        {/* Name & Slug */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-(--brand-ink)">
              Nama Teknologi <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. React"
              className="mt-2 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-bold text-(--brand-ink)">
              Slug URL <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. react"
              className="mt-2 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Icon & Color */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="icon" className="block text-sm font-bold text-(--brand-ink)">
              Icon URL
            </label>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-(--brand-line) bg-(--surface-strong)">
                <TechIcon src={icon} name={name} color={color} className="size-6" />
              </div>
              <input
                id="icon"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="https://... atau /assets/..."
                className="w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-(--brand-muted)">
              Masukkan URL gambar icon (SVG/PNG/WebP).
            </p>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-bold text-(--brand-ink)">
              Warna Hex / CSS
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={color && color.startsWith('#') ? color : '#61DAFB'}
                onChange={(e) => setColor(e.target.value)}
                className="size-10 shrink-0 cursor-pointer rounded-xl border border-(--brand-line) bg-transparent p-1"
              />
              <input
                id="color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#61DAFB"
                className="w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-bold text-(--brand-ink)">
            Official Website URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://react.dev"
            className="mt-2 w-full rounded-xl border border-(--brand-line) bg-(--surface-strong) px-4 py-2.5 text-sm text-(--brand-ink) focus:border-(--brand-orange) focus:outline-none"
          />
        </div>

        {/* Ultimate Tech Stack Toggle */}
        <div className="rounded-xl border border-(--brand-orange-soft) bg-(--brand-orange-soft)/10 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-(--brand-orange) text-white shadow-sm">
                <Zap className="size-4 fill-white" />
              </div>
              <div>
                <span className="font-bold text-sm text-(--brand-ink)">
                  Ultimate Tech Stack
                </span>
                <p className="text-xs text-(--brand-muted)">
                  Tampilkan di bagian paling atas halaman Stack dan Marquee Homepage.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isUltimate}
              onChange={(e) => setIsUltimate(e.target.checked)}
              className="size-5 accent-(--brand-orange) cursor-pointer"
            />
          </label>
        </div>

        {/* Category Mappings */}
        <div>
          <label className="block text-sm font-bold text-(--brand-ink) mb-2">
            Kategori Teknologi
          </label>
          {isLoadingCategories ? (
            <p className="text-xs text-(--brand-muted)">Memuat kategori...</p>
          ) : categories.length === 0 ? (
            <p className="text-xs text-(--brand-muted)">
              Belum ada kategori. Silakan buat kategori baru terlebih dahulu.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
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
            {isDeleting ? 'Hapus...' : 'Hapus Teknologi'}
          </button>
        ) : <div />}

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
            {isSaving ? 'Menyimpan...' : 'Simpan Teknologi'}
          </button>
        </div>
      </div>
    </form>
  )
}
