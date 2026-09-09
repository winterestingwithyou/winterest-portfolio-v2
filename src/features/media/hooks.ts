import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { MediaRecord } from '#/features/media/queries'
import { mediaQueryKeys } from '#/features/media/query-options'
import { projectQueryKeys } from '#/features/projects/query-options'
import { settingsQueryKeys } from '#/features/settings/query-options'
import { techQueryKeys } from '#/features/technologies/query-options'
import { api } from '#/lib/api-client'

export { mediaQueryKeys }

export type UploadMediaPayload = {
  file: File
  alt?: string
}

export type DeleteMediaPayload = {
  id: string
  cascade?: boolean
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
    mutationFn: async (
      payload: string | DeleteMediaPayload,
    ): Promise<{ success: boolean; clearedReferences: number }> => {
      const id = typeof payload === 'string' ? payload : payload.id
      const cascade =
        typeof payload === 'string' ? false : (payload.cascade ?? false)

      const res = await api<{ success?: boolean; clearedReferences?: number }>(
        `/api/media/${id}`,
        {
          method: 'DELETE',
          query: cascade ? { cascade: 'true' } : undefined,
        },
      )

      return {
        success: res.success ?? true,
        clearedReferences: res.clearedReferences ?? 0,
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: techQueryKeys.all })
    },
  })
}
