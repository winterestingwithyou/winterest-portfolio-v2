import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ProjectEditorForm } from '#/features/dashboard/ProjectEditorForm'

export const Route = createFileRoute('/dashboard/projects/new')({
  component: DashboardProjectNew,
})

function DashboardProjectNew() {
  return (
    <DashboardShell
      title="New Project"
      description="Create flow shell for the D1-backed project CMS."
    >
      <ProjectEditorForm mode="create" />
    </DashboardShell>
  )
}
