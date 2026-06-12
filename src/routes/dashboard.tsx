import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { getDashboardSession } from '#/features/auth/server-functions'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const user = await getDashboardSession()

    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirectTo: location.href,
        },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return <Outlet />
}
