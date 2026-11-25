import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { getCertificateCopy } from '#/features/certificates/copy'
import { DashboardCertificatesPage } from '#/features/certificates/pages/dashboard-certificates-page'
import { certificateQueryOptions } from '#/features/certificates/query-options'
import { createRouteMeta } from '#/lib/metadata'

const dashboardCertificatesSearchSchema = z.object({
  q: z.string().optional(),
  status: z.enum(['all', 'draft', 'published']).optional(),
  issuer: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export const Route = createFileRoute('/dashboard/certificates/')({
  validateSearch: (search) => dashboardCertificatesSearchSchema.parse(search),
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
