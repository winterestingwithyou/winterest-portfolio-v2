import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { canManageContent } from '#/features/auth/roles'
import { getDashboardSession } from '#/features/auth/server-functions'
import { ContactPageContentForm } from '#/features/contact/components/form/contact-page-content-form'
import { pageContentQueryOptions } from '#/features/portfolio/page-content-query-options'
import type { ContactPageConfig } from '#/features/portfolio/page-content-schemas'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/pages/contact')({
  beforeLoad: async () => {
    const user = await getDashboardSession()
    if (!user || !canManageContent(user.role)) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(
      pageContentQueryOptions.get<ContactPageConfig>('contact'),
    ),
  head: ({ matches }) => {
    return createRouteMeta({
      matches,
      title: 'Konten Halaman Kontak · Dashboard',
      description: 'Kelola teks header dan label halaman kontak',
    })
  },
  component: DashboardContactPageRoute,
})

function DashboardContactPageRoute() {
  const { data: initialData } = useSuspenseQuery(
    pageContentQueryOptions.get<ContactPageConfig>('contact'),
  )

  return <ContactPageContentForm initialData={initialData} />
}
