import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FolderTree, Layers, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { DashboardCategoriesTable } from '#/features/technologies/components/table/dashboard-categories-table'
import { DashboardTechTable } from '#/features/technologies/components/table/dashboard-tech-table'
import {
  useDeleteCategory,
  useDeleteTechnology,
} from '#/features/technologies/hooks'
import {
  categoryQueryOptions,
  techQueryOptions,
} from '#/features/technologies/query-options'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { getApiErrorMessage } from '#/lib/api-client'

type ActiveTab = 'technologies' | 'categories'

export function DashboardStackPage() {
  const copy = getDashboardCopy()
  const stackCopy = copy.stack
  const [activeTab, setActiveTab] = useState<ActiveTab>('technologies')
  const [error, setError] = useState<string | null>(null)

  const {
    data: categories,
    refetch: refetchCategories,
    isFetching: isFetchingCategories,
  } = useSuspenseQuery(categoryQueryOptions.list())

  const {
    data: technologies,
    refetch: refetchTechnologies,
    isFetching: isFetchingTechnologies,
  } = useSuspenseQuery(techQueryOptions.list())

  const deleteCategoryMutation = useDeleteCategory()
  const deleteTechMutation = useDeleteTechnology()

  const isFetching = isFetchingCategories || isFetchingTechnologies

  const loadData = async () => {
    setError(null)
    await Promise.all([refetchCategories(), refetchTechnologies()])
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(stackCopy.deleteCategoryConfirm(name))) return
    setError(null)
    try {
      await deleteCategoryMutation.mutateAsync(id)
    } catch (err) {
      setError(getApiErrorMessage(err, stackCopy.deleteCategoryError))
    }
  }

  const handleDeleteTech = async (id: string, name: string) => {
    if (!confirm(stackCopy.deleteTechConfirm(name))) return
    setError(null)
    try {
      await deleteTechMutation.mutateAsync(id)
    } catch (err) {
      setError(getApiErrorMessage(err, stackCopy.deleteTechError))
    }
  }

  return (
    <DashboardShell
      title={stackCopy.heading}
      description={stackCopy.subheading}
      actions={
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={isFetching}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
          >
            <RefreshCw
              className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {copy.common.refresh}
          </button>
          {activeTab === 'technologies' ? (
            <Link
              to="/dashboard/stack/technologies/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              {stackCopy.actions.addTechnology}
            </Link>
          ) : (
            <Link
              to="/dashboard/stack/categories/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              {stackCopy.actions.addCategory}
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
          {stackCopy.tabs.technologies} ({technologies.length})
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
          {stackCopy.tabs.categories} ({categories.length})
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
            isLoading={false}
            onDeleteTech={handleDeleteTech}
          />
        ) : (
          <DashboardCategoriesTable
            categories={categories}
            isLoading={false}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </div>
    </DashboardShell>
  )
}
