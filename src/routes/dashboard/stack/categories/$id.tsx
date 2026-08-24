import { createFileRoute, Link } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { CategoryEditorForm } from '#/features/technologies/category-editor-form'
import type { CategoryRecord } from '#/features/technologies/queries'

export const Route = createFileRoute('/dashboard/stack/categories/$id')({
  component: DashboardCategoryEdit,
})

function DashboardCategoryEdit() {
  const { id } = Route.useParams()
  const [category, setCategory] = useState<CategoryRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/categories?id=${id}`)
      const result: { data?: CategoryRecord; error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(result.error ?? 'Kategori tidak ditemukan.')
      }

      setCategory(result.data ?? null)
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Gagal memuat data kategori.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadCategory()
  }, [loadCategory])

  return (
    <DashboardShell
      title={category ? `Edit ${category.name}` : 'Edit Kategori'}
      description="Perbarui informasi kategori teknologi."
      actions={
        <button
          type="button"
          onClick={loadCategory}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Refresh
        </button>
      }
    >
      {isLoading ? (
        <div className="surface-card p-6 text-sm font-semibold text-(--brand-muted)">
          Memuat data kategori...
        </div>
      ) : error || !category ? (
        <div className="surface-card max-w-2xl p-6">
          <p className="text-sm leading-7 text-(--brand-muted)">
            {error ?? 'Data kategori tidak tersedia.'}
          </p>
          <Link
            to="/dashboard/stack"
            className="mt-5 inline-flex min-h-10 items-center rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline"
          >
            Kembali
          </Link>
        </div>
      ) : (
        <CategoryEditorForm mode="edit" initialData={category} />
      )}
    </DashboardShell>
  )
}
