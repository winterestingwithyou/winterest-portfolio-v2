import { createFileRoute } from '@tanstack/react-router'

import { DashboardProjectEditPage } from '#/features/projects/pages/dashboard-project-edit-page'

export const Route = createFileRoute('/dashboard/projects/$id')({
  component: DashboardProjectEditRouteComponent,
})

function DashboardProjectEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardProjectEditPage id={id} />
}
