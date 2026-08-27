import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userQueryKeys } from '#/features/users/hooks'
import { api } from '#/lib/api-client'

import type { AccountProfile } from './queries'
import type { ChangePasswordInput, UpdateProfileInput } from './validation'

export const accountQueryKeys = {
  all: ['account'] as const,
  profile: () => [...accountQueryKeys.all, 'profile'] as const,
}

export function useAccountProfile() {
  return useQuery({
    queryKey: accountQueryKeys.profile(),
    queryFn: async (): Promise<AccountProfile> => {
      const res = await api<{ data?: AccountProfile }>('/api/account')
      if (!res.data) {
        throw new Error('Account profile not found')
      }
      return res.data
    },
  })
}

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateProfileInput): Promise<AccountProfile> => {
      const res = await api<{ data?: AccountProfile }>('/api/account', {
        method: 'PUT',
        body: payload,
      })
      if (!res.data) {
        throw new Error('Failed to update profile')
      }
      return res.data
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: accountQueryKeys.profile() })
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.session() })
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.list() })
      void queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(data.id),
      })
    },
  })
}

export function useChangeAccountPassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordInput): Promise<void> => {
      await api<void>('/api/account/password', {
        method: 'POST',
        body: payload,
      })
    },
  })
}
