import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardProjectEditPage } from '#/features/projects/pages/dashboard-project-edit-page'
import { projectQueryOptions } from '#/features/projects/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/projects/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(projectQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.projects.editTitle} · Dashboard`,
      description: copy.projects.editDescription,
    })
  },
  component: DashboardProjectEditRouteComponent,
})

function DashboardProjectEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardProjectEditPage id={id} />
}
