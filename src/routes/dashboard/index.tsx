import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { getDashboardSummary } from '#/features/dashboard/loaders'
import { OverviewPage } from '#/features/dashboard/pages/overview-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/')({
  loader: () => getDashboardSummary(),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.overview.title} · Dashboard`,
      description: copy.overview.description,
    })
  },
  component: DashboardHomeRouteComponent,
})

function DashboardHomeRouteComponent() {
  const summary = Route.useLoaderData()
  return <OverviewPage summary={summary} />
}
