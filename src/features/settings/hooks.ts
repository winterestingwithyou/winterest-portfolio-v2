import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import type { SiteSettingsInput } from './types'
import { defaultSiteSettings } from './types'

export function useSiteSettings(options?: {
  enabled?: boolean
  initialData?: SiteSettingsInput
}) {
  return useQuery<SiteSettingsInput>({
    queryKey: ['site-settings'],
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
    queryFn: async () => {
      const response = await api<{ data?: SiteSettingsInput }>('/api/settings')
      return response.data ?? defaultSiteSettings
    },
  })
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SiteSettingsInput) => {
      const response = await api<{ data?: SiteSettingsInput }>('/api/settings', {
        method: 'POST',
        body: input,
      })

      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['site-settings'], data)
      }
      void queryClient.invalidateQueries({ queryKey: ['site-settings'] })
    },
  })
}
