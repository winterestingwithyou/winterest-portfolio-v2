import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { TechnologyEditorForm } from '#/features/technologies/components/form/technology-editor-form'

export function DashboardTechnologyNewPage() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.stack.newTechnology}
      description={copy.stack.newTechnologyDesc}
    >
      <TechnologyEditorForm mode="create" />
    </DashboardShell>
  )
}
