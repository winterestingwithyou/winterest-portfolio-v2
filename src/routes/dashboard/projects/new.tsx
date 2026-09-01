import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardProjectNewPage } from '#/features/projects/pages/dashboard-project-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/projects/new')({
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.projects.newTitle} · Dashboard`,
      description: copy.projects.newDescription,
    })
  },
  component: DashboardProjectNewPage,
})
