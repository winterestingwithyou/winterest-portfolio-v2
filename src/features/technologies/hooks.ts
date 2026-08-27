import { useQuery } from '@tanstack/react-query'

import { api } from '#/lib/api-client'
import type {
  CategoryRecord,
  PublicStackCategory,
  TechnologyWithCategories,
} from './queries'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoryRecord[]> => {
      const res = await api<{ data?: CategoryRecord[] }>('/api/categories')
      return res.data ?? []
    },
  })
}

export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async (): Promise<TechnologyWithCategories[]> => {
      const res = await api<{ data?: TechnologyWithCategories[] }>(
        '/api/technologies',
      )
      return res.data ?? []
    },
  })
}

export function usePublicStack() {
  return useQuery({
    queryKey: ['publicStack'],
    queryFn: async (): Promise<PublicStackCategory[]> => {
      const res = await api<{ data?: PublicStackCategory[] }>('/api/stack')
      return res.data ?? []
    },
  })
}
