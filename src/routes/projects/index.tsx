import { createFileRoute } from '@tanstack/react-router'

import { ProjectsListPage } from '#/features/projects/pages/projects-list-page'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/projects/')({
  loader: () => getPublishedProjects({ data: { locale: getLocale() } }),
  component: ProjectsRouteComponent,
})

function ProjectsRouteComponent() {
  const projects = Route.useLoaderData()
  return <ProjectsListPage projects={projects} />
}
