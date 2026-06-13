import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ProjectEditorForm } from '#/features/dashboard/ProjectEditorForm'

export const Route = createFileRoute('/dashboard/projects/new')({
  component: DashboardProjectNew,
})

function DashboardProjectNew() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.projects.newTitle}
      description={copy.projects.newDescription}
    >
      <ProjectEditorForm mode="create" />
    </DashboardShell>
  )
}
