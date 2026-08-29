import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { TechnologyEditorForm } from '#/features/technologies/components/form/technology-editor-form'
import { techQueryOptions } from '#/features/technologies/query-options'

type DashboardTechnologyEditPageProps = {
  id: string
}

export function DashboardTechnologyEditPage({
  id,
}: DashboardTechnologyEditPageProps) {
  const { data: tech, refetch, isFetching } = useSuspenseQuery(
    techQueryOptions.detail(id),
  )

  return (
    <DashboardShell
      title={`Edit ${tech.name}`}
      description="Perbarui informasi teknologi, icon, atau kategori terkait."
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
      <TechnologyEditorForm mode="edit" initialData={tech} />
    </DashboardShell>
  )
}
