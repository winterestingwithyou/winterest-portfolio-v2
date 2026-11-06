import { createFileRoute } from '@tanstack/react-router'

import { getCertificateCopy } from '#/features/certificates/copy'
import { DashboardCertificatesPage } from '#/features/certificates/pages/dashboard-certificates-page'
import { certificateQueryOptions } from '#/features/certificates/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/certificates/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(certificateQueryOptions.list()),
  head: ({ matches }) => {
    const copy = getCertificateCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.title} · Dashboard`,
      description: copy.description,
    })
  },
  component: DashboardCertificatesPage,
})
