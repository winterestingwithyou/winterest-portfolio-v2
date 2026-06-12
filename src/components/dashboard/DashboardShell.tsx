import { Link } from '@tanstack/react-router'
import {
  FolderKanban,
  Home,
  Image,
  LayoutDashboard,
  PenLine,
  Settings,
  TestTube2,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { siteProfile } from '#/features/portfolio/data'

const dashboardNav = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  { to: '/writing', label: 'Writing', icon: PenLine },
  { to: '/lab', label: 'Lab', icon: TestTube2 },
  { to: '/dashboard/media', label: 'Media', icon: Image },
  { to: '/dashboard/users', label: 'Users', icon: Users },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const

type DashboardShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function DashboardShell({
  title,
  description,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <main className="px-4 py-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="surface-card h-fit p-3 lg:sticky lg:top-24">
          <Link
            to="/"
            className="mb-3 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:bg-[var(--brand-orange-soft)]"
          >
            <Home aria-hidden="true" className="size-4" />
            {siteProfile.domain}
          </Link>
          <nav className="grid gap-1">
            {dashboardNav.map((item) => {
              const Icon = item.icon
              const isInternalPlaceholder =
                item.to === '/dashboard/media' ||
                item.to === '/dashboard/users' ||
                item.to === '/dashboard/settings'

              if (isInternalPlaceholder) {
                return (
                  <span
                    key={item.to}
                    className="flex min-h-10 cursor-not-allowed items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[var(--brand-muted)] opacity-60"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </span>
                )
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[var(--brand-muted)] no-underline transition hover:bg-[var(--brand-orange-soft)] hover:text-[var(--brand-ink)]"
                  activeProps={{
                    className:
                      'bg-[var(--brand-orange-soft)] text-[var(--brand-ink)]',
                  }}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="mb-6 flex flex-col gap-4 rounded-xl border border-[var(--brand-line)] bg-[var(--surface-strong)] p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow mb-2">CMS Dashboard</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-ink)]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
                  {description}
                </p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex flex-wrap gap-2">{actions}</div>
            ) : null}
          </header>

          {children}
        </section>
      </div>
    </main>
  )
}
