import { createFileRoute } from '@tanstack/react-router'

import { DashboardStackPage } from '#/features/technologies/pages/dashboard-stack-page'
import {
  categoryQueryOptions,
  techQueryOptions,
} from '#/features/technologies/query-options'

export const Route = createFileRoute('/dashboard/stack/')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(categoryQueryOptions.list()),
      queryClient.ensureQueryData(techQueryOptions.list()),
    ])
  },
  component: DashboardStackPage,
})
