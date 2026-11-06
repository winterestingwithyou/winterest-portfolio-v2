import { createFileRoute } from '@tanstack/react-router'

import { getCertificateCopy } from '#/features/certificates/copy'
import { DashboardCertificateNewPage } from '#/features/certificates/pages/dashboard-certificate-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/certificates/new')({
  head: ({ matches }) => {
    const copy = getCertificateCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.newTitle} · Dashboard`,
      description: copy.newDescription,
    })
  },
  component: DashboardCertificateNewPage,
})
