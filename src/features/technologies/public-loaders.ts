import { createServerFn } from '@tanstack/react-start'

export const getPublicStackData = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const [{ env }, { getDb }, { listPublicStack, listUltimateTechnologies }] =
      await Promise.all([
        import('cloudflare:workers'),
        import('#/db'),
        import('./queries'),
      ])

    const db = getDb(env.DB)
    const [categories, ultimateTechs] = await Promise.all([
      listPublicStack(db),
      listUltimateTechnologies(db),
    ])

    return { categories, ultimateTechs }
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      return { categories: [], ultimateTechs: [] }
    }
    throw error
  }
})

export const getPublicUltimateStack = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const [{ env }, { getDb }, { listUltimateTechnologies }] = await Promise.all(
      [import('cloudflare:workers'), import('#/db'), import('./queries')],
    )

    const db = getDb(env.DB)
    return listUltimateTechnologies(db)
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      return []
    }
    throw error
  }
})
