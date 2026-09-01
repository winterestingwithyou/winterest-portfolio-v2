import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardUserNewPage } from '#/features/users/pages/dashboard-user-new-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/users/new')({
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
