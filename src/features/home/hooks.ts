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
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: homeQueryKeys.enthusiasms() })

      const previousDashboard = queryClient.getQueryData<EnthusiasmRecord[]>(
        homeQueryKeys.enthusiasmsList(true),
      )
      const previousPublic = queryClient.getQueryData<EnthusiasmRecord[]>(
        homeQueryKeys.enthusiasmsList(undefined),
      )

      if (previousDashboard) {
        queryClient.setQueryData<EnthusiasmRecord[]>(
          homeQueryKeys.enthusiasmsList(true),
          previousDashboard.map((item) =>
            item.id === id ? { ...item, ...input } : item,
          ),
        )
      }

      if (previousPublic) {
        queryClient.setQueryData<EnthusiasmRecord[]>(
          homeQueryKeys.enthusiasmsList(undefined),
          previousPublic.map((item) =>
            item.id === id ? { ...item, ...input } : item,
          ),
        )
      }

      return { previousDashboard, previousPublic }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(
          homeQueryKeys.enthusiasmsList(true),
          context.previousDashboard,
        )
      }
      if (context?.previousPublic) {
        queryClient.setQueryData(
          homeQueryKeys.enthusiasmsList(undefined),
          context.previousPublic,
        )
      }
    },
    onSettled: () => {
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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: homeQueryKeys.enthusiasms() })

      const previousDashboard = queryClient.getQueryData<EnthusiasmRecord[]>(
        homeQueryKeys.enthusiasmsList(true),
      )

      if (previousDashboard) {
        queryClient.setQueryData<EnthusiasmRecord[]>(
          homeQueryKeys.enthusiasmsList(true),
          previousDashboard.filter((item) => item.id !== id),
        )
      }

      return { previousDashboard }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(
          homeQueryKeys.enthusiasmsList(true),
          context.previousDashboard,
        )
      }
    },
    onSettled: () => {
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
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: homeQueryKeys.enthusiasms() })

      const previousDashboard = queryClient.getQueryData<EnthusiasmRecord[]>(
        homeQueryKeys.enthusiasmsList(true),
      )

      if (previousDashboard) {
        const orderMap = new Map(payload.items.map((i) => [i.id, i.sortOrder]))
        const reordered = [...previousDashboard]
          .map((item) => ({
            ...item,
            sortOrder: orderMap.has(item.id)
              ? (orderMap.get(item.id) ?? item.sortOrder)
              : item.sortOrder,
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder)

        queryClient.setQueryData(homeQueryKeys.enthusiasmsList(true), reordered)
      }

      return { previousDashboard }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDashboard) {
        queryClient.setQueryData(
          homeQueryKeys.enthusiasmsList(true),
          context.previousDashboard,
        )
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: homeQueryKeys.enthusiasms(),
      })
    },
  })
}
