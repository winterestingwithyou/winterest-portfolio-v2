import { createFileRoute } from '@tanstack/react-router'

import { getTechnologiesCopy } from '#/features/technologies/copy'
import { DashboardTechnologyNewPage } from '#/features/technologies/pages/dashboard-technology-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/technologies/new')({
  head: ({ matches }) => {
    const copy = getTechnologiesCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.newTechnology} · Dashboard`,
      description: copy.newTechnologyDesc,
    })
  },
  component: DashboardTechnologyNewPage,
})
