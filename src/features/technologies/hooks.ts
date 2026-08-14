import { useQuery } from '@tanstack/react-query'

import type {
  CategoryRecord,
  PublicStackCategory,
  TechnologyWithCategories,
} from './queries'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<CategoryRecord[]> => {
      const res = await fetch('/api/categories')
      if (!res.ok) {
        throw new Error('Failed to fetch categories')
      }
      const json: { data?: CategoryRecord[] } = await res.json()
      return json.data ?? []
    },
  })
}

export function useTechnologies() {
  return useQuery({
    queryKey: ['technologies'],
    queryFn: async (): Promise<TechnologyWithCategories[]> => {
      const res = await fetch('/api/technologies')
      if (!res.ok) {
        throw new Error('Failed to fetch technologies')
      }
      const json: { data?: TechnologyWithCategories[] } = await res.json()
      return json.data ?? []
    },
  })
}

export function usePublicStack() {
  return useQuery({
    queryKey: ['publicStack'],
    queryFn: async (): Promise<PublicStackCategory[]> => {
      const res = await fetch('/api/stack')
      if (!res.ok) {
        throw new Error('Failed to fetch public stack')
      }
      const json: { data?: PublicStackCategory[] } = await res.json()
      return json.data ?? []
    },
  })
}
