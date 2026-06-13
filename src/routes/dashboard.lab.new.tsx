import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ContentEditorForm } from '#/features/dashboard/ContentEditorForm'

export const Route = createFileRoute('/dashboard/lab/new')({
  component: DashboardLabNew,
})

function DashboardLabNew() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.lab.newTitle}
      description={copy.lab.newDescription}
    >
      <ContentEditorForm kind="lab" mode="create" />
    </DashboardShell>
  )
}
