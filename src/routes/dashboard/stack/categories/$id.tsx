import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardCategoryEditPage } from '#/features/technologies/pages/dashboard-category-edit-page'
import { categoryQueryOptions } from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/categories/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(categoryQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.stack.editCategory} · Dashboard`,
      description: copy.stack.editCategoryDesc,
    })
  },
  component: DashboardCategoryEditRouteComponent,
})

function DashboardCategoryEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardCategoryEditPage id={id} />
}
