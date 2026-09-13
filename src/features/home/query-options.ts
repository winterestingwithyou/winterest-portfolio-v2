import { queryOptions } from '@tanstack/react-query'

import {
  getHomeConfigServerFn,
  getHomeEnthusiasmsServerFn,
} from './server-functions'
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
        return await getHomeConfigServerFn()
      },
    }),

  enthusiasms: (all?: boolean) =>
    queryOptions({
      queryKey: homeQueryKeys.enthusiasmsList(all),
      queryFn: async (): Promise<EnthusiasmRecord[]> => {
        return await getHomeEnthusiasmsServerFn({
          data: { all },
        })
      },
    }),
}
