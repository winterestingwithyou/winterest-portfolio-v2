import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getPublicPageContent } from '#/features/portfolio/public-loaders'
import type { ProjectsPageConfig } from '#/features/portfolio/page-content-schemas'
import { getProjectsCopy } from '#/features/projects/copy'
import { ProjectsListPage } from '#/features/projects/pages/projects-list-page'
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
  loader: async () => {
    const locale = getLocale()
    const [projects, pageContent] = await Promise.all([
      getPublishedProjects({ data: { locale } }),
      getPublicPageContent({
        data: { page: 'projects' },
      }) as Promise<ProjectsPageConfig>,
    ])
    return { projects, pageContent }
  },
  head: ({ matches, loaderData }) => {
    const copy = getProjectsCopy()
    const locale = getLocale() === 'id' ? 'id' : 'en'
    const dynamicTitle =
      locale === 'en'
        ? loaderData?.pageContent.titleEn
        : loaderData?.pageContent.titleId
    const dynamicDesc =
      locale === 'en'
        ? loaderData?.pageContent.descriptionEn
        : loaderData?.pageContent.descriptionId

    return createRouteMeta({
      matches,
      title: dynamicTitle || copy.meta.title,
      description: dynamicDesc || copy.meta.description,
      canonicalUrl: '/projects',
    })
  },
  component: ProjectsRouteComponent,
})

function ProjectsRouteComponent() {
  const { projects, pageContent } = Route.useLoaderData()
  return <ProjectsListPage projects={projects} pageContent={pageContent} />
}
