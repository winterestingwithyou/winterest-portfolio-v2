import { Link } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardProjectsTable } from '#/features/projects/components/table/dashboard-projects-table'
import type { ProjectRow } from '#/features/projects/components/table/dashboard-projects-table-features'
import { api, getApiErrorMessage } from '#/lib/api-client'

export function DashboardProjectsPage() {
  const copy = getDashboardCopy()
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await api<{
        data?: ProjectRow[]
      }>('/api/projects')

      setProjects(result.data ?? [])
    } catch (caught) {
      setError(getApiErrorMessage(caught, copy.projects.loadError))
    } finally {
      setIsLoading(false)
    }
  }, [copy.projects.loadError])

  const deleteProject = useCallback(
    async (project: ProjectRow) => {
      setError(null)

      try {
        await api(`/api/projects/${project.id}`, {
          method: 'DELETE',
        })

        setProjects((current) =>
          current.filter((item) => item.id !== project.id),
        )
      } catch (caught) {
        setError(getApiErrorMessage(caught, copy.projects.deleteError))
      }
    },
    [copy.projects.deleteError],
  )

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  return (
    <DashboardShell
      title={copy.projects.title}
      description={copy.projects.description}
      actions={
        <>
          <button
            type="button"
            onClick={loadProjects}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            {copy.common.refresh}
          </button>
          <Link
            to="/dashboard/projects/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
          >
            <Plus aria-hidden="true" className="size-4" />
            {copy.projects.new}
          </Link>
        </>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <section className="surface-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm font-semibold text-(--brand-muted)">
            {copy.projects.loading}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-(--brand-ink)">
              {copy.projects.emptyTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-(--brand-muted)">
              {copy.projects.emptyDescription}
            </p>
          </div>
        ) : (
          <DashboardProjectsTable
            copy={copy}
            projects={projects}
            onDeleteProject={deleteProject}
          />
        )}
      </section>
    </DashboardShell>
  )
}
