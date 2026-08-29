import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { CategoryEditorForm } from '#/features/technologies/components/form/category-editor-form'
import { categoryQueryOptions } from '#/features/technologies/query-options'

type DashboardCategoryEditPageProps = {
  id: string
}

export function DashboardCategoryEditPage({
  id,
}: DashboardCategoryEditPageProps) {
  const { data: category, refetch, isFetching } = useSuspenseQuery(
    categoryQueryOptions.detail(id),
  )

  return (
    <DashboardShell
      title={`Edit ${category.name}`}
      description="Perbarui informasi kategori teknologi."
      actions={
        <button
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
        >
          <RefreshCw
            aria-hidden="true"
            className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      }
    >
      <CategoryEditorForm mode="edit" initialData={category} />
    </DashboardShell>
  )
}
