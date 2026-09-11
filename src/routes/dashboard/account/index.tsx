import { createFileRoute } from '@tanstack/react-router'

import { getAccountCopy } from '#/features/account/copy'
import { accountQueryOptions } from '#/features/account/query-options'
import { AccountPage } from '#/features/account/pages/account-page'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/account/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(accountQueryOptions.profile()),
  head: ({ matches }) => {
    const copy = getAccountCopy()
    return createRouteMeta({
      matches,
      title: `${copy.title} · Dashboard`,
      description: copy.description,
    })
  },
  component: AccountPage,
})
