import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardProjectsPage } from '#/features/projects/pages/dashboard-projects-page'
import { projectQueryOptions } from '#/features/projects/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/projects/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(projectQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.projects.title} · Dashboard`,
      description: copy.projects.description,
    })
  },
  component: DashboardProjectsPage,
})
