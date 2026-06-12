import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ContentList } from '#/features/dashboard/ContentList'

export const Route = createFileRoute('/dashboard/writing')({
  component: DashboardWriting,
})

function DashboardWriting() {
  return (
    <DashboardShell
      title="Writing"
      description="D1-backed articles, devlogs, and technical notes with draft and published states."
    >
      <ContentList kind="writing" />
    </DashboardShell>
  )
}
