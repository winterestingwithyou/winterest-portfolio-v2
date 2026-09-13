import { createServerFn } from '@tanstack/react-start'

import { getDefaultHomeConfig } from './validation'
import type { EnthusiasmRecord, HomeConfigInput } from './validation'

export const getHomeConfigServerFn = createServerFn({
  method: 'GET',
}).handler(async (): Promise<HomeConfigInput> => {
  try {
    const [{ env }, { getDb }, { getHomeConfig }] = await Promise.all([
      import('cloudflare:workers'),
      import('#/db'),
      import('./queries'),
    ])

    const db = getDb(env.DB)
    return await getHomeConfig(db)
  } catch (error) {
    console.error('[getHomeConfigServerFn Error]:', error)
    return getDefaultHomeConfig()
  }
})

export const getHomeEnthusiasmsServerFn = createServerFn({
  method: 'GET',
})
  .validator((input?: { all?: boolean }) => input ?? {})
  .handler(async ({ data }): Promise<EnthusiasmRecord[]> => {
    try {
      const [{ env }, { getDb }, { getHomeEnthusiasms }] = await Promise.all([
        import('cloudflare:workers'),
        import('#/db'),
        import('./queries'),
      ])

      const db = getDb(env.DB)
      return await getHomeEnthusiasms(db, { onlyEnabled: !data.all })
    } catch (error) {
      console.error('[getHomeEnthusiasmsServerFn Error]:', error)
      return []
    }
  })
