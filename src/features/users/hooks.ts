import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import type { UserRecord, UserWithSessionCount } from './queries'

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const userQueryKeys = {
  all: ['users'] as const,
  list: () => [...userQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...userQueryKeys.all, 'detail', id] as const,
  session: () => ['session'] as const,
}

// ---------------------------------------------------------------------------
// Session (current user)
// ---------------------------------------------------------------------------

interface SessionUser {
  id: string
  role: string
}

interface SessionResponse {
  user?: SessionUser
}

export function useCurrentSession() {
  return useQuery({
    queryKey: userQueryKeys.session(),
    queryFn: async (): Promise<SessionUser | null> => {
      const res = await api<SessionResponse>('/api/auth/get-session').catch(() => null)
      return res?.user ?? null
    },
    staleTime: 1000 * 60 * 5, // 5 min – session doesn't change often
  })
}

// ---------------------------------------------------------------------------
// User list
// ---------------------------------------------------------------------------

export function useUsers() {
  return useQuery({
    queryKey: userQueryKeys.list(),
    queryFn: async (): Promise<UserWithSessionCount[]> => {
      const res = await api<{ data?: UserWithSessionCount[] }>('/api/users')
      return res.data ?? []
    },
  })
}

// ---------------------------------------------------------------------------
// Single user
// ---------------------------------------------------------------------------

export function useUser(id: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: async (): Promise<UserRecord> => {
      const res = await api<{ data?: UserRecord }>('/api/users', {
        query: { id },
      })
      if (!res.data) {
        throw new Error('User not found')
      }
      return res.data
    },
  })
}

// ---------------------------------------------------------------------------
// Create user mutation
// ---------------------------------------------------------------------------

interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: string
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateUserPayload): Promise<UserRecord> => {
      const res = await api<{ data?: UserRecord }>('/api/users', {
        method: 'POST',
        body: payload,
      })
      if (!res.data) throw new Error('Failed to create user')
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.list() })
    },
  })
}

// ---------------------------------------------------------------------------
// Update user mutation
// ---------------------------------------------------------------------------

interface UpdateUserPayload {
  id: string
  name?: string
  email?: string
  role?: string
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UpdateUserPayload): Promise<UserRecord> => {
      const res = await api<{ data?: UserRecord }>('/api/users', {
        method: 'PUT',
        body: payload,
      })
      if (!res.data) throw new Error('Failed to update user')
      return res.data
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.list() })
      void queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(data.id),
      })
    },
  })
}

// ---------------------------------------------------------------------------
// Delete user mutation
// ---------------------------------------------------------------------------

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      await api<void>('/api/users', {
        method: 'DELETE',
        query: { id: userId },
      })
    },
    onSuccess: (_data, userId) => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.list() })
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(userId) })
    },
  })
}

// ---------------------------------------------------------------------------
// Reset password mutation
// ---------------------------------------------------------------------------

interface ResetPasswordPayload {
  id: string
  newPassword: string
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload): Promise<void> => {
      await api<void>('/api/users/reset-password', {
        method: 'POST',
        body: payload,
      })
    },
  })
}
