import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import { pageContentQueryKeys } from './page-content-query-options'
import type { PublicPageKey } from './page-content-schemas'

export function useUpdatePageContent<T extends Record<string, unknown>>(
  page: PublicPageKey,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: T): Promise<T> => {
      const res = await api<{ data: T }>(`/api/pages/${page}`, {
        method: 'PUT',
        body: payload,
      })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pageContentQueryKeys.detail(page), data)
      void queryClient.invalidateQueries({
        queryKey: pageContentQueryKeys.detail(page),
      })
    },
  })
}
