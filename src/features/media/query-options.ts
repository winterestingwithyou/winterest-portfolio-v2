import { queryOptions } from '@tanstack/react-query'

import type { MediaRecord } from '#/features/media/queries'
import { api } from '#/lib/api-client'

export const mediaQueryKeys = {
  all: ['media'] as const,
  lists: () => [...mediaQueryKeys.all, 'list'] as const,
  list: (search?: string) =>
    [...mediaQueryKeys.lists(), { search: search?.trim() || undefined }] as const,
  details: () => [...mediaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...mediaQueryKeys.details(), id] as const,
}

export const mediaQueryOptions = {
  list: (search?: string) =>
    queryOptions({
      queryKey: mediaQueryKeys.list(search),
      queryFn: async (): Promise<MediaRecord[]> => {
        const res = await api<{ data?: MediaRecord[] }>('/api/media', {
          query: search?.trim() ? { search: search.trim() } : undefined,
        })
        return res.data ?? []
      },
    }),
}
