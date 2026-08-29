import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { ContentMixSection } from '#/features/dashboard/components/section/content-mix-section'
import { OverviewMetricsSection } from '#/features/dashboard/components/section/overview-metrics-section'
import { QuickActionsSection } from '#/features/dashboard/components/section/quick-actions-section'
import { RecentActivitySection } from '#/features/dashboard/components/section/recent-activity-section'
import { getDashboardCopy } from '#/features/dashboard/copy'
import type { getDashboardSummary } from '#/features/dashboard/loaders'

type OverviewPageProps = {
  summary: Awaited<ReturnType<typeof getDashboardSummary>>
}

export function OverviewPage({ summary }: OverviewPageProps) {
  const copy = getDashboardCopy()

  return (
    <DashboardShell
      title={copy.overview.title}
      description={copy.overview.description}
      actions={
        <Link
          to="/dashboard/projects"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
        >
          {copy.overview.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      }
    >
      <OverviewMetricsSection
        copy={copy.overview.metrics}
        summary={summary}
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <ContentMixSection copy={copy} summary={summary} />
        <QuickActionsSection copy={copy} />
      </div>

      <RecentActivitySection
        copy={copy}
        recentProjects={summary.recentProjects}
      />
    </DashboardShell>
  )
}
