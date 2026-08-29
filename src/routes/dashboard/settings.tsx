import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '#/features/settings/pages/settings-page'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { sessionQueryOptions } from '#/features/users/query-options'

export const Route = createFileRoute('/dashboard/settings')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(settingsQueryOptions.get()),
    ])
  },
  component: SettingsPage,
})
