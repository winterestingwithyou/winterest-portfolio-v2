import { createFileRoute } from '@tanstack/react-router'

import { DashboardUserEditPage } from '#/features/users/pages/dashboard-user-edit-page'

export const Route = createFileRoute('/dashboard/users/$id')({
  component: DashboardUserEditRouteComponent,
})

function DashboardUserEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardUserEditPage id={id} />
}
