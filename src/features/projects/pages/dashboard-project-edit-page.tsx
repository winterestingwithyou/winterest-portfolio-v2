import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ProjectEditorForm } from '#/features/projects/components/form/project-editor-form'
import { projectQueryOptions } from '#/features/projects/query-options'

type DashboardProjectEditPageProps = {
  id: string
}

export function DashboardProjectEditPage({
  id,
}: DashboardProjectEditPageProps) {
  const copy = getDashboardCopy()
  const {
    data: project,
    refetch,
    isFetching,
  } = useSuspenseQuery(projectQueryOptions.detail(id))

  return (
    <DashboardShell
      title={project.title}
      description={copy.projects.editDescription}
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
          {copy.common.refresh}
        </button>
      }
    >
      <ProjectEditorForm mode="edit" project={project} />
    </DashboardShell>
  )
}
