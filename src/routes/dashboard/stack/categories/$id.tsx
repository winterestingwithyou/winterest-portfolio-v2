import { createFileRoute } from '@tanstack/react-router'

import { DashboardCategoryEditPage } from '#/features/technologies/pages/dashboard-category-edit-page'
import { categoryQueryOptions } from '#/features/technologies/query-options'

export const Route = createFileRoute('/dashboard/stack/categories/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(categoryQueryOptions.detail(params.id)),
  component: DashboardCategoryEditRouteComponent,
})

function DashboardCategoryEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardCategoryEditPage id={id} />
}
