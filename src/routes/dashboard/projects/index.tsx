import { createFileRoute } from '@tanstack/react-router'

import { DashboardProjectsPage } from '#/features/projects/pages/dashboard-projects-page'
import { projectQueryOptions } from '#/features/projects/query-options'

export const Route = createFileRoute('/dashboard/projects/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(projectQueryOptions.list()),
  component: DashboardProjectsPage,
})
