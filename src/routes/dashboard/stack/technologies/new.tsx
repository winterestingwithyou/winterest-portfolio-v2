import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardTechnologyNewPage } from '#/features/technologies/pages/dashboard-technology-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/technologies/new')({
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.stack.newTechnology} · Dashboard`,
      description: copy.stack.newTechnologyDesc,
    })
  },
  component: DashboardTechnologyNewPage,
})
