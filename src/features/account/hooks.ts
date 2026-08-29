import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AccountProfile } from '#/features/account/queries'
import { accountQueryKeys } from '#/features/account/query-options'
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from '#/features/account/validation'
import { userQueryKeys } from '#/features/users/query-options'
import { api } from '#/lib/api-client'

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      payload: UpdateProfileInput,
    ): Promise<AccountProfile> => {
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
      void queryClient.invalidateQueries({
        queryKey: accountQueryKeys.profile(),
      })
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
