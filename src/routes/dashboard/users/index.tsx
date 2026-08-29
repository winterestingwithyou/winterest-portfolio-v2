import { createFileRoute } from '@tanstack/react-router'

import { DashboardUsersPage } from '#/features/users/pages/dashboard-users-page'
import {
  sessionQueryOptions,
  userQueryOptions,
} from '#/features/users/query-options'

export const Route = createFileRoute('/dashboard/users/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(userQueryOptions.list()),
    ])
  },
  component: DashboardUsersPage,
})
