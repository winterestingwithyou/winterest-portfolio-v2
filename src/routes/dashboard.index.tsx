import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, FlaskConical, Image, Star } from 'lucide-react'
import type { ReactNode } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { getPortfolioContent } from '#/features/portfolio/data'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  const copy = getDashboardCopy()
  const { featuredProjects, labEntries, writingEntries } = getPortfolioContent()
  const activeCount = featuredProjects.filter(
    (project) => project.featured,
  ).length
  const totalItems =
    featuredProjects.length + writingEntries.length + labEntries.length
  const draftCount = [
    ...featuredProjects,
    ...writingEntries,
    ...labEntries,
  ].filter(
    (item) =>
      item.status.toLowerCase().includes('draft') ||
      item.status.toLowerCase().includes('outline') ||
      item.status.toLowerCase().includes('idea') ||
      item.status.toLowerCase().includes('antri') ||
      item.status.toLowerCase().includes('ide'),
  ).length
  const publishedReady = totalItems - draftCount
  const contentMix = [
    {
      label: copy.shell.nav.projects,
      value: featuredProjects.length,
      width: `${Math.max((featuredProjects.length / totalItems) * 100, 8)}%`,
    },
    {
      label: copy.shell.nav.writing,
      value: writingEntries.length,
      width: `${Math.max((writingEntries.length / totalItems) * 100, 8)}%`,
    },
    {
      label: copy.shell.nav.lab,
      value: labEntries.length,
      width: `${Math.max((labEntries.length / totalItems) * 100, 8)}%`,
    },
  ]

  return (
    <DashboardShell
      title={copy.overview.title}
      description={copy.overview.description}
      actions={
        <Link
          to="/dashboard/projects"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
        >
          {copy.overview.action}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={<BookOpen aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.total}
          value={totalItems.toString()}
        />
        <MetricCard
          icon={<Star aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.featured}
          value={activeCount.toString()}
        />
        <MetricCard
          icon={<FlaskConical aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.drafts}
          value={draftCount.toString()}
        />
        <MetricCard
          icon={<Image aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.published}
          value={publishedReady.toString()}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <section className="surface-card p-5">
          <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
            {copy.overview.chartTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
            {copy.overview.chartDescription}
          </p>
          <div className="mt-6 grid gap-4">
            {contentMix.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-[var(--brand-ink)]">
                    {item.label}
                  </span>
                  <span className="text-[var(--brand-muted)]">
                    {item.value}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--brand-orange-soft)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand-orange)]"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
            {copy.overview.quickTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
            {copy.overview.quickDescription}
          </p>
          <div className="mt-5 grid gap-2">
            <QuickAction
              to="/dashboard/projects"
              label={copy.overview.projects}
            />
            <QuickAction
              to="/dashboard/writing/new"
              label={copy.overview.writing}
            />
            <QuickAction to="/dashboard/lab/new" label={copy.overview.lab} />
            <QuickAction to="/dashboard/media" label={copy.overview.media} />
          </div>
        </section>
      </div>

      <section className="mt-6 surface-card overflow-hidden">
        <div className="border-b border-[var(--brand-line)] p-5">
          <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
            {copy.overview.activityTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
            {copy.overview.activityDescription}
          </p>
        </div>
        <div className="grid gap-0 divide-y divide-[var(--brand-line)]">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              to="/dashboard/projects/$id"
              params={{ id: project.slug }}
              className="grid gap-2 p-5 text-[var(--brand-ink)] no-underline transition hover:bg-[var(--brand-orange-soft)] md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="mt-1 text-sm text-[var(--brand-muted)]">
                  {project.summary}
                </p>
              </div>
              <span className="rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]">
                {project.status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}

function QuickAction({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
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
    <article className="surface-card p-5">
      <div className="mb-4 grid size-10 place-items-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-[var(--brand-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--brand-ink)]">
        {value}
      </p>
    </article>
  )
}
