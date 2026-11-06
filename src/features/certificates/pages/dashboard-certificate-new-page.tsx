import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { CertificateEditorForm } from '#/features/certificates/components/form/certificate-editor-form'
import { getCertificateCopy } from '#/features/certificates/copy'

export function DashboardCertificateNewPage() {
  const copy = getCertificateCopy().dashboard

  return (
    <DashboardShell title={copy.newTitle} description={copy.newDescription}>
      <CertificateEditorForm />
    </DashboardShell>
  )
}
