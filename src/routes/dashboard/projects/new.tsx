import { createFileRoute } from '@tanstack/react-router'

import { DashboardProjectNewPage } from '#/features/projects/pages/dashboard-project-new-page'

export const Route = createFileRoute('/dashboard/projects/new')({
  component: DashboardProjectNewPage,
})
