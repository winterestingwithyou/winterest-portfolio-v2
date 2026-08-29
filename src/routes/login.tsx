import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthCopy } from '#/features/auth/content/auth-copy'
import { LoginPage } from '#/features/auth/pages/login-page'
import { getDashboardSession } from '#/features/auth/server-functions'

type LoginSearch = {
  redirectTo?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirectTo:
      typeof search.redirectTo === 'string' ? search.redirectTo : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const user = await getDashboardSession()

    if (user) {
      throw redirect({ to: search.redirectTo ?? '/dashboard' })
    }
  },
  head: () => {
    const copy = getAuthCopy()

    return {
      meta: [
        {
          title: copy.metaTitle,
        },
        {
          name: 'description',
          content: copy.metaDescription,
        },
      ],
    }
  },
  component: LoginRouteComponent,
})

function LoginRouteComponent() {
  const { redirectTo } = Route.useSearch()
  return <LoginPage redirectTo={redirectTo} />
}
