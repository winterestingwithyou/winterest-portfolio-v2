import { createServerFn } from '@tanstack/react-start'

import type { SiteSettingsInput } from './types'
import { defaultSiteSettings } from './types'

export const getPublicSiteSettings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SiteSettingsInput> => {
    try {
      const [{ env }, { getDb }, { getSiteSettings }] = await Promise.all([
        import('cloudflare:workers'),
        import('#/db'),
        import('#/features/settings/queries'),
      ])

      const db = getDb(env.DB)
      return await getSiteSettings(db)
    } catch {
      return defaultSiteSettings
    }
  },
)
