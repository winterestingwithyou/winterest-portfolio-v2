import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ContentList } from '#/features/dashboard/ContentList'

export const Route = createFileRoute('/dashboard/lab')({
  component: DashboardLab,
})

function DashboardLab() {
  return (
    <DashboardShell
      title="Lab"
      description="D1-backed experiments, mini tools, and developer lab entries."
    >
      <ContentList kind="lab" />
    </DashboardShell>
  )
}
