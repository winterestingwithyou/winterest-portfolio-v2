import { createFileRoute } from '@tanstack/react-router'

import { DashboardStackPage } from '#/features/technologies/pages/dashboard-stack-page'

export const Route = createFileRoute('/dashboard/stack/')({
  component: DashboardStackPage,
})
