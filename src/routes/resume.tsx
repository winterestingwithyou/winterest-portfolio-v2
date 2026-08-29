import { createFileRoute } from '@tanstack/react-router'

import { ResumePage } from '#/features/portfolio/pages/resume-page'
import { getPublishedProjects } from '#/features/projects/public-loaders'
import { getPublicStackData } from '#/features/technologies/public-loaders'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/resume')({
  loader: async () => {
    const [projects, stackData] = await Promise.all([
      getPublishedProjects({ data: { locale: getLocale() } }),
      getPublicStackData(),
    ])
    return { projects, ...stackData }
  },
  component: ResumeRouteComponent,
})

function ResumeRouteComponent() {
  const { projects, categories } = Route.useLoaderData()
  return <ResumePage projects={projects} categories={categories} />
}
