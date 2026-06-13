import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ContentEditorForm } from '#/features/dashboard/ContentEditorForm'

export const Route = createFileRoute('/dashboard/writing/new')({
  component: DashboardWritingNew,
})

function DashboardWritingNew() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.writing.newTitle}
      description={copy.writing.newDescription}
    >
      <ContentEditorForm kind="writing" mode="create" />
    </DashboardShell>
  )
}
