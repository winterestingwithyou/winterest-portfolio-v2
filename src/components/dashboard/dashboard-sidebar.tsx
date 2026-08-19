import { Link, useLocation } from '@tanstack/react-router'
import {
  FolderKanban,
  Home,
  Image,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '#/components/ui/sidebar'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { authClient } from '#/lib/auth-client'

type DashboardSidebarProps = {
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  } | null
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const copy = getDashboardCopy()
  const location = useLocation()
  const pathname = location.pathname

  const mainNav = [
    {
      to: '/dashboard',
      label: copy.shell.nav.overview,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: '/dashboard/projects',
      label: copy.shell.nav.projects,
      icon: FolderKanban,
      exact: false,
    },
    {
      to: '/dashboard/stack',
      label: copy.shell.nav.stack,
      icon: Layers,
      exact: false,
    },
    {
      to: '/dashboard/media',
      label: copy.shell.nav.media,
      icon: Image,
      exact: false,
    },
  ]

  const systemNav = [
    {
      to: '/dashboard/users',
      label: copy.shell.nav.users,
      icon: Users,
    },
    {
      to: '/dashboard/settings',
      label: copy.shell.nav.settings,
      icon: Settings,
    },
  ]

  const isLinkActive = (to: string, exact: boolean) => {
    if (exact) {
      return pathname === to || pathname === `${to}/`
    }
    return pathname.startsWith(to)
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Winterest CMS">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-(--brand-orange) to-(--brand-orange-deep) text-white shadow-[0_4px_12px_var(--brand-orange-soft)]">
                  <Sparkles className="size-5" />
                </div>
                <div className="flex flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-sidebar-foreground">
                    Winterest
                  </span>
                  <span className="text-[0.7rem] font-semibold text-sidebar-foreground/70">
                    CMS Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] font-bold uppercase tracking-wider text-sidebar-foreground/60">
            {copy.shell.eyebrow}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const Icon = item.icon
                const active = isLinkActive(item.to, item.exact)

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={
                        active
                          ? 'bg-sidebar-accent font-bold text-sidebar-accent-foreground shadow-xs'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                      }
                    >
                      <Link to={item.to}>
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] font-bold uppercase tracking-wider text-sidebar-foreground/60">
            Sistem
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      disabled
                      tooltip={`${item.label} (${copy.shell.soon})`}
                      className="cursor-not-allowed text-sidebar-foreground/50 opacity-60"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                      <SidebarMenuBadge className="bg-sidebar-accent text-[0.6rem] font-extrabold uppercase text-sidebar-foreground/70">
                        {copy.shell.soon}
                      </SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={copy.shell.backToSite}>
                  <Link
                    to="/"
                    className="text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Home className="size-4" />
                    <span>{copy.shell.backToSite}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={user?.email || 'Winterest Owner'}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-(--brand-line) bg-(--brand-orange-soft) text-xs font-extrabold text-(--brand-orange-deep)">
                    {user?.name?.[0]?.toUpperCase() ||
                      user?.email?.[0]?.toUpperCase() ||
                      'W'}
                  </div>
                  <div className="flex min-w-0 flex-col text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-sidebar-foreground">
                      {user?.name ||
                        user?.email?.split('@')[0] ||
                        'Winterest Owner'}
                    </span>
                    <span className="truncate text-[0.7rem] text-sidebar-foreground/70">
                      {user?.email || 'owner@winterest.tech'}
                    </span>
                  </div>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                align="end"
                className="w-56 p-3 nav-popover-content"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 border-b border-(--brand-line) pb-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-(--brand-orange-soft) text-xs font-extrabold text-(--brand-orange-deep)">
                      {user?.name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        'W'}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-bold text-(--brand-ink)">
                        {user?.name || 'Winterest Owner'}
                      </span>
                      <span className="truncate text-[0.7rem] text-(--brand-muted)">
                        {user?.email || 'owner@winterest.tech'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      void authClient
                        .signOut()
                        .then(() => window.location.assign('/'))
                    }}
                    className="mt-1 flex w-full justify-start gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="size-3.5" />
                    {copy.shell.logout}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
