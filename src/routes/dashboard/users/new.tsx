import { createFileRoute, redirect } from '@tanstack/react-router'

import { getDashboardSession } from '#/features/auth/server-functions'
import { getUsersCopy } from '#/features/users/copy'
import { DashboardUserNewPage } from '#/features/users/pages/dashboard-user-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/users/new')({
  beforeLoad: async () => {
    const user = await getDashboardSession()
    if (!user || user.role !== 'owner') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  head: ({ matches }) => {
    const copy = getUsersCopy()
    return createRouteMeta({
      matches,
      title: `${copy.new} · Dashboard`,
      description: copy.newDescription,
    })
  },
  component: DashboardUserNewPage,
})
