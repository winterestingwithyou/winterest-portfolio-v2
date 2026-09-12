import { createServerFn } from '@tanstack/react-start'

import {
  getDefaultContactPageConfig,
  getDefaultProjectsPageConfig,
  getDefaultStackPageConfig,
  publicPageKeys,
} from './page-content-schemas'
import type { PublicPageConfig, PublicPageKey } from './page-content-schemas'

export const getPublicPageContent = createServerFn({
  method: 'GET',
})
  .validator((input: { page: string }) => {
    if (!publicPageKeys.includes(input.page as PublicPageKey)) {
      throw new Error(`Invalid public page key: ${input.page}`)
    }
    return { page: input.page as PublicPageKey }
  })
  .handler(async ({ data }): Promise<PublicPageConfig> => {
    try {
      const [{ env }, { getDb }, { getPageContent }] = await Promise.all([
        import('cloudflare:workers'),
        import('#/db'),
        import('./page-content-queries'),
      ])
      const db = getDb(env.DB)
      return await getPageContent(db, data.page)
    } catch (error) {
      console.error(`[getPublicPageContent Error] (${data.page}):`, error)
      switch (data.page) {
        case 'projects':
          return getDefaultProjectsPageConfig()
        case 'stack':
          return getDefaultStackPageConfig()
        case 'contact':
          return getDefaultContactPageConfig()
      }
    }
  })
