import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '#/features/settings/pages/settings-page'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})
