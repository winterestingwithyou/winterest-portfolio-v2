import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { SiteSettingsInput } from './types'
import { defaultSiteSettings } from './types'

export function useSiteSettings(options?: { enabled?: boolean }) {
  return useQuery<SiteSettingsInput>({
    queryKey: ['site-settings'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings.')
      }
      const json: { data?: SiteSettingsInput } = await response.json()
      return json.data ?? defaultSiteSettings
    },
  })
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SiteSettingsInput) => {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      const json: { data?: SiteSettingsInput; error?: string } =
        await response.json()

      if (!response.ok || json.error) {
        throw new Error(json.error ?? 'Failed to save settings.')
      }

      return json.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['site-settings'], data)
      }
      void queryClient.invalidateQueries({ queryKey: ['site-settings'] })
    },
  })
}
