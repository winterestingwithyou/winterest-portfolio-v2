import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { TechnologyEditorForm } from '#/features/technologies/components/form/technology-editor-form'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { techQueryOptions } from '#/features/technologies/query-options'

type DashboardTechnologyEditPageProps = {
  id: string
}

export function DashboardTechnologyEditPage({
  id,
}: DashboardTechnologyEditPageProps) {
  const commonCopy = getDashboardCopy().common
  const copy = getTechnologiesCopy().dashboard
  const {
    data: tech,
    refetch,
    isFetching,
  } = useSuspenseQuery(techQueryOptions.detail(id))

  return (
    <DashboardShell
      title={`${copy.editTechnology}: ${tech.name}`}
      description={copy.editTechnologyDesc}
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
          {commonCopy.refresh}
        </button>
      }
    >
      <TechnologyEditorForm mode="edit" initialData={tech} />
    </DashboardShell>
  )
}
