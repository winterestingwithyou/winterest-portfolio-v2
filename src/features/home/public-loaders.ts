import { createServerFn } from '@tanstack/react-start'

import { getDefaultEnthusiasms } from './queries'
import { getDefaultHomeConfig } from './validation'
import type { EnthusiasmRecord, HomeConfigInput } from './validation'

export type PublicHomeData = {
  config: HomeConfigInput
  enthusiasms: EnthusiasmRecord[]
}

export const getPublicHomeContent = createServerFn({
  method: 'GET',
}).handler(async (): Promise<PublicHomeData> => {
  try {
    const [{ env }, { getDb }, { getHomeConfig, getHomeEnthusiasms }] =
      await Promise.all([
        import('cloudflare:workers'),
        import('#/db'),
        import('./queries'),
      ])
    const db = getDb(env.DB)
    const [config, enthusiasms] = await Promise.all([
      getHomeConfig(db),
      getHomeEnthusiasms(db, { onlyEnabled: true }),
    ])
    return { config, enthusiasms }
  } catch (error) {
    console.error('[getPublicHomeContent Error]:', error)
    return {
      config: getDefaultHomeConfig(),
      enthusiasms: getDefaultEnthusiasms(),
    }
  }
})
