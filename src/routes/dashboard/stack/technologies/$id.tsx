import { createFileRoute } from '@tanstack/react-router'

import { DashboardTechnologyEditPage } from '#/features/technologies/pages/dashboard-technology-edit-page'
import { techQueryOptions } from '#/features/technologies/query-options'

export const Route = createFileRoute('/dashboard/stack/technologies/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(techQueryOptions.detail(params.id)),
  component: DashboardTechnologyEditRouteComponent,
})

function DashboardTechnologyEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardTechnologyEditPage id={id} />
}
