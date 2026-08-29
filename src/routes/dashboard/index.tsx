import { createFileRoute } from '@tanstack/react-router'

import { getDashboardSummary } from '#/features/dashboard/loaders'
import { OverviewPage } from '#/features/dashboard/pages/overview-page'

export const Route = createFileRoute('/dashboard/')({
  loader: () => getDashboardSummary(),
  component: DashboardHomeRouteComponent,
})

function DashboardHomeRouteComponent() {
  const summary = Route.useLoaderData()
  return <OverviewPage summary={summary} />
}
