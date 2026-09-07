import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { ProjectsListPage } from '#/features/projects/pages/projects-list-page'
import { getProjectsCopy } from '#/features/projects/copy'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

const publicProjectsSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export type PublicProjectsSearch = z.infer<typeof publicProjectsSearchSchema>

export const Route = createFileRoute('/projects/')({
  validateSearch: (search): PublicProjectsSearch =>
    publicProjectsSearchSchema.parse(search),
  loader: () => getPublishedProjects({ data: { locale: getLocale() } }),
  head: ({ matches }) => {
    const copy = getProjectsCopy()
    return createRouteMeta({
      matches,
      title: copy.meta.title,
      description: copy.meta.description,
    })
  },
  component: ProjectsRouteComponent,
})

function ProjectsRouteComponent() {
  const projects = Route.useLoaderData()
  return <ProjectsListPage projects={projects} />
}
