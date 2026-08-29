import { createFileRoute } from '@tanstack/react-router'

import { DashboardUserEditPage } from '#/features/users/pages/dashboard-user-edit-page'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'

export const Route = createFileRoute('/dashboard/users/$id')({
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(userQueryOptions.detail(params.id)),
    ])
  },
  component: DashboardUserEditRouteComponent,
})

function DashboardUserEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardUserEditPage id={id} />
}
