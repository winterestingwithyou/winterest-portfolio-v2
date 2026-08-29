import { createFileRoute } from '@tanstack/react-router'

import { DashboardProjectsPage } from '#/features/projects/pages/dashboard-projects-page'

export const Route = createFileRoute('/dashboard/projects/')({
  component: DashboardProjectsPage,
})
