import { queryOptions } from '@tanstack/react-query'

import { defaultSiteSettings } from '#/features/settings/types'
import type { SiteSettingsInput } from '#/features/settings/types'
import { api } from '#/lib/api-client'

export const settingsQueryKeys = {
  all: ['site-settings'] as const,
}

export const settingsQueryOptions = {
  get: () =>
    queryOptions({
      queryKey: settingsQueryKeys.all,
      queryFn: async (): Promise<SiteSettingsInput> => {
        const response = await api<{ data?: SiteSettingsInput }>(
          '/api/settings',
        )
        return response.data ?? defaultSiteSettings
      },
    }),
}
