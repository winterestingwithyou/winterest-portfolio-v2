import React, { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight, LogOut, User } from 'lucide-react'

import ParaglideLocaleSwitcher from '#/components/locale-switcher'
import ThemeToggle from '#/components/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'
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

function BreadcrumbMenu({
  items,
}: {
  items: Array<{ label: string; url: string }>
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex size-6 shrink-0 items-center justify-center rounded text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="Show breadcrumb navigation"
        >
          <BreadcrumbEllipsis className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-48 p-1.5 shadow-lg border-sidebar-border bg-popover text-popover-foreground"
      >
        <div className="flex flex-col gap-0.5">
          {items.map((crumb) => (
            <Link
              key={crumb.url}
              to={crumb.url}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <ChevronRight className="size-3 text-sidebar-foreground/40 shrink-0" />
              <span className="truncate">{crumb.label}</span>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const copy = getDashboardCopy()
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`
    const breadcrumbLabels = copy.shell.breadcrumbs as Record<string, string>
    const isKnown = segment in breadcrumbLabels
    const prevSegment = index > 0 ? pathSegments[index - 1] : ''
    const isEditRoute = [
      'technologies',
      'categories',
      'projects',
      'users',
    ].includes(prevSegment)
    const isId =
      !isKnown &&
      (segment.length > 20 ||
        /^\d+$/.test(segment) ||
        isEditRoute ||
        index === pathSegments.length - 1)
    const label = isId
      ? breadcrumbLabels.edit || 'Edit'
      : breadcrumbLabels[segment] || segment

    return { label, url, isLast: index === pathSegments.length - 1 }
  })

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 text-sm overflow-hidden">
        <SidebarTrigger className="-ml-1 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent" />
        <Separator
          orientation="vertical"
          className="mr-1 sm:mr-2 h-4 shrink-0 bg-sidebar-border"
        />
        {breadcrumbs.length > 0 && (
          <Breadcrumb className="min-w-0">
            {breadcrumbs.length <= 2 ? (
              <BreadcrumbList className="flex-nowrap gap-1.5 text-xs sm:gap-1.5">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.url}>
                    {idx > 0 && (
                      <BreadcrumbSeparator className="shrink-0 text-sidebar-foreground/40 [&>svg]:size-3" />
                    )}
                    <BreadcrumbItem
                      className={crumb.isLast ? 'min-w-0' : 'shrink-0'}
                    >
                      {crumb.isLast ? (
                        <BreadcrumbPage className="truncate min-w-0 font-semibold text-(--brand-ink) whitespace-nowrap">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          asChild
                          className="whitespace-nowrap text-sidebar-foreground/70 hover:text-sidebar-foreground"
                        >
                          <Link to={crumb.url}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            ) : (
              <>
                {/* Desktop: Show all breadcrumbs */}
                <BreadcrumbList className="hidden md:flex flex-nowrap gap-1.5 text-xs sm:gap-1.5">
                  {breadcrumbs.map((crumb, idx) => (
                    <React.Fragment key={crumb.url}>
                      {idx > 0 && (
                        <BreadcrumbSeparator className="shrink-0 text-sidebar-foreground/40 [&>svg]:size-3" />
                      )}
                      <BreadcrumbItem
                        className={crumb.isLast ? 'min-w-0' : 'shrink-0'}
                      >
                        {crumb.isLast ? (
                          <BreadcrumbPage className="truncate max-w-50 lg:max-w-xs font-semibold text-(--brand-ink) whitespace-nowrap">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            asChild
                            className="whitespace-nowrap text-sidebar-foreground/70 hover:text-sidebar-foreground"
                          >
                            <Link to={crumb.url}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>

                {/* Tablet (sm to md): [First] > [...] > [Last] */}
                <BreadcrumbList className="hidden sm:flex md:hidden flex-nowrap gap-1.5 text-xs sm:gap-1.5">
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbLink
                      asChild
                      className="whitespace-nowrap text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    >
                      <Link to={breadcrumbs[0].url}>
                        {breadcrumbs[0].label}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="shrink-0 text-sidebar-foreground/40 [&>svg]:size-3" />
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbMenu items={breadcrumbs.slice(1, -1)} />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="shrink-0 text-sidebar-foreground/40 [&>svg]:size-3" />
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="truncate min-w-0 font-semibold text-(--brand-ink) whitespace-nowrap">
                      {breadcrumbs[breadcrumbs.length - 1].label}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>

                {/* Narrow Mobile (< sm): [...] > [Last] */}
                <BreadcrumbList className="flex sm:hidden flex-nowrap gap-1.5 text-xs sm:gap-1.5">
                  <BreadcrumbItem className="shrink-0">
                    <BreadcrumbMenu items={breadcrumbs.slice(0, -1)} />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="shrink-0 text-sidebar-foreground/40 [&>svg]:size-3" />
                  <BreadcrumbItem className="min-w-0">
                    <BreadcrumbPage className="truncate min-w-0 font-semibold text-(--brand-ink) whitespace-nowrap">
                      {breadcrumbs[breadcrumbs.length - 1].label}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </>
            )}
          </Breadcrumb>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                    'U'}
                </div>
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
      </div>
    </header>
  )
}
