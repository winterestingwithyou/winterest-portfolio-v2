import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { canManageContent } from '#/features/auth/roles'
import { getDashboardSession } from '#/features/auth/server-functions'
import { DashboardHomePage } from '#/features/home/pages/dashboard-home-page'
import { homeQueryOptions } from '#/features/home/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/pages/home')({
  beforeLoad: async () => {
    const user = await getDashboardSession()
    if (!user || !canManageContent(user.role)) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(homeQueryOptions.config()),
      queryClient.ensureQueryData(homeQueryOptions.enthusiasms(true)),
    ])
  },
  head: ({ matches }) => {
    return createRouteMeta({
      matches,
      title: 'Konten Beranda · Dashboard',
      description: 'Kelola konten, teks hero, metrik, dan seksi beranda',
    })
  },
  component: DashboardHomeRoute,
})

function DashboardHomeRoute() {
  const { data: initialConfig } = useSuspenseQuery(homeQueryOptions.config())
  const { data: enthusiasms } = useSuspenseQuery(
    homeQueryOptions.enthusiasms(true),
  )

  return (
    <DashboardHomePage
      initialConfig={initialConfig}
      enthusiasms={enthusiasms}
    />
  )
}
