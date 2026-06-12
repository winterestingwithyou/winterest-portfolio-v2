import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ContentEditorForm } from '#/features/dashboard/ContentEditorForm'

export const Route = createFileRoute('/dashboard/writing/new')({
  component: DashboardWritingNew,
})

function DashboardWritingNew() {
  return (
    <DashboardShell
      title="New Article"
      description="Create a writing draft for the public technical notes section."
    >
      <ContentEditorForm kind="writing" mode="create" />
    </DashboardShell>
  )
}
