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
    <div className="space-y-6 w-full min-w-0 max-w-full">
      <header className="flex flex-col gap-4 rounded-xl border border-sidebar-border bg-sidebar p-4 sm:p-5 shadow-xs sm:flex-row sm:items-start sm:justify-between w-full min-w-0 max-w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl break-words">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-(--brand-muted) break-words">
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

      <div className="w-full min-w-0 max-w-full">{children}</div>
    </div>
  )
}
