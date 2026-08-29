import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import type { getDashboardCopy } from '#/features/dashboard/copy'

type QuickActionsSectionProps = {
  copy: ReturnType<typeof getDashboardCopy>
}

export function QuickActionsSection({ copy }: QuickActionsSectionProps) {
  return (
    <section className="surface-card p-5">
      <h2 className="text-xl font-semibold text-(--brand-ink)">
        {copy.overview.quickTitle}
      </h2>
      <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
        {copy.overview.quickDescription}
      </p>
      <div className="mt-5 grid gap-2">
        <QuickAction to="/dashboard/projects" label={copy.overview.projects} />
        <QuickAction to="/dashboard/media" label={copy.overview.media} />
      </div>
    </section>
  )
}

function QuickAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) no-underline transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  )
}
