import { Link, useNavigate } from '@tanstack/react-router'
import {
  FolderKanban,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  PenLine,
  Settings,
  TestTube2,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { getDashboardCopy } from '#/features/dashboard/copy'
import { authClient } from '#/lib/auth-client'

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
  const copy = getDashboardCopy()
  const navigate = useNavigate()
  const dashboardNav = [
    {
      to: '/dashboard',
      label: copy.shell.nav.overview,
      icon: LayoutDashboard,
    },
    {
      to: '/dashboard/projects',
      label: copy.shell.nav.projects,
      icon: FolderKanban,
    },
    { to: '/dashboard/writing', label: copy.shell.nav.writing, icon: PenLine },
    { to: '/dashboard/lab', label: copy.shell.nav.lab, icon: TestTube2 },
    { to: '/dashboard/media', label: copy.shell.nav.media, icon: Image },
    { to: '/dashboard/users', label: copy.shell.nav.users, icon: Users },
    {
      to: '/dashboard/settings',
      label: copy.shell.nav.settings,
      icon: Settings,
    },
  ] as const

  return (
    <main className="min-h-screen bg-[var(--brand-bg)] px-4 py-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="surface-card h-fit p-3 lg:sticky lg:top-24">
          <Link
            to="/"
            className="mb-3 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:bg-[var(--brand-orange-soft)]"
          >
            <Home aria-hidden="true" className="size-4" />
            {copy.shell.backToSite}
          </Link>
          <nav className="grid gap-1">
            {dashboardNav.map((item) => {
              const Icon = item.icon
              const isInternalPlaceholder =
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
                    <span className="ml-auto text-[0.65rem] uppercase tracking-wide">
                      {copy.shell.soon}
                    </span>
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
              <p className="eyebrow mb-2">{copy.shell.eyebrow}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--brand-ink)]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {actions}
              <button
                type="button"
                onClick={() => {
                  void authClient.signOut().then(() => navigate({ to: '/' }))
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
              >
                <LogOut aria-hidden="true" className="size-4" />
                {copy.shell.logout}
              </button>
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  )
}
