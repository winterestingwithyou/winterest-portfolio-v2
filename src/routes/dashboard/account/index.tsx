import { createFileRoute } from '@tanstack/react-router'

import { accountQueryOptions } from '#/features/account/query-options'
import { AccountPage } from '#/features/account/pages/account-page'

export const Route = createFileRoute('/dashboard/account/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(accountQueryOptions.profile()),
  component: AccountPage,
})
