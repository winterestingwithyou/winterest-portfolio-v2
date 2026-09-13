import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { canManageContent } from '#/features/auth/roles'
import { getDashboardSession } from '#/features/auth/server-functions'
import { pageContentQueryOptions } from '#/features/portfolio/page-content-query-options'
import type { ProjectsPageConfig } from '#/features/portfolio/page-content-schemas'
import { ProjectsPageContentForm } from '#/features/projects/components/form/projects-page-content-form'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/pages/projects')({
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
      pageContentQueryOptions.get<ProjectsPageConfig>('projects'),
    ),
  head: ({ matches }) => {
    return createRouteMeta({
      matches,
      title: 'Konten Halaman Project · Dashboard',
      description: 'Kelola teks header dan deskripsi halaman katalog project',
    })
  },
  component: DashboardProjectsPageRoute,
})

function DashboardProjectsPageRoute() {
  const { data: initialData } = useSuspenseQuery(
    pageContentQueryOptions.get<ProjectsPageConfig>('projects'),
  )

  return <ProjectsPageContentForm initialData={initialData} />
}
