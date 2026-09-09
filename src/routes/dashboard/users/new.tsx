import { createFileRoute, redirect } from '@tanstack/react-router'

import { getDashboardSession } from '#/features/auth/server-functions'
import { getDashboardCopy } from '#/features/dashboard/copy'
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
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.users.new} · Dashboard`,
      description: copy.users.newDescription,
    })
  },
  component: DashboardUserNewPage,
})
