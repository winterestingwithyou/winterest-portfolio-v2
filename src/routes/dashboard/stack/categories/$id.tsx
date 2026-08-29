import { createFileRoute } from '@tanstack/react-router'

import { DashboardCategoryEditPage } from '#/features/technologies/pages/dashboard-category-edit-page'

export const Route = createFileRoute('/dashboard/stack/categories/$id')({
  component: DashboardCategoryEditRouteComponent,
})

function DashboardCategoryEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardCategoryEditPage id={id} />
}
