import { createFileRoute } from '@tanstack/react-router'

import { DashboardUsersPage } from '#/features/users/pages/dashboard-users-page'

export const Route = createFileRoute('/dashboard/users/')({
  component: DashboardUsersPage,
})
