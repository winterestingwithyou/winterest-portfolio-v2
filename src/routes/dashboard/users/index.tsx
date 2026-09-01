import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardUsersPage } from '#/features/users/pages/dashboard-users-page'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/users/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(userQueryOptions.list()),
    ])
  },
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.users.title} · Dashboard`,
      description: copy.users.description,
    })
  },
  component: DashboardUsersPage,
})
