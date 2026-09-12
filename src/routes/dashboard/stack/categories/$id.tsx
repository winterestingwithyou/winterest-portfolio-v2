import { createFileRoute } from '@tanstack/react-router'

import { getTechnologiesCopy } from '#/features/technologies/copy'
import { DashboardCategoryEditPage } from '#/features/technologies/pages/dashboard-category-edit-page'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/categories/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(categoryQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getTechnologiesCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.editCategory} · Dashboard`,
      description: copy.editCategoryDesc,
    })
  },
  component: DashboardCategoryEditRouteComponent,
})

function DashboardCategoryEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardCategoryEditPage id={id} />
}
