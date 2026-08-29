import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UserRecord } from '#/features/users/queries'
import { userQueryKeys } from '#/features/users/query-options'
import type {
  CreateUserInput,
  ResetPasswordInput,
  UpdateUserInput,
} from '#/features/users/validation'
import { api } from '#/lib/api-client'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserInput): Promise<UserRecord> => {
      const res = await api<{ data?: UserRecord }>('/api/users', {
        method: 'POST',
        body: payload,
      })
      if (!res.data) {
        throw new Error('Gagal membuat user.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateUserInput): Promise<UserRecord> => {
      const res = await api<{ data?: UserRecord }>('/api/users', {
        method: 'PUT',
        query: { id: payload.id },
        body: payload,
      })
      if (!res.data) {
        throw new Error('Gagal memperbarui user.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api<void>('/api/users', {
        method: 'DELETE',
        query: { id },
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordInput): Promise<void> => {
      await api<void>('/api/users/reset-password', {
        method: 'POST',
        body: payload,
      })
    },
  })
}
