import { createFileRoute } from '@tanstack/react-router'

import { getProjectsCopy } from '#/features/projects/copy'
import { DashboardProjectNewPage } from '#/features/projects/pages/dashboard-project-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/projects/new')({
  head: ({ matches }) => {
    const copy = getProjectsCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.newTitle} · Dashboard`,
      description: copy.newDescription,
    })
  },
  component: DashboardProjectNewPage,
})
