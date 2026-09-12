import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { TechnologyEditorForm } from '#/features/technologies/components/form/technology-editor-form'

export function DashboardTechnologyNewPage() {
  const copy = getTechnologiesCopy().dashboard

  return (
    <DashboardShell
      title={copy.newTechnology}
      description={copy.newTechnologyDesc}
    >
      <TechnologyEditorForm mode="create" />
    </DashboardShell>
  )
}
