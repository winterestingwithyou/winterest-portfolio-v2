import { createFileRoute } from '@tanstack/react-router'

import { getTechnologiesCopy } from '#/features/technologies/copy'
import { DashboardTechnologyEditPage } from '#/features/technologies/pages/dashboard-technology-edit-page'
import { techQueryOptions } from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/technologies/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(techQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getTechnologiesCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.editTechnology} · Dashboard`,
      description: copy.editTechnologyDesc,
    })
  },
  component: DashboardTechnologyEditRouteComponent,
})

function DashboardTechnologyEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardTechnologyEditPage id={id} />
}
