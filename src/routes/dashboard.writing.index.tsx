import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ContentList } from '#/features/dashboard/ContentList'

export const Route = createFileRoute('/dashboard/writing/')({
  component: DashboardWriting,
})

function DashboardWriting() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.writing.title}
      description={copy.writing.description}
    >
      <ContentList kind="writing" />
    </DashboardShell>
  )
}
