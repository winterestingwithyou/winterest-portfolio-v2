import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { TechnologyEditorForm } from '#/features/technologies/components/form/technology-editor-form'

export function DashboardTechnologyNewPage() {
  return (
    <DashboardShell
      title="Tambah Teknologi Baru"
      description="Tambahkan teknologi, framework, atau tool ke personal tech stack."
    >
      <TechnologyEditorForm mode="create" />
    </DashboardShell>
  )
}
