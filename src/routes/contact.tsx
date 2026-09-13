import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '#/features/contact/pages/contact-page'
import { getContactCopy } from '#/features/contact/copy'
import { getPublicPageContent } from '#/features/portfolio/public-loaders'
import type { ContactPageConfig } from '#/features/portfolio/page-content-schemas'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { socialQueryOptions } from '#/features/social/query-options'
import { createRouteMeta } from '#/lib/metadata'
import { getLocale } from '#/paraglide/runtime'

export const Route = createFileRoute('/contact')({
  loader: async ({ context: { queryClient } }) => {
    const [, , pageContent] = await Promise.all([
      queryClient.ensureQueryData(settingsQueryOptions.get()),
      queryClient.ensureQueryData(socialQueryOptions.publicList()),
      getPublicPageContent({
        data: { page: 'contact' },
      }) as Promise<ContactPageConfig>,
    ])
    return { pageContent }
  },
  head: ({ matches, loaderData }) => {
    const copy = getContactCopy()
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
      canonicalUrl: '/contact',
    })
  },
  component: ContactRouteComponent,
})

function ContactRouteComponent() {
  const { pageContent } = Route.useLoaderData()
  return <ContactPage pageContent={pageContent} />
}
