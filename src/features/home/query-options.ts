import { queryOptions } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import type { EnthusiasmRecord, HomeConfigInput } from './validation'

export const homeQueryKeys = {
  all: ['home'] as const,
  config: () => [...homeQueryKeys.all, 'config'] as const,
  enthusiasms: () => [...homeQueryKeys.all, 'enthusiasms'] as const,
  enthusiasmsList: (all?: boolean) =>
    [...homeQueryKeys.enthusiasms(), { all }] as const,
}

export const homeQueryOptions = {
  config: () =>
    queryOptions({
      queryKey: homeQueryKeys.config(),
      queryFn: async (): Promise<HomeConfigInput> => {
        const res = await api<{ data: HomeConfigInput }>('/api/home/config')
        return res.data
      },
    }),

  enthusiasms: (all?: boolean) =>
    queryOptions({
      queryKey: homeQueryKeys.enthusiasmsList(all),
      queryFn: async (): Promise<EnthusiasmRecord[]> => {
        const res = await api<{ data: EnthusiasmRecord[] }>(
          '/api/home/enthusiasms',
          {
            query: all ? { all: 'true' } : undefined,
          },
        )
        return res.data
      },
    }),
}
