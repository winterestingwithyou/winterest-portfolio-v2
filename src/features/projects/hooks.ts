import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { DashboardProjectRecord } from '#/features/projects/queries'
import { projectQueryKeys } from '#/features/projects/query-options'
import type { ProjectInput } from '#/features/projects/validation'
import { api } from '#/lib/api-client'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: ProjectInput,
    ): Promise<DashboardProjectRecord> => {
      const res = await api<{ data?: DashboardProjectRecord }>(
        '/api/projects',
        {
          method: 'POST',
          body: payload,
        },
      )
      if (!res.data) {
        throw new Error('Gagal menambahkan project.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
    },
  })
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: ProjectInput,
    ): Promise<DashboardProjectRecord> => {
      const res = await api<{ data?: DashboardProjectRecord }>(
        `/api/projects/${id}`,
        {
          method: 'PATCH',
          body: payload,
        },
      )
      if (!res.data) {
        throw new Error('Gagal memperbarui project.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api(`/api/projects/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectQueryKeys.all })
    },
  })
}
