import { createFileRoute } from '@tanstack/react-router'

import { getProjectsCopy } from '#/features/projects/copy'
import { DashboardProjectEditPage } from '#/features/projects/pages/dashboard-project-edit-page'
import { projectQueryOptions } from '#/features/projects/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/projects/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(projectQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getProjectsCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.editTitle} · Dashboard`,
      description: copy.editDescription,
    })
  },
  component: DashboardProjectEditRouteComponent,
})

function DashboardProjectEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardProjectEditPage id={id} />
}
