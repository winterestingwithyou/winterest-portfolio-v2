import { queryOptions } from '@tanstack/react-query'

import type { UserRecord, UserWithSessionCount } from '#/features/users/queries'
import { api } from '#/lib/api-client'

export interface SessionUser {
  id: string
  role: string
}

interface SessionResponse {
  user?: SessionUser
}

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: () => [...userQueryKeys.lists()] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  session: () => ['session'] as const,
}

export const sessionQueryOptions = {
  current: () =>
    queryOptions({
      queryKey: userQueryKeys.session(),
      queryFn: async (): Promise<SessionUser | null> => {
        const res = await api<SessionResponse>('/api/auth/get-session').catch(
          () => null,
        )
        return res?.user ?? null
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
}

export const userQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: userQueryKeys.list(),
      queryFn: async (): Promise<UserWithSessionCount[]> => {
        const res = await api<{ data?: UserWithSessionCount[] }>('/api/users')
        return res.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: userQueryKeys.detail(id),
      queryFn: async (): Promise<UserRecord> => {
        const res = await api<{ data?: UserRecord }>('/api/users', {
          query: { id },
        })
        if (!res.data) {
          throw new Error('User not found.')
        }
        return res.data
      },
    }),
}
