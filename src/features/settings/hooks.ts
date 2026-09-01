import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { settingsQueryKeys } from '#/features/settings/query-options'
import type { SiteSettingsInput } from '#/features/settings/types'
import { api } from '#/lib/api-client'

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (
      input: SiteSettingsInput,
    ): Promise<SiteSettingsInput | undefined> => {
      const response = await api<{ data?: SiteSettingsInput }>(
        '/api/settings',
        {
          method: 'POST',
          body: input,
        },
      )

      return response.data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(settingsQueryKeys.all, data)
      }
      void queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all })
      void router.invalidate()
    },
  })
}
