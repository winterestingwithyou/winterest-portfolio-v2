import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import type { SocialLink, SocialLinkInput } from './types'

export const socialQueryKeys = {
  all: ['social-links'] as const,
  public: ['social-links', 'public'] as const,
  detail: (id: string) => ['social-links', id] as const,
}

export function useSocialLinks(options?: {
  enabled?: boolean
  initialData?: SocialLink[]
}) {
  return useQuery<SocialLink[]>({
    queryKey: socialQueryKeys.all,
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
    queryFn: async () => {
      const response = await api<{ data?: SocialLink[] }>('/api/social')
      return response.data ?? []
    },
  })
}

export function usePublicSocialLinks(options?: {
  enabled?: boolean
  initialData?: SocialLink[]
}) {
  return useQuery<SocialLink[]>({
    queryKey: socialQueryKeys.public,
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
    queryFn: async () => {
      const response = await api<{ data?: SocialLink[] }>('/api/social', {
        query: { publicOnly: 'true' },
      })
      return response.data ?? []
    },
  })
}

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
      void queryClient.invalidateQueries({ queryKey: socialQueryKeys.public })
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
      void queryClient.invalidateQueries({ queryKey: socialQueryKeys.public })
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
      void queryClient.invalidateQueries({ queryKey: socialQueryKeys.public })
    },
  })
}
