import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardStackPage } from '#/features/technologies/pages/dashboard-stack-page'
import {
  categoryQueryOptions,
  techQueryOptions,
} from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/stack/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(categoryQueryOptions.list()),
      queryClient.ensureQueryData(techQueryOptions.list()),
    ])
  },
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.stack.title} · Dashboard`,
      description: copy.stack.description,
    })
  },
  component: DashboardStackPage,
})
