import { Link, useLocation } from '@tanstack/react-router'
import {
  ChevronDown,
  FolderKanban,
  Globe,
  Home,
  Image,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Share2,
  Sparkles,
  User,
  Users,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from '#/components/ui/sidebar'
import { getDashboardCopy } from '#/features/dashboard/copy'
import {
  canManageSettings,
  canManageUsers,
  isUserRole,
} from '#/features/auth/roles'
import { authClient } from '#/lib/auth-client'

type DashboardSidebarProps = {
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
    image?: string | null
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
    {
      to: '/dashboard/social',
      label: copy.shell.nav.social,
      icon: Share2,
      exact: false,
    },
  ]

  const pagesNav = [
    {
      to: '/dashboard/pages/home',
      label: copy.shell.navPages.home,
      icon: Home,
      exact: true,
    },
    {
      to: '/dashboard/pages/projects',
      label: copy.shell.navPages.projects,
      icon: FolderKanban,
      exact: true,
    },
    {
      to: '/dashboard/pages/stack',
      label: copy.shell.navPages.stack,
      icon: Layers,
      exact: true,
    },
    {
      to: '/dashboard/pages/contact',
      label: copy.shell.navPages.contact,
      icon: Mail,
      exact: true,
    },
  ]

  const systemNav = [
    {
      to: '/dashboard/users',
      label: copy.shell.nav.users,
      icon: Users,
      exact: false,
      disabled: false,
    },
    {
      to: '/dashboard/settings',
      label: copy.shell.nav.settings,
      icon: Settings,
      exact: false,
      disabled: false,
    },
    {
      to: '/dashboard/account',
      label: copy.shell.nav.account,
      icon: User,
      exact: false,
      disabled: false,
    },
  ]

  const role = isUserRole(user?.role) ? user.role : null
  const canUsers = role ? canManageUsers(role) : false
  const canSettings = role ? canManageSettings(role) : false

  const filteredSystemNav = systemNav.filter((item) => {
    if (item.to === '/dashboard/users' && !canUsers) return false
    if (item.to === '/dashboard/settings' && !canSettings) return false
    return true
  })

  const isLinkActive = (to: string, exact: boolean) => {
    if (exact) {
      return pathname === to || pathname === `${to}/`
    }
    return pathname.startsWith(to)
  }

  const isPagesActive = pathname.startsWith('/dashboard/pages')

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
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--brand-orange) text-white">
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

      <SidebarContent className="px-2 py-1 no-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] font-bold uppercase tracking-wider text-sidebar-foreground/60">
            {copy.shell.eyebrow}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Overview */}
              <SidebarMenuItem key="/dashboard">
                <SidebarMenuButton
                  asChild
                  isActive={isLinkActive('/dashboard', true)}
                  tooltip={copy.shell.nav.overview}
                  className={
                    isLinkActive('/dashboard', true)
                      ? 'bg-sidebar-accent font-bold text-sidebar-accent-foreground shadow-xs'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                  }
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-4" />
                    <span>{copy.shell.nav.overview}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Collapsible Public Pages Menu */}
              <Collapsible
                asChild
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={copy.shell.pagesGroup}
                      isActive={isPagesActive}
                      className={
                        isPagesActive
                          ? 'font-bold text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                      }
                    >
                      <Globe className="size-4 text-(--brand-orange)" />
                      <span>{copy.shell.pagesGroup}</span>
                      <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90 group-data-[state=open]/collapsible:rotate-0" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {pagesNav.map((item) => {
                        const active = isLinkActive(item.to, item.exact)

                        return (
                          <SidebarMenuSubItem key={item.to}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={active}
                              className={
                                active
                                  ? 'font-bold text-(--brand-orange)'
                                  : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
                              }
                            >
                              <Link to={item.to}>
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other CMS collections: Projects, Stack, Media, Social */}
              {mainNav
                .filter((item) => item.to !== '/dashboard')
                .map((item) => {
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
            {copy.shell.systemGroup}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSystemNav.map((item) => {
                const Icon = item.icon
                const active = isLinkActive(item.to, item.exact)

                if (item.disabled) {
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
                }

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
                  <Avatar className="size-8 shrink-0 border border-(--brand-line)">
                    <AvatarImage
                      src={user?.image ?? undefined}
                      alt={user?.name || user?.email || 'User avatar'}
                    />
                    <AvatarFallback className="bg-(--brand-orange-soft) text-xs font-extrabold text-(--brand-orange-deep)">
                      {user?.name?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        'W'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-sidebar-foreground">
                      {user?.name || user?.email?.split('@')[0] || 'Owner'}
                    </span>
                    <span className="truncate text-[0.7rem] text-sidebar-foreground/70">
                      {user?.email || 'user@example.com'}
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
                    <Avatar className="size-8 shrink-0">
                      <AvatarImage
                        src={user?.image ?? undefined}
                        alt={user?.name || user?.email || 'User avatar'}
                      />
                      <AvatarFallback className="bg-(--brand-orange-soft) text-xs font-extrabold text-(--brand-orange-deep)">
                        {user?.name?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-bold text-(--brand-ink)">
                        {user?.name || 'Owner'}
                      </span>
                      <span className="truncate text-[0.7rem] text-(--brand-muted)">
                        {user?.email || 'user@example.com'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex w-full justify-start gap-2 text-xs font-semibold text-(--brand-ink) hover:bg-surface-soft"
                  >
                    <Link to="/dashboard/account">
                      <User className="size-3.5 text-(--brand-orange)" />
                      {copy.shell.nav.account}
                    </Link>
                  </Button>
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
