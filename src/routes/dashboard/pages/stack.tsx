import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { canManageContent } from '#/features/auth/roles'
import { getDashboardSession } from '#/features/auth/server-functions'
import { pageContentQueryOptions } from '#/features/portfolio/page-content-query-options'
import type { StackPageConfig } from '#/features/portfolio/page-content-schemas'
import { StackPageContentForm } from '#/features/technologies/components/form/stack-page-content-form'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/pages/stack')({
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
      pageContentQueryOptions.get<StackPageConfig>('stack'),
    ),
  head: ({ matches }) => {
    return createRouteMeta({
      matches,
      title: 'Konten Halaman Stack · Dashboard',
      description:
        'Kelola teks header halaman katalog tech stack dan ultimate stack',
    })
  },
  component: DashboardStackPageRoute,
})

function DashboardStackPageRoute() {
  const { data: initialData } = useSuspenseQuery(
    pageContentQueryOptions.get<StackPageConfig>('stack'),
  )

  return <StackPageContentForm initialData={initialData} />
}
