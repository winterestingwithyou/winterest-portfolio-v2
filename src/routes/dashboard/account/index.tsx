import { createFileRoute } from '@tanstack/react-router'

import { accountQueryOptions } from '#/features/account/query-options'
import { AccountPage } from '#/features/account/pages/account-page'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/account/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(accountQueryOptions.profile()),
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.account.title} · Dashboard`,
      description: copy.account.description,
    })
  },
  component: AccountPage,
})
