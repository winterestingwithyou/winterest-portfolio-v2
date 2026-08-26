import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { MediaRecord } from './queries'

export const mediaQueryKeys = {
  all: ['media'] as const,
  list: (search?: string) => [...mediaQueryKeys.all, 'list', { search }] as const,
  detail: (id: string) => [...mediaQueryKeys.all, 'detail', id] as const,
}

export function useMediaList(search?: string) {
  return useQuery({
    queryKey: mediaQueryKeys.list(search),
    queryFn: async (): Promise<MediaRecord[]> => {
      const url = new URL('/api/media', window.location.origin)
      if (search && search.trim()) {
        url.searchParams.set('search', search.trim())
      }

      const res = await fetch(url.toString())
      const json: { data?: MediaRecord[]; error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to fetch media library')
      }

      return json.data ?? []
    },
  })
}

export type UploadMediaPayload = {
  file: File
  alt?: string
}

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadMediaPayload): Promise<MediaRecord> => {
      const formData = new FormData()
      formData.append('file', payload.file)
      if (payload.alt && payload.alt.trim()) {
        formData.append('alt', payload.alt.trim())
      }

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const json: { data?: MediaRecord; error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to upload media')
      }

      if (!json.data) {
        throw new Error('No media returned after upload')
      }

      return json.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      })

      const json: { success?: boolean; error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'Failed to delete media')
      }

      return json.success ?? true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
    },
  })
}
