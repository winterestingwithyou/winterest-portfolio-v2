import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getCertificateCopy } from '#/features/certificates/copy'
import { getPublicPageContent } from '#/features/portfolio/public-loaders'
import type { CertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import { getLocale } from '#/paraglide/runtime'
import { CertificatesListPage } from '#/features/certificates/pages/certificates-list-page'
import { getPublicCertificates } from '#/features/certificates/public-loaders'
import { createRouteMeta } from '#/lib/metadata'

const certificatesSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export const Route = createFileRoute('/certificates/')({
  validateSearch: (search) => certificatesSearchSchema.parse(search),
  loader: async () => {
    const [certificates, pageContent] = await Promise.all([
      getPublicCertificates({ data: {} }),
      getPublicPageContent({
        data: { page: 'certificates' },
      }) as Promise<CertificatesPageConfig>,
    ])
    return { certificates, pageContent }
  },
  head: ({ matches, loaderData }) => {
    const copy = getCertificateCopy()
    const locale = getLocale() === 'id' ? 'id' : 'en'
    const title =
      locale === 'en'
        ? loaderData?.pageContent.titleEn
        : loaderData?.pageContent.titleId
    const description =
      locale === 'en'
        ? loaderData?.pageContent.descriptionEn
        : loaderData?.pageContent.descriptionId
    return createRouteMeta({
      matches,
      title: title || copy.meta.title,
      description: description || copy.meta.description,
      canonicalUrl: '/certificates',
    })
  },
  component: CertificatesRouteComponent,
})

function CertificatesRouteComponent() {
  const { certificates, pageContent } = Route.useLoaderData()
  return (
    <CertificatesListPage
      certificates={certificates}
      pageContent={pageContent}
    />
  )
}
