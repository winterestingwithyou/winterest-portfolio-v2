import { createFileRoute, redirect } from '@tanstack/react-router'

import { getDashboardSession } from '#/features/auth/server-functions'
import { getUsersCopy } from '#/features/users/copy'
import { DashboardUserEditPage } from '#/features/users/pages/dashboard-user-edit-page'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/users/$id')({
  beforeLoad: async () => {
    const user = await getDashboardSession()
    if (!user || user.role !== 'owner') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  loader: async ({ context: { queryClient }, params }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(userQueryOptions.detail(params.id)),
    ])
  },
  head: ({ matches }) => {
    const copy = getUsersCopy()
    return createRouteMeta({
      matches,
      title: `${copy.editUser} · Dashboard`,
      description: copy.editDescription,
    })
  },
  component: DashboardUserEditRouteComponent,
})

function DashboardUserEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardUserEditPage id={id} />
}
