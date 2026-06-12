import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ContentEditorForm } from '#/features/dashboard/ContentEditorForm'

export const Route = createFileRoute('/dashboard/lab/new')({
  component: DashboardLabNew,
})

function DashboardLabNew() {
  return (
    <DashboardShell
      title="New Lab Entry"
      description="Create a lab draft for experiments, notes, and mini demos."
    >
      <ContentEditorForm kind="lab" mode="create" />
    </DashboardShell>
  )
}
