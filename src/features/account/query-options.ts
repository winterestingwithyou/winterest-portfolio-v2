import { queryOptions } from '@tanstack/react-query'

import type { AccountProfile } from '#/features/account/queries'
import { api } from '#/lib/api-client'

export const accountQueryKeys = {
  all: ['account'] as const,
  profile: () => [...accountQueryKeys.all, 'profile'] as const,
}

export const accountQueryOptions = {
  profile: () =>
    queryOptions({
      queryKey: accountQueryKeys.profile(),
      queryFn: async (): Promise<AccountProfile> => {
        const res = await api<{ data?: AccountProfile }>('/api/account')
        if (!res.data) {
          throw new Error('Account profile not found.')
        }
        return res.data
      },
    }),
}
