import { createFileRoute } from '@tanstack/react-router'

import { DashboardCategoryNewPage } from '#/features/technologies/pages/dashboard-category-new-page'

export const Route = createFileRoute('/dashboard/stack/categories/new')({
  component: DashboardCategoryNewPage,
})
