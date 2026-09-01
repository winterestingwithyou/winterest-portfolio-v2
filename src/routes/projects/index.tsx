import { createFileRoute } from '@tanstack/react-router'

import { ProjectsListPage } from '#/features/projects/pages/projects-list-page'
import { getProjectsCopy } from '#/features/projects/copy'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/projects/')({
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
