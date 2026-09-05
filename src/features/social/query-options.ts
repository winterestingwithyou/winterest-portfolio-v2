import { queryOptions } from '@tanstack/react-query'

import type { SocialLink } from '#/features/social/types'
import { api } from '#/lib/api-client'

export const socialQueryKeys = {
  all: ['social-links'] as const,
  lists: () => [...socialQueryKeys.all, 'list'] as const,
  list: () => [...socialQueryKeys.lists()] as const,
  public: () => [...socialQueryKeys.all, 'public'] as const,
  detail: (id: string) => [...socialQueryKeys.all, 'detail', id] as const,
}

export const socialQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: socialQueryKeys.list(),
      queryFn: async (): Promise<SocialLink[]> => {
        const response = await api<{ data?: SocialLink[] }>('/api/social')
        return response.data ?? []
      },
    }),
  publicList: () =>
    queryOptions({
      queryKey: socialQueryKeys.public(),
      queryFn: async (): Promise<SocialLink[]> => {
        const response = await api<{ data?: SocialLink[] }>('/api/social', {
          query: { publicOnly: 'true' },
        })
        return response.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: socialQueryKeys.detail(id),
      queryFn: async (): Promise<SocialLink> => {
        const response = await api<{ data?: SocialLink }>(`/api/social/${id}`)
        if (!response.data) {
          throw new Error('Social link not found.')
        }
        return response.data
      },
    }),
}
