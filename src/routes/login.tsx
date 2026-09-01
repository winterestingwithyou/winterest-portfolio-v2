import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAuthCopy } from '#/features/auth/copy'
import { LoginPage } from '#/features/auth/pages/login-page'
import { getDashboardSession } from '#/features/auth/server-functions'
import { createRouteMeta } from '#/lib/metadata'

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

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirectTo: typeof search.redirectTo === 'string' ? search.redirectTo : '',
  }),
  beforeLoad: async ({ search }) => {
    const user = await getDashboardSession()

    if (user) {
      throw redirect({ to: getSafeRedirect(search.redirectTo) })
    }
  },
  head: ({ matches }) => {
    const copy = getAuthCopy()
    return createRouteMeta({
      matches,
      title: copy.metaTitle,
      description: copy.metaDescription,
    })
  },
  component: LoginRouteComponent,
})

function LoginRouteComponent() {
  const { redirectTo } = Route.useSearch()
  return <LoginPage redirectTo={redirectTo} />
}
