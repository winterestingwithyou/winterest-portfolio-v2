import { createFileRoute, Link } from '@tanstack/react-router'
import { Edit3, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'

type ProjectRow = {
  id: string
  locale: 'en' | 'id'
  slug: string
  title: string
  summary: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private'
  featured: boolean
  category: string
  updatedAt?: string
}

export const Route = createFileRoute('/dashboard/projects/')({
  component: DashboardProjects,
})

function DashboardProjects() {
  const copy = getDashboardCopy()
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/projects')
      const result: {
        data?: ProjectRow[]
        error?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? copy.projects.loadError)
      }

      setProjects(result.data ?? [])
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : copy.projects.loadError,
      )
    } finally {
      setIsLoading(false)
    }
  }, [copy.projects.loadError])

  const deleteProject = useCallback(
    async (project: ProjectRow) => {
      setError(null)

      try {
        const response = await fetch(`/api/projects/${project.id}`, {
          method: 'DELETE',
        })
        const result: { error?: string } = await response.json()

        if (!response.ok) {
          throw new Error(result.error ?? copy.projects.deleteError)
        }

        setProjects((current) =>
          current.filter((item) => item.id !== project.id),
        )
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : copy.projects.deleteError,
        )
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
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            {copy.common.refresh}
          </button>
          <Link
            to="/dashboard/projects/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
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
          <div className="p-6 text-sm font-semibold text-[var(--brand-muted)]">
            {copy.projects.loading}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
              {copy.projects.emptyTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
              {copy.projects.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--brand-line)] bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.projects.project}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.status}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.language}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.visibility}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.category}
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-bold">
                    {copy.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--brand-line)]">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-[var(--brand-ink)]">
                        {project.title}
                      </p>
                      <p className="mt-1 max-w-lg text-[var(--brand-muted)]">
                        {project.summary}
                      </p>
                      <p className="mt-2 font-mono text-xs text-[var(--brand-muted)]">
                        /projects/{project.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <StatusBadge value={project.status} />
                    </td>
                    <td className="px-5 py-4 align-top text-[var(--brand-muted)]">
                      {project.locale.toUpperCase()}
                    </td>
                    <td className="px-5 py-4 align-top text-[var(--brand-muted)]">
                      {project.visibility}
                    </td>
                    <td className="px-5 py-4 align-top text-[var(--brand-muted)]">
                      {project.category}
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <div className="inline-flex gap-2">
                        <Link
                          to="/dashboard/projects/$id"
                          params={{ id: project.id }}
                          className="inline-grid size-9 place-items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] text-[var(--brand-ink)] transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
                        >
                          <span className="sr-only">
                            {copy.common.edit} {project.title}
                          </span>
                          <Edit3 aria-hidden="true" className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => void deleteProject(project)}
                          className="inline-grid size-9 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-700 transition hover:-translate-y-0.5 dark:text-red-200"
                        >
                          <span className="sr-only">
                            {copy.common.delete} {project.title}
                          </span>
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  )
}

function StatusBadge({ value }: { value: ProjectRow['status'] }) {
  return (
    <span className="rounded-full bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]">
      {value}
    </span>
  )
}
