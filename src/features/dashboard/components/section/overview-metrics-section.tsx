import { BookOpen, FlaskConical, Image, Star } from 'lucide-react'
import type { ReactNode } from 'react'

import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { getDashboardSummary } from '#/features/dashboard/loaders'

type OverviewMetricsSectionProps = {
  copy: ReturnType<typeof getDashboardCopy>['overview']['metrics']
  summary: Awaited<ReturnType<typeof getDashboardSummary>>
}

export function OverviewMetricsSection({
  copy,
  summary,
}: OverviewMetricsSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        icon={<BookOpen aria-hidden="true" className="size-5" />}
        label={copy.total}
        value={summary.totalItems.toString()}
      />
      <MetricCard
        icon={<Star aria-hidden="true" className="size-5" />}
        label={copy.featured}
        value={summary.featuredCount.toString()}
      />
      <MetricCard
        icon={<FlaskConical aria-hidden="true" className="size-5" />}
        label={copy.drafts}
        value={summary.draftCount.toString()}
      />
      <MetricCard
        icon={<Image aria-hidden="true" className="size-5" />}
        label={copy.published}
        value={summary.publishedCount.toString()}
      />
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold tracking-wider uppercase text-(--brand-muted)">
          {label}
        </span>
        <span className="grid size-9 place-items-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-(--brand-ink)">
        {value}
      </p>
    </div>
  )
}
