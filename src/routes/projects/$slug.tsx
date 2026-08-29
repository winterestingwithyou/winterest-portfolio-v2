import { createFileRoute } from '@tanstack/react-router'

import { ProjectDetailPage } from '#/features/projects/pages/project-detail-page'
import { getPublishedProject } from '#/features/projects/public-loaders'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) =>
    getPublishedProject({ data: { slug: params.slug, locale: getLocale() } }),
  component: ProjectDetailRouteComponent,
})

function ProjectDetailRouteComponent() {
  const project = Route.useLoaderData()
  return <ProjectDetailPage project={project} />
}
