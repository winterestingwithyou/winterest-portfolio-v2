import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import type { MediaRecord } from '#/features/media/queries'
import {
  mediaQueryKeys,
} from '#/features/media/query-options'
import { api } from '#/lib/api-client'

export { mediaQueryKeys }

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

      const res = await api<{ data?: MediaRecord }>('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (!res.data) {
        throw new Error('No media returned after upload')
      }

      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const res = await api<{ success?: boolean }>(`/api/media/${id}`, {
        method: 'DELETE',
      })

      return res.success ?? true
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
    },
  })
}
