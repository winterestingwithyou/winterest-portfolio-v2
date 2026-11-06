import { queryOptions } from '@tanstack/react-query'

import type { CertificateRecord } from '#/features/certificates/queries'
import { api } from '#/lib/api-client'

export const certificateQueryKeys = {
  all: ['certificates'] as const,
  list: () => [...certificateQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...certificateQueryKeys.all, 'detail', id] as const,
}

export const certificateQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: certificateQueryKeys.list(),
      queryFn: async (): Promise<CertificateRecord[]> => {
        const response = await api<{ data?: CertificateRecord[] }>(
          '/api/certificates',
        )
        return response.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: certificateQueryKeys.detail(id),
      queryFn: async (): Promise<CertificateRecord> => {
        const response = await api<{ data?: CertificateRecord }>(
          `/api/certificates/${id}`,
        )
        if (!response.data) throw new Error('Certificate not found.')
        return response.data
      },
    }),
}
