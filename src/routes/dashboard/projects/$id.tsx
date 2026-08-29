import { createFileRoute } from '@tanstack/react-router'

import { DashboardProjectEditPage } from '#/features/projects/pages/dashboard-project-edit-page'
import { projectQueryOptions } from '#/features/projects/query-options'

export const Route = createFileRoute('/dashboard/projects/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(projectQueryOptions.detail(params.id)),
  component: DashboardProjectEditRouteComponent,
})

function DashboardProjectEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardProjectEditPage id={id} />
}
