import { createFileRoute } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ContentList } from '#/features/dashboard/ContentList'

export const Route = createFileRoute('/dashboard/lab/')({
  component: DashboardLab,
})

function DashboardLab() {
  const copy = getDashboardCopy()

  return (
    <DashboardShell title={copy.lab.title} description={copy.lab.description}>
      <ContentList kind="lab" />
    </DashboardShell>
  )
}
