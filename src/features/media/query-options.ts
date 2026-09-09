import { queryOptions } from '@tanstack/react-query'

import type {
  MediaPaginationMeta,
  MediaRecord,
  MediaRecordWithUsage,
} from '#/features/media/queries'
import { api } from '#/lib/api-client'

export type MediaQueryFilter = {
  search?: string
  type?: 'all' | 'image' | 'document'
  page?: number
  limit?: number
}

export type MediaResponse = {
  data: MediaRecord[]
  pagination: MediaPaginationMeta
}

export const mediaQueryKeys = {
  all: ['media'] as const,
  lists: () => [...mediaQueryKeys.all, 'list'] as const,
  list: (filter?: MediaQueryFilter) =>
    [
      ...mediaQueryKeys.lists(),
      {
        search: filter?.search?.trim() || undefined,
        type: filter?.type && filter.type !== 'all' ? filter.type : undefined,
        page: filter?.page ?? 1,
        limit: filter?.limit ?? 12,
      },
    ] as const,
  details: () => [...mediaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...mediaQueryKeys.details(), id] as const,
}

export const mediaQueryOptions = {
  list: (filter?: MediaQueryFilter) =>
    queryOptions({
      queryKey: mediaQueryKeys.list(filter),
      queryFn: async (): Promise<MediaResponse> => {
        const queryParams: Record<string, string | number> = {}
        if (filter?.search?.trim()) queryParams.search = filter.search.trim()
        if (filter?.type && filter.type !== 'all')
          queryParams.type = filter.type
        if (filter?.page) queryParams.page = filter.page
        if (filter?.limit) queryParams.limit = filter.limit

        return api<MediaResponse>('/api/media', {
          query: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        })
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: mediaQueryKeys.detail(id),
      queryFn: async (): Promise<MediaRecordWithUsage> => {
        const res = await api<{ data: MediaRecordWithUsage }>(
          `/api/media/${id}`,
        )
        return res.data
      },
    }),
}
