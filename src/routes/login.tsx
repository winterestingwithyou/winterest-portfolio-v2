import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthCopy } from '#/features/auth/copy'
import { LoginPage } from '#/features/auth/pages/login-page'
import { getDashboardSession } from '#/features/auth/server-functions'

export function getSafeRedirect(url?: unknown): string {
  if (typeof url !== 'string' || !url) return '/dashboard'
  const trimmed = url.trim()
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\')
  ) {
    return '/dashboard'
  }
  return trimmed
}

type LoginSearch = {
  redirectTo?: string
}

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirectTo:
      typeof search.redirectTo === 'string'
        ? getSafeRedirect(search.redirectTo)
        : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const user = await getDashboardSession()

    if (user) {
      throw redirect({ to: getSafeRedirect(search.redirectTo) })
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
