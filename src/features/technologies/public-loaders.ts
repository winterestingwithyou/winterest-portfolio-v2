import { createServerFn } from '@tanstack/react-start'

export const getPublicStackData = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const [{ env }, { getDb }, { listPublicStack }] = await Promise.all([
      import('cloudflare:workers'),
      import('#/db'),
      import('./queries'),
    ])

    const db = getDb(env.DB)
    return listPublicStack(db)
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) {
      return []
    }
    throw error
  }
})
