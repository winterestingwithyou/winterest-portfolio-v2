import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

import { DashboardHeader } from '#/components/dashboard/dashboard-header'
import { DashboardSidebar } from '#/components/dashboard/dashboard-sidebar'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
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
  loader: async () => {
    const user = await getDashboardSession()
    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useLoaderData()

  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar user={user} />
      <SidebarInset className="min-h-screen bg-background">
        <DashboardHeader user={user} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
