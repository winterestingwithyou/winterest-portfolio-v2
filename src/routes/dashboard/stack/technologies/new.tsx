import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { TechnologyEditorForm } from '#/features/technologies/technology-editor-form'

export const Route = createFileRoute('/dashboard/stack/technologies/new')({
  component: DashboardTechnologyNew,
})

function DashboardTechnologyNew() {
  return (
    <DashboardShell
      title="Tambah Teknologi Baru"
      description="Tambahkan teknologi, framework, atau tool ke personal tech stack."
    >
      <TechnologyEditorForm mode="create" />
    </DashboardShell>
  )
}
