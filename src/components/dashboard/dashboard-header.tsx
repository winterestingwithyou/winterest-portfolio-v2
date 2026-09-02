import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, LogOut, User } from 'lucide-react'

import ParaglideLocaleSwitcher from '#/components/locale-switcher'
import ThemeToggle from '#/components/theme-toggle'
import { Button } from '#/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Separator } from '#/components/ui/separator'
import { SidebarTrigger } from '#/components/ui/sidebar'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { authClient } from '#/lib/auth-client'

type DashboardHeaderProps = {
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  } | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const copy = getDashboardCopy()
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`
    const isId = segment.length > 20 || /^\d+$/.test(segment)
    const breadcrumbLabels = copy.shell.breadcrumbs as Record<string, string>
    const label = isId
      ? breadcrumbLabels.edit || 'Edit'
      : breadcrumbLabels[segment] || segment

    return { label, url, isLast: index === pathSegments.length - 1 }
  })

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear">
      <div className="flex items-center gap-2 text-sm">
        <SidebarTrigger className="-ml-1 text-sidebar-foreground hover:bg-sidebar-accent" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 bg-sidebar-border"
        />
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs"
        >
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.url} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="size-3 text-sidebar-foreground/40" />
              )}
              {crumb.isLast ? (
                <span className="font-semibold text-(--brand-ink)">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.url}
                  className="text-sidebar-foreground/70 transition hover:text-sidebar-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <ParaglideLocaleSwitcher />
        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-full border border-sidebar-border bg-sidebar px-2.5 py-1 text-xs font-semibold text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex size-5 items-center justify-center rounded-full bg-(--brand-orange-soft) text-[0.65rem] font-extrabold text-(--brand-orange-deep)">
                {user?.name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  'W'}
              </div>
              <span className="hidden max-w-24 truncate sm:inline">
                {user?.name || user?.email?.split('@')[0] || 'Owner'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-3 nav-popover-content">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 border-b border-(--brand-line) pb-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-(--brand-orange-soft) font-bold text-xs text-(--brand-orange-deep)">
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
      </div>
    </header>
  )
}
