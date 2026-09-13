import { queryOptions } from '@tanstack/react-query'

import type { PublicPageConfig, PublicPageKey } from './page-content-schemas'
import { getPublicPageContent } from './public-loaders'

export const pageContentQueryKeys = {
  all: ['page-content'] as const,
  details: () => [...pageContentQueryKeys.all, 'detail'] as const,
  detail: (page: PublicPageKey) =>
    [...pageContentQueryKeys.details(), page] as const,
}

export const pageContentQueryOptions = {
  get: <T extends PublicPageConfig = PublicPageConfig>(page: PublicPageKey) =>
    queryOptions({
      queryKey: pageContentQueryKeys.detail(page),
      queryFn: async (): Promise<T> => {
        const content = await getPublicPageContent({
          data: { page },
        })
        return content as T
      },
    }),
}
