import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardUserEditPage } from '#/features/users/pages/dashboard-user-edit-page'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/users/$id')({
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(userQueryOptions.detail(params.id)),
    ])
  },
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.users.editUser} · Dashboard`,
      description: copy.users.editDescription,
    })
  },
  component: DashboardUserEditRouteComponent,
})

function DashboardUserEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardUserEditPage id={id} />
}
