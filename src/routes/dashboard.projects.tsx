import { createFileRoute, Link } from '@tanstack/react-router'
import { Edit3, Plus } from 'lucide-react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { featuredProjects } from '#/features/portfolio/data'

export const Route = createFileRoute('/dashboard/projects')({
  component: DashboardProjects,
})

function DashboardProjects() {
  return (
    <DashboardShell
      title="Projects"
      description="Project records are ready for the first D1-backed CMS workflow."
      actions={
        <Link
          to="/dashboard/projects/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
        >
          <Plus aria-hidden="true" className="size-4" />
          New project
        </Link>
      }
    >
      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
            <thead className="border-b border-[var(--brand-line)] bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
              <tr>
                <th scope="col" className="px-5 py-3 font-bold">
                  Project
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Category
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Stack
                </th>
                <th scope="col" className="px-5 py-3 text-right font-bold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--brand-line)]">
              {featuredProjects.map((project) => (
                <tr key={project.slug}>
                  <td className="px-5 py-4 align-top">
                    <p className="font-semibold text-[var(--brand-ink)]">
                      {project.title}
                    </p>
                    <p className="mt-1 max-w-lg text-[var(--brand-muted)]">
                      {project.summary}
                    </p>
                  </td>
                  <td className="px-5 py-4 align-top text-[var(--brand-muted)]">
                    {project.category}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span className="rounded-full bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top text-[var(--brand-muted)]">
                    {project.stack.slice(0, 3).join(', ')}
                  </td>
                  <td className="px-5 py-4 text-right align-top">
                    <Link
                      to="/dashboard/projects/$id"
                      params={{ id: project.slug }}
                      className="inline-grid size-9 place-items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] text-[var(--brand-ink)] transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
                    >
                      <span className="sr-only">Edit {project.title}</span>
                      <Edit3 aria-hidden="true" className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  )
}
