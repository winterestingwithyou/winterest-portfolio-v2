import { createFileRoute, Link } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ProjectEditorForm } from '#/features/dashboard/ProjectEditorForm'

type ProjectRecord = {
  id: string
  slug: string
  title: string
  summary: string
  description?: string | null
  content?: string | null
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private'
  featured: boolean
  category: string
  coverImage?: string | null
  repoUrl?: string | null
  demoUrl?: string | null
  caseStudyUrl?: string | null
}

export const Route = createFileRoute('/dashboard/projects/$id')({
  component: DashboardProjectEdit,
})

function DashboardProjectEdit() {
  const { id } = Route.useParams()
  const [project, setProject] = useState<ProjectRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProject = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${id}`)
      const result: {
        data?: ProjectRecord
        error?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to load project.')
      }

      setProject(result.data ?? null)
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Failed to load project.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadProject()
  }, [loadProject])

  return (
    <DashboardShell
      title={project?.title ?? 'Edit Project'}
      description="Edit a D1-backed project record."
      actions={
        <button
          type="button"
          onClick={loadProject}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Refresh
        </button>
      }
    >
      {isLoading ? (
        <div className="surface-card p-6 text-sm font-semibold text-[var(--brand-muted)]">
          Loading project...
        </div>
      ) : error || !project ? (
        <div className="surface-card max-w-2xl p-6">
          <p className="text-sm leading-7 text-[var(--brand-muted)]">
            {error ?? 'This project record is not available.'}
          </p>
          <Link
            to="/dashboard/projects"
            className="mt-5 inline-flex min-h-10 items-center rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline"
          >
            Back to projects
          </Link>
        </div>
      ) : (
        <ProjectEditorForm mode="edit" project={project} />
      )}
    </DashboardShell>
  )
}
