import { createFileRoute } from '@tanstack/react-router'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { SettingsPage } from '#/features/settings/pages/settings-page'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { sessionQueryOptions } from '#/features/users/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/settings')({
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(settingsQueryOptions.get()),
    ])
  },
  head: ({ matches }) => {
    const copy = getDashboardCopy()
    return createRouteMeta({
      matches,
      title: `${copy.settings.title} · Dashboard`,
      description: copy.settings.description,
    })
  },
  component: SettingsPage,
})
