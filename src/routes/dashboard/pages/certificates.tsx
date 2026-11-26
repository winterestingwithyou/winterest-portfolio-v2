import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { canManageContent } from '#/features/auth/roles'
import { getDashboardSession } from '#/features/auth/server-functions'
import { CertificatesPageContentForm } from '#/features/certificates/components/form/certificates-page-content-form'
import { pageContentQueryOptions } from '#/features/portfolio/page-content-query-options'
import type { CertificatesPageConfig } from '#/features/portfolio/page-content-schemas'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/pages/certificates')({
  beforeLoad: async () => {
    const user = await getDashboardSession()
    if (!user || !canManageContent(user.role)) {
      throw redirect({ to: '/dashboard' })
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(
      pageContentQueryOptions.get<CertificatesPageConfig>('certificates'),
    ),
  head: ({ matches }) =>
    createRouteMeta({
      matches,
      title: 'Konten Halaman Sertifikat · Dashboard',
      description: 'Kelola header halaman dan section sertifikat di beranda',
    }),
  component: DashboardCertificatesPageRoute,
})

function DashboardCertificatesPageRoute() {
  const { data: initialData } = useSuspenseQuery(
    pageContentQueryOptions.get<CertificatesPageConfig>('certificates'),
  )

  return <CertificatesPageContentForm initialData={initialData} />
}
