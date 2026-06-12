import { createFileRoute, Link } from '@tanstack/react-router'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ProjectEditorForm } from '#/features/dashboard/ProjectEditorForm'
import { getProjectBySlug } from '#/features/portfolio/data'

export const Route = createFileRoute('/dashboard/projects/$id')({
  component: DashboardProjectEdit,
})

function DashboardProjectEdit() {
  const { id } = Route.useParams()
  const project = getProjectBySlug(id)

  if (!project) {
    return (
      <DashboardShell title="Project Not Found">
        <div className="surface-card max-w-2xl p-6">
          <p className="text-sm leading-7 text-[var(--brand-muted)]">
            This project record is not available in the current seed content.
          </p>
          <Link
            to="/dashboard/projects"
            className="mt-5 inline-flex min-h-10 items-center rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline"
          >
            Back to projects
          </Link>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title={project.title}
      description="Edit flow shell for the D1-backed project CMS."
    >
      <ProjectEditorForm mode="edit" project={project} />
    </DashboardShell>
  )
}
