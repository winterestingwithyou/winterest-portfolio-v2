import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Database, FileText, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { featuredProjects } from '#/features/portfolio/data'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  const publishedCount = featuredProjects.filter(
    (project) => project.status === 'Building',
  ).length

  return (
    <DashboardShell
      title="Overview"
      description="Project CMS foundation for the Winterest platform."
      actions={
        <Link
          to="/dashboard/projects"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
        >
          Projects
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={<FileText aria-hidden="true" className="size-5" />}
          label="Seed projects"
          value={featuredProjects.length.toString()}
        />
        <MetricCard
          icon={<Database aria-hidden="true" className="size-5" />}
          label="D1 binding"
          value="DB"
        />
        <MetricCard
          icon={<ShieldCheck aria-hidden="true" className="size-5" />}
          label="Owner guard"
          value="Active"
        />
      </div>

      <section className="mt-6 surface-card overflow-hidden">
        <div className="border-b border-[var(--brand-line)] p-5">
          <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
            Publishing state
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
            {publishedCount} project entries are ready to become D1 seed rows
            once migrations are applied.
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
