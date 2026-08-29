import { Link } from '@tanstack/react-router'
import { FolderTree, Layers, Plus, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { DashboardCategoriesTable } from '#/features/technologies/components/table/dashboard-categories-table'
import { DashboardTechTable } from '#/features/technologies/components/table/dashboard-tech-table'
import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/queries'
import { api, getApiErrorMessage } from '#/lib/api-client'

type ActiveTab = 'technologies' | 'categories'

export function DashboardStackPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('technologies')
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [technologies, setTechnologies] = useState<TechnologyWithCategories[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [catJson, techJson] = await Promise.all([
        api<{ data?: CategoryRecord[] }>('/api/categories'),
        api<{ data?: TechnologyWithCategories[] }>('/api/technologies'),
      ])

      setCategories(catJson.data ?? [])
      setTechnologies(techJson.data ?? [])
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal memuat data stack.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`))
      return
    setError(null)
    try {
      await api('/api/categories', { method: 'DELETE', query: { id } })
      await loadData()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal menghapus kategori.'))
    }
  }

  const handleDeleteTech = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus teknologi "${name}"?`))
      return
    setError(null)
    try {
      await api('/api/technologies', {
        method: 'DELETE',
        query: { id },
      })
      await loadData()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal menghapus teknologi.'))
    }
  }

  return (
    <DashboardShell
      title="Tech Stack & Skills"
      description="Kelola daftar teknologi dan kategori keahlian yang ditampilkan pada portfolio."
      actions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
          {activeTab === 'technologies' ? (
            <Link
              to="/dashboard/stack/technologies/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              Tambah Teknologi
            </Link>
          ) : (
            <Link
              to="/dashboard/stack/categories/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              Tambah Kategori
            </Link>
          )}
        </div>
      }
    >
      {/* Tab Switcher */}
      <div className="mb-6 flex border-b border-(--brand-line)">
        <button
          type="button"
          onClick={() => setActiveTab('technologies')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
            activeTab === 'technologies'
              ? 'border-(--brand-orange) text-(--brand-orange-deep)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <Layers className="size-4" />
          Teknologi ({technologies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition ${
            activeTab === 'categories'
              ? 'border-(--brand-orange) text-(--brand-orange-deep)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <FolderTree className="size-4" />
          Kategori ({categories.length})
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          {error}
        </div>
      ) : null}

      <div className="surface-card overflow-hidden">
        {activeTab === 'technologies' ? (
          <DashboardTechTable
            technologies={technologies}
            categories={categories}
            isLoading={isLoading}
            onDeleteTech={handleDeleteTech}
          />
        ) : (
          <DashboardCategoriesTable
            categories={categories}
            isLoading={isLoading}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </div>
    </DashboardShell>
  )
}
