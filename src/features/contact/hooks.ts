import { useMutation } from '@tanstack/react-query'

import type { ContactInput } from '#/features/contact/validation'
import { api } from '#/lib/api-client'

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (
      payload: ContactInput,
    ): Promise<{ success?: boolean }> => {
      const res = await api<{ success?: boolean }>('/api/contact', {
        method: 'POST',
        body: payload,
      })
      return res
    },
  })
}
