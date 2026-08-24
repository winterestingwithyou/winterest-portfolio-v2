import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { userQueryKeys } from '#/features/users/hooks'

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
      const res = await fetch('/api/account')
      const json: { data?: AccountProfile; error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to fetch account profile')
      }
      if (!json.data) {
        throw new Error('Account profile not found')
      }
      return json.data
    },
  })
}

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateProfileInput): Promise<AccountProfile> => {
      const res = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: { data?: AccountProfile; error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to update profile')
      }
      if (!json.data) {
        throw new Error('Failed to update profile')
      }
      return json.data
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
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: { error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to change password')
      }
    },
  })
}
