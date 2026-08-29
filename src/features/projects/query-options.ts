import { queryOptions } from '@tanstack/react-query'

import type { DashboardProjectRecord } from '#/features/projects/queries'
import { api } from '#/lib/api-client'

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: () => [...projectQueryKeys.lists()] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
}

export const projectQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: projectQueryKeys.list(),
      queryFn: async (): Promise<DashboardProjectRecord[]> => {
        const res = await api<{ data?: DashboardProjectRecord[] }>(
          '/api/projects',
        )
        return res.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: projectQueryKeys.detail(id),
      queryFn: async (): Promise<DashboardProjectRecord> => {
        const res = await api<{ data?: DashboardProjectRecord }>(
          `/api/projects/${id}`,
        )
        if (!res.data) {
          throw new Error('Project not found.')
        }
        return res.data
      },
    }),
}
