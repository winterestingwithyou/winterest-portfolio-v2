import { createFileRoute, redirect } from '@tanstack/react-router'

import { canManageSettings } from '#/features/auth/roles'
import { getDashboardSession } from '#/features/auth/server-functions'
import { getSettingsCopy } from '#/features/settings/copy'
import { SettingsPage } from '#/features/settings/pages/settings-page'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { sessionQueryOptions } from '#/features/users/query-options'
import { createRouteMeta } from '#/lib/metadata'

export const Route = createFileRoute('/dashboard/settings')({
  beforeLoad: async () => {
    const user = await getDashboardSession()
    if (!user || !canManageSettings(user.role)) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions.current()),
      queryClient.ensureQueryData(settingsQueryOptions.get()),
    ])
  },
  head: ({ matches }) => {
    const copy = getSettingsCopy()
    return createRouteMeta({
      matches,
      title: `${copy.title} · Dashboard`,
      description: copy.description,
    })
  },
  component: SettingsPage,
})
