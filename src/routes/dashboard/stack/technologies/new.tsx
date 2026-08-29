import { createFileRoute } from '@tanstack/react-router'

import { DashboardTechnologyNewPage } from '#/features/technologies/pages/dashboard-technology-new-page'

export const Route = createFileRoute('/dashboard/stack/technologies/new')({
  component: DashboardTechnologyNewPage,
})
