import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, FlaskConical, Image, Star } from 'lucide-react'
import type { ReactNode } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { getDashboardSummary } from '#/features/dashboard/loaders'

export const Route = createFileRoute('/dashboard/')({
  loader: () => getDashboardSummary(),
  component: DashboardHome,
})

function DashboardHome() {
  const copy = getDashboardCopy()
  const summary = Route.useLoaderData()
  const contentMix = summary.contentMix.map((item) => ({
    label: copy.shell.nav[item.key],
    value: item.value,
    width:
      summary.totalItems > 0
        ? `${Math.max((item.value / summary.totalItems) * 100, 8)}%`
        : '0%',
  }))

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
          value={summary.totalItems.toString()}
        />
        <MetricCard
          icon={<Star aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.featured}
          value={summary.featuredCount.toString()}
        />
        <MetricCard
          icon={<FlaskConical aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.drafts}
          value={summary.draftCount.toString()}
        />
        <MetricCard
          icon={<Image aria-hidden="true" className="size-5" />}
          label={copy.overview.metrics.published}
          value={summary.publishedCount.toString()}
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
          {summary.recentProjects.length === 0 ? (
            <div className="p-5 text-sm leading-7 text-[var(--brand-muted)]">
              {copy.projects.emptyDescription}
            </div>
          ) : null}
          {summary.recentProjects.map((project) => (
            <Link
              key={project.id}
              to="/dashboard/projects/$id"
              params={{ id: project.id }}
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
