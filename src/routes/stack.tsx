import { createFileRoute } from '@tanstack/react-router'

import { getPublicPageContent } from '#/features/portfolio/public-loaders'
import type { StackPageConfig } from '#/features/portfolio/page-content-schemas'
import { getTechnologiesCopy } from '#/features/technologies/copy'
import { StackPage } from '#/features/technologies/pages/stack-page'
import { getPublicStackData } from '#/features/technologies/public-loaders'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/stack')({
  loader: async () => {
    const [stackData, pageContent] = await Promise.all([
      getPublicStackData(),
      getPublicPageContent({
        data: { page: 'stack' },
      }) as Promise<StackPageConfig>,
    ])
    return { ...stackData, pageContent }
  },
  head: ({ matches, loaderData }) => {
    const copy = getTechnologiesCopy()
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
      canonicalUrl: '/stack',
    })
  },
  component: StackRouteComponent,
})

function StackRouteComponent() {
  const { categories, ultimateTechs, pageContent } = Route.useLoaderData()
  return (
    <StackPage
      categories={categories}
      ultimateTechs={ultimateTechs}
      pageContent={pageContent}
    />
  )
}
