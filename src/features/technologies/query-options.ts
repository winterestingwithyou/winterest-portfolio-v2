import { queryOptions } from '@tanstack/react-query'

import type {
  CategoryRecord,
  PublicStackCategory,
  TechnologyWithCategories,
} from '#/features/technologies/queries'
import { api } from '#/lib/api-client'

export const categoryQueryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryQueryKeys.all, 'list'] as const,
  list: () => [...categoryQueryKeys.lists()] as const,
  details: () => [...categoryQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryQueryKeys.details(), id] as const,
}

export const techQueryKeys = {
  all: ['technologies'] as const,
  lists: () => [...techQueryKeys.all, 'list'] as const,
  list: () => [...techQueryKeys.lists()] as const,
  details: () => [...techQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...techQueryKeys.details(), id] as const,
}

export const stackQueryKeys = {
  all: ['stack'] as const,
  public: () => [...stackQueryKeys.all, 'public'] as const,
}

export const categoryQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: categoryQueryKeys.list(),
      queryFn: async (): Promise<CategoryRecord[]> => {
        const res = await api<{ data?: CategoryRecord[] }>('/api/categories')
        return res.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: categoryQueryKeys.detail(id),
      queryFn: async (): Promise<CategoryRecord> => {
        const res = await api<{ data?: CategoryRecord }>('/api/categories', {
          query: { id },
        })
        if (!res.data) {
          throw new Error('Category not found.')
        }
        return res.data
      },
    }),
}

export const techQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: techQueryKeys.list(),
      queryFn: async (): Promise<TechnologyWithCategories[]> => {
        const res = await api<{ data?: TechnologyWithCategories[] }>(
          '/api/technologies',
        )
        return res.data ?? []
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: techQueryKeys.detail(id),
      queryFn: async (): Promise<TechnologyWithCategories> => {
        const res = await api<{ data?: TechnologyWithCategories }>(
          '/api/technologies',
          {
            query: { id },
          },
        )
        if (!res.data) {
          throw new Error('Technology not found.')
        }
        return res.data
      },
    }),
}

export const stackQueryOptions = {
  public: () =>
    queryOptions({
      queryKey: stackQueryKeys.public(),
      queryFn: async (): Promise<PublicStackCategory[]> => {
        const res = await api<{ data?: PublicStackCategory[] }>('/api/stack')
        return res.data ?? []
      },
    }),
}
