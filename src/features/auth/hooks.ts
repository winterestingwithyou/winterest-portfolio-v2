import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userQueryKeys } from '#/features/users/query-options'
import { api } from '#/lib/api-client'

export type SignInPayload = {
  email: string
  password: string
  callbackURL?: string
  rememberMe?: boolean
  turnstileToken?: string
}

export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SignInPayload) => {
      await api('/api/auth/sign-in/email', {
        method: 'POST',
        headers: payload.turnstileToken
          ? { 'cf-turnstile-response': payload.turnstileToken }
          : undefined,
        body: payload,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.session() })
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api('/api/auth/sign-out', {
        method: 'POST',
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.session() })
    },
  })
}
