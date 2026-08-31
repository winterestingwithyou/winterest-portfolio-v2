import { Link } from '@tanstack/react-router'

import type { getDashboardCopy } from '#/features/dashboard/copy'
import type { getDashboardSummary } from '#/features/dashboard/loaders'

type RecentActivitySectionProps = {
  copy: ReturnType<typeof getDashboardCopy>
  recentProjects: Awaited<
    ReturnType<typeof getDashboardSummary>
  >['recentProjects']
}

export function RecentActivitySection({
  copy,
  recentProjects,
}: RecentActivitySectionProps) {
  return (
    <section className="surface-card mt-6 overflow-hidden">
      <div className="border-b border-(--brand-line) p-5">
        <h2 className="text-xl font-semibold text-(--brand-ink)">
          {copy.overview.activityTitle}
        </h2>
        <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
          {copy.overview.activityDescription}
        </p>
      </div>
      <div className="grid gap-0 divide-y divide-(--brand-line)">
        {recentProjects.length === 0 ? (
          <div className="p-5 text-sm leading-7 text-(--brand-muted)">
            {copy.projects.emptyDescription}
          </div>
        ) : null}
        {recentProjects.map((project) => (
          <Link
            key={project.id}
            to="/dashboard/projects/$id"
            params={{ id: project.id }}
            className="grid gap-2 p-5 text-(--brand-ink) no-underline transition hover:bg-(--brand-orange-soft) md:grid-cols-[1fr_auto] md:items-center"
          >
            <div>
              <h3 className="font-semibold">{project.title}</h3>
              <p className="mt-1 text-sm text-(--brand-muted)">
                {project.summary}
              </p>
            </div>
            <span className="rounded-full border border-(--brand-line) bg-(--surface-strong) px-3 py-1 text-xs font-bold text-(--brand-orange-deep)">
              {project.status}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
