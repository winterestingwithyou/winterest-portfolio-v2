import { createFileRoute, Link } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ProjectEditorForm } from '#/features/dashboard/ProjectEditorForm'

type ProjectRecord = {
  id: string
  locale: 'en' | 'id'
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
  const copy = getDashboardCopy()
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
        throw new Error(result.error ?? copy.projects.notFound)
      }

      setProject(result.data ?? null)
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : copy.projects.notFound,
      )
    } finally {
      setIsLoading(false)
    }
  }, [copy.projects.notFound, id])

  useEffect(() => {
    void loadProject()
  }, [loadProject])

  return (
    <DashboardShell
      title={project?.title ?? copy.projects.editTitle}
      description={copy.projects.editDescription}
      actions={
        <button
          type="button"
          onClick={loadProject}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {copy.common.refresh}
        </button>
      }
    >
      {isLoading ? (
        <div className="surface-card p-6 text-sm font-semibold text-[var(--brand-muted)]">
          {copy.projects.loadingEntry}
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
            {copy.common.back}
          </Link>
        </div>
      ) : (
        <ProjectEditorForm mode="edit" project={project} />
      )}
    </DashboardShell>
  )
}
