import type { ReactNode } from 'react'

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
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-xs sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-(--brand-muted)">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:shrink-0">
            {actions}
          </div>
        ) : null}
      </header>

      <div>{children}</div>
    </div>
  )
}
