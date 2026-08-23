import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
      const res = await fetch('/api/auth/get-session')
      if (!res.ok) return null
      const data: SessionResponse = await res.json()
      return data.user ?? null
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
      const res = await fetch('/api/users')
      const json: { data?: UserWithSessionCount[]; error?: string } =
        await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to fetch users')
      }
      return json.data ?? []
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
      const res = await fetch(`/api/users?id=${encodeURIComponent(id)}`)
      const json: { data?: UserRecord; error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'User not found')
      }
      if (!json.data) {
        throw new Error('User not found')
      }
      return json.data
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
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: { data?: UserRecord; error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to create user')
      }
      if (!json.data) throw new Error('Failed to create user')
      return json.data
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
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: { data?: UserRecord; error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to update user')
      }
      if (!json.data) throw new Error('Failed to update user')
      return json.data
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
      const res = await fetch(
        `/api/users?id=${encodeURIComponent(userId)}`,
        { method: 'DELETE' },
      )
      const json: { error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to delete user')
      }
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
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: { error?: string } = await res.json()
      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to reset password')
      }
    },
  })
}
