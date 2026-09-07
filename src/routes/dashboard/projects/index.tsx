import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardProjectsPage } from '#/features/projects/pages/dashboard-projects-page'
import { projectQueryOptions } from '#/features/projects/query-options'
import { createRouteMeta } from '#/lib/metadata'

const dashboardProjectsSearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['all', 'published', 'in_progress', 'draft']).optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export const Route = createFileRoute('/dashboard/projects/')({
  validateSearch: (search) => dashboardProjectsSearchSchema.parse(search),
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(projectQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.projects.title} · Dashboard`,
      description: copy.projects.description,
    })
  },
  component: DashboardProjectsPage,
})
