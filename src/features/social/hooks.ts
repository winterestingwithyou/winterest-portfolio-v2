import { useMutation, useQueryClient } from '@tanstack/react-query'

import { socialQueryKeys } from '#/features/social/query-options'
import type { SocialLink, SocialLinkInput } from '#/features/social/types'
import { api } from '#/lib/api-client'

export function useCreateSocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SocialLinkInput) => {
      const response = await api<{ data?: SocialLink }>('/api/social', {
        method: 'POST',
        body: input,
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: socialQueryKeys.all })
    },
  })
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<SocialLinkInput>
    }) => {
      const response = await api<{ data?: SocialLink }>(`/api/social/${id}`, {
        method: 'PUT',
        body: data,
      })
      return response.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: socialQueryKeys.all })
    },
  })
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api<{ success: boolean }>(`/api/social/${id}`, {
        method: 'DELETE',
      })
      return id
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: socialQueryKeys.all })
    },
  })
}
