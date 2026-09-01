import { createFileRoute } from '@tanstack/react-router'

import { getPortfolioCopy } from '#/features/portfolio/copy'
import { ResumePage } from '#/features/portfolio/pages/resume-page'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getPublicStackData } from '#/features/technologies/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/resume')({
  loader: async () => {
    const [projects, stackData] = await Promise.all([
      getPublishedProjects({ data: { locale: getLocale() } }),
      getPublicStackData(),
    ])
    return { projects, ...stackData }
  },
  head: ({ matches }) => {
    const copy = getPortfolioCopy()
    return createRouteMeta({
      matches,
      title: copy.resume.meta.title,
      description: copy.resume.meta.description,
    })
  },
  component: ResumeRouteComponent,
})

function ResumeRouteComponent() {
  const { projects, categories } = Route.useLoaderData()
  return <ResumePage projects={projects} categories={categories} />
}
