import { createFileRoute } from '@tanstack/react-router'

import { getCertificateCopy } from '#/features/certificates/copy'
import { CertificatesListPage } from '#/features/certificates/pages/certificates-list-page'
import { getPublicCertificates } from '#/features/certificates/public-loaders'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/certificates/')({
  loader: () => getPublicCertificates({ data: {} }),
  head: ({ matches }) => {
    const copy = getCertificateCopy()
    return createRouteMeta({
      matches,
      title: copy.meta.title,
      description: copy.meta.description,
      canonicalUrl: '/certificates',
    })
  },
  component: CertificatesRouteComponent,
})

function CertificatesRouteComponent() {
  const certificates = Route.useLoaderData()
  return <CertificatesListPage certificates={certificates} />
}
