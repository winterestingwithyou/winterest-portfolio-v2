import { createFileRoute } from '@tanstack/react-router'

import { ProjectDetailPage } from '#/features/projects/pages/project-detail-page'
import { getProjectsCopy } from '#/features/projects/copy'
import { getPublishedProject } from '#/features/projects/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) =>
    getPublishedProject({ data: { slug: params.slug, locale: getLocale() } }),
  head: ({ matches, loaderData }) => {
    const copy = getProjectsCopy()
    const project = loaderData
    return createRouteMeta({
      matches,
      title: project?.title ?? copy.detail.notFound,
      description:
        project?.summary ?? project?.description ?? copy.meta.description,
      ogImage: project?.coverImage,
    })
  },
  component: ProjectDetailRouteComponent,
})

function ProjectDetailRouteComponent() {
  const project = Route.useLoaderData()
  return <ProjectDetailPage project={project} />
}
