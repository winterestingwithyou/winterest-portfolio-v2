import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getTechnologiesCopy } from '#/features/technologies/copy'
import { DashboardStackPage } from '#/features/technologies/pages/dashboard-stack-page'
import {
  categoryQueryOptions,
  techQueryOptions,
} from '#/features/technologies/query-options'
import { createRouteMeta } from '#/lib/metadata'

export type DashboardStackSearch = {
  tab?: 'technologies' | 'categories'
  q?: string
  category?: string
  page?: number
}

const dashboardStackSearchSchema = z.object({
  tab: z.enum(['technologies', 'categories']).optional(),
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export const Route = createFileRoute('/dashboard/stack/')({
  validateSearch: (search): DashboardStackSearch =>
    dashboardStackSearchSchema.parse(search),
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(categoryQueryOptions.list()),
      queryClient.ensureQueryData(techQueryOptions.list()),
    ])
  },
  head: ({ matches }) => {
    const copy = getTechnologiesCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.title} · Dashboard`,
      description: copy.description,
    })
  },
  component: DashboardStackPage,
})
