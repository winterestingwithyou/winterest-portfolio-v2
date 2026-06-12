import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

export const getDashboardSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getDashboardUserFromRequest } = await import('./session')
    const user = await getDashboardUserFromRequest(getRequest())

    return user
  },
)
