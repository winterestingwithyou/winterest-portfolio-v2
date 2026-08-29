import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ProjectEditorForm } from '#/features/projects/components/form/project-editor-form'

export function DashboardProjectNewPage() {
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
