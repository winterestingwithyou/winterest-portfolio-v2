import { queryOptions } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import type { PublicPageKey } from './page-content-schemas'

export const pageContentQueryKeys = {
  all: ['page-content'] as const,
  details: () => [...pageContentQueryKeys.all, 'detail'] as const,
  detail: (page: PublicPageKey) =>
    [...pageContentQueryKeys.details(), page] as const,
}

export const pageContentQueryOptions = {
  get: <T>(page: PublicPageKey) =>
    queryOptions({
      queryKey: pageContentQueryKeys.detail(page),
      queryFn: async (): Promise<T> => {
        const res = await api<{ data: T }>(`/api/pages/${page}`)
        return res.data
      },
    }),
}
