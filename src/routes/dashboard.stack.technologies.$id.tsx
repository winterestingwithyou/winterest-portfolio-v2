import { createFileRoute, Link } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import type { TechnologyWithCategories } from '#/features/technologies/queries'
import { TechnologyEditorForm } from '#/features/technologies/TechnologyEditorForm'

export const Route = createFileRoute('/dashboard/stack/technologies/$id')({
  component: DashboardTechnologyEdit,
})

function DashboardTechnologyEdit() {
  const { id } = Route.useParams()
  const [tech, setTech] = useState<TechnologyWithCategories | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTech = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/technologies?id=${id}`)
      const result: { data?: TechnologyWithCategories; error?: string } =
        await res.json()

      if (!res.ok) {
        throw new Error(result.error ?? 'Teknologi tidak ditemukan.')
      }

      setTech(result.data ?? null)
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Gagal memuat data teknologi.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadTech()
  }, [loadTech])

  return (
    <DashboardShell
      title={tech ? `Edit ${tech.name}` : 'Edit Teknologi'}
      description="Perbarui informasi teknologi, icon, atau kategori terkait."
      actions={
        <button
          type="button"
          onClick={loadTech}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Refresh
        </button>
      }
    >
      {isLoading ? (
        <div className="surface-card p-6 text-sm font-semibold text-(--brand-muted)">
          Memuat data teknologi...
        </div>
      ) : error || !tech ? (
        <div className="surface-card max-w-2xl p-6">
          <p className="text-sm leading-7 text-(--brand-muted)">
            {error ?? 'Data teknologi tidak tersedia.'}
          </p>
          <Link
            to="/dashboard/stack"
            className="mt-5 inline-flex min-h-10 items-center rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline"
          >
            Kembali
          </Link>
        </div>
      ) : (
        <TechnologyEditorForm mode="edit" initialData={tech} />
      )}
    </DashboardShell>
  )
}
