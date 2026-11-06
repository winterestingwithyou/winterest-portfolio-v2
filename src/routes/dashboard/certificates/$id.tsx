import { createFileRoute } from '@tanstack/react-router'

import { getCertificateCopy } from '#/features/certificates/copy'
import { DashboardCertificateEditPage } from '#/features/certificates/pages/dashboard-certificate-edit-page'
import { certificateQueryOptions } from '#/features/certificates/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/certificates/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(certificateQueryOptions.detail(params.id)),
  head: ({ matches }) => {
    const copy = getCertificateCopy().dashboard
    return createRouteMeta({
      matches,
      title: `${copy.editTitle} · Dashboard`,
      description: copy.editDescription,
    })
  },
  component: DashboardCertificateEditRouteComponent,
})

function DashboardCertificateEditRouteComponent() {
  const { id } = Route.useParams()
  return <DashboardCertificateEditPage id={id} />
}
