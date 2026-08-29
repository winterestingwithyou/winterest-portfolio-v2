import { useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  CategoryInput,
  CategoryRecord,
  TechnologyInput,
  TechnologyWithCategories,
} from '#/features/technologies/queries'
import {
  categoryQueryKeys,
  stackQueryKeys,
  techQueryKeys,
} from '#/features/technologies/query-options'
import { api } from '#/lib/api-client'

// Category Mutations
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CategoryInput): Promise<CategoryRecord> => {
      const res = await api<{ data?: CategoryRecord }>('/api/categories', {
        method: 'POST',
        body: payload,
      })
      if (!res.data) {
        throw new Error('Gagal menambahkan kategori.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: stackQueryKeys.all })
    },
  })
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CategoryInput): Promise<CategoryRecord> => {
      const res = await api<{ data?: CategoryRecord }>('/api/categories', {
        method: 'PUT',
        query: { id },
        body: payload,
      })
      if (!res.data) {
        throw new Error('Gagal memperbarui kategori.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: stackQueryKeys.all })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api('/api/categories', {
        method: 'DELETE',
        query: { id },
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: stackQueryKeys.all })
    },
  })
}

// Technology Mutations
export function useCreateTechnology() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: TechnologyInput,
    ): Promise<TechnologyWithCategories> => {
      const res = await api<{ data?: TechnologyWithCategories }>(
        '/api/technologies',
        {
          method: 'POST',
          body: payload,
        },
      )
      if (!res.data) {
        throw new Error('Gagal menambahkan teknologi.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: techQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: stackQueryKeys.all })
    },
  })
}

export function useUpdateTechnology(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: TechnologyInput,
    ): Promise<TechnologyWithCategories> => {
      const res = await api<{ data?: TechnologyWithCategories }>(
        '/api/technologies',
        {
          method: 'PUT',
          query: { id },
          body: payload,
        },
      )
      if (!res.data) {
        throw new Error('Gagal memperbarui teknologi.')
      }
      return res.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: techQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: stackQueryKeys.all })
    },
  })
}

export function useDeleteTechnology() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api('/api/technologies', {
        method: 'DELETE',
        query: { id },
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: techQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: stackQueryKeys.all })
    },
  })
}
