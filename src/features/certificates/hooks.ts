import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { CertificateRecord } from '#/features/certificates/queries'
import { certificateQueryKeys } from '#/features/certificates/query-options'
import type { CertificateInput } from '#/features/certificates/validation'
import { api } from '#/lib/api-client'

export function useCreateCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CertificateInput) => {
      const response = await api<{ data?: CertificateRecord }>(
        '/api/certificates',
        { method: 'POST', body: input },
      )
      if (!response.data) throw new Error('Certificate was not created.')
      return response.data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.all }),
  })
}

export function useUpdateCertificate(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CertificateInput) => {
      const response = await api<{ data?: CertificateRecord }>(
        `/api/certificates/${id}`,
        { method: 'PATCH', body: input },
      )
      if (!response.data) throw new Error('Certificate was not updated.')
      return response.data
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.all }),
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api(`/api/certificates/${id}`, { method: 'DELETE' })
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: certificateQueryKeys.all }),
  })
}
