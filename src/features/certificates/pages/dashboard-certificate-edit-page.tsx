import { useSuspenseQuery } from '@tanstack/react-query'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { CertificateEditorForm } from '#/features/certificates/components/form/certificate-editor-form'
import { getCertificateCopy } from '#/features/certificates/copy'
import { certificateQueryOptions } from '#/features/certificates/query-options'

export function DashboardCertificateEditPage({ id }: { id: string }) {
  const copy = getCertificateCopy().dashboard
  const { data: certificate } = useSuspenseQuery(
    certificateQueryOptions.detail(id),
  )

  return (
    <DashboardShell
      title={certificate.title}
      description={copy.editDescription}
    >
      <CertificateEditorForm certificate={certificate} />
    </DashboardShell>
  )
}
