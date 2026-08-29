import { createFileRoute } from '@tanstack/react-router'

import { DashboardTechnologyEditPage } from '#/features/technologies/pages/dashboard-technology-edit-page'

export const Route = createFileRoute('/dashboard/stack/technologies/$id')({
  component: DashboardTechnologyEditRouteComponent,
})

function DashboardTechnologyEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardTechnologyEditPage id={id} />
}
