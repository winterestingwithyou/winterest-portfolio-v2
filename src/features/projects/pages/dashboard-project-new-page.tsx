import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getProjectsCopy } from '#/features/projects/copy'
import { ProjectEditorForm } from '#/features/projects/components/form/project-editor-form'

export function DashboardProjectNewPage() {
  const copy = getProjectsCopy().dashboard

  return (
    <DashboardShell title={copy.newTitle} description={copy.newDescription}>
      <ProjectEditorForm mode="create" />
    </DashboardShell>
  )
}
