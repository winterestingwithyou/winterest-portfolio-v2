import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardTechnologyEditPage } from '#/features/technologies/pages/dashboard-technology-edit-page'
import { techQueryOptions } from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/technologies/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(techQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.stack.editTechnology} · Dashboard`,
      description: copy.stack.description,
    })
  },
  component: DashboardTechnologyEditRouteComponent,
})

function DashboardTechnologyEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardTechnologyEditPage id={id} />
}
