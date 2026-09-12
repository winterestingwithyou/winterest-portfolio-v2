import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import { homeQueryKeys } from './query-options'
import type {
  EnthusiasmItemInput,
  EnthusiasmRecord,
  HomeConfigInput,
  ReorderEnthusiasmsInput,
} from './validation'

export function useUpdateHomeConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: HomeConfigInput): Promise<HomeConfigInput> => {
      const res = await api<{ data: HomeConfigInput }>('/api/home/config', {
        method: 'PUT',
        body: payload,
      })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(homeQueryKeys.config(), data)
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.config() })
    },
  })
}

export function useCreateEnthusiasm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: EnthusiasmItemInput,
    ): Promise<EnthusiasmRecord> => {
      const res = await api<{ data: EnthusiasmRecord }>(
        '/api/home/enthusiasms',
        {
          method: 'POST',
          body: payload,
        },
      )
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.enthusiasms(),
      })
    },
  })
}

export function useUpdateEnthusiasm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: Partial<EnthusiasmItemInput>
    }): Promise<EnthusiasmRecord> => {
      const res = await api<{ data: EnthusiasmRecord }>(
        `/api/home/enthusiasms/${id}`,
        {
          method: 'PUT',
          body: input,
        },
      )
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.enthusiasms(),
      })
    },
  })
}

export function useDeleteEnthusiasm() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api(`/api/home/enthusiasms/${id}`, {
        method: 'DELETE',
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.enthusiasms(),
      })
    },
  })
}

export function useReorderEnthusiasms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ReorderEnthusiasmsInput): Promise<void> => {
      await api('/api/home/enthusiasms/reorder', {
        method: 'PUT',
        body: payload,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.enthusiasms(),
      })
    },
  })
}
