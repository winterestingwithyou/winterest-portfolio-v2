import { createFileRoute } from '@tanstack/react-router'

import { DashboardUserNewPage } from '#/features/users/pages/dashboard-user-new-page'

export const Route = createFileRoute('/dashboard/users/new')({
  component: DashboardUserNewPage,
})
