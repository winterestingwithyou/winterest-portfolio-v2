import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getProjectsCopy } from '#/features/projects/copy'
import { DashboardProjectsPage } from '#/features/projects/pages/dashboard-projects-page'
import { projectQueryOptions } from '#/features/projects/query-options'
import { createRouteMeta } from '#/lib/metadata'

const dashboardProjectsSearchSchema = z.object({
  q: z.string().optional(),
  status: z
    .enum(['all', 'published', 'in_progress', 'draft', 'featured'])
    .optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export const Route = createFileRoute('/dashboard/projects/')({
  validateSearch: (search) => dashboardProjectsSearchSchema.parse(search),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(projectQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getProjectsCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.title} · Dashboard`,
      description: copy.description,
    })
  },
  component: DashboardProjectsPage,
})
