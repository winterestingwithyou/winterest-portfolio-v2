import { queryOptions } from '@tanstack/react-query'

import type { CertificateRecord } from '#/features/certificates/queries'
import { api } from '#/lib/api-client'

export type SerializedCertificateRecord = Omit<
  CertificateRecord,
  'issuedAt' | 'expiresAt' | 'createdAt' | 'updatedAt'
> & {
  issuedAt: string
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export function hydrateCertificate(
  record: SerializedCertificateRecord,
): CertificateRecord {
  return {
    ...record,
    issuedAt: new Date(record.issuedAt),
    expiresAt: record.expiresAt ? new Date(record.expiresAt) : null,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  }
}

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
        const response = await api<{ data?: SerializedCertificateRecord[] }>(
          '/api/certificates',
        )
        return response.data?.map(hydrateCertificate) ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: certificateQueryKeys.detail(id),
      queryFn: async (): Promise<CertificateRecord> => {
        const response = await api<{ data?: SerializedCertificateRecord }>(
          `/api/certificates/${id}`,
        )
        if (!response.data) throw new Error('Certificate not found.')
        return hydrateCertificate(response.data)
      },
    }),
}
