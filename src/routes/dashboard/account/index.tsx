import { createFileRoute } from '@tanstack/react-router'

import { AccountPage } from '#/features/account/pages/account-page'

export const Route = createFileRoute('/dashboard/account/')({
  component: AccountPage,
})
