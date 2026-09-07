import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { DashboardProjectsTable } from '#/features/projects/components/table/dashboard-projects-table'
import type { ProjectRow } from '#/features/projects/components/table/dashboard-projects-table-features'
import { useDeleteProject } from '#/features/projects/hooks'
import { projectQueryOptions } from '#/features/projects/query-options'
import { getApiErrorMessage } from '#/lib/api-client'

export function DashboardProjectsPage() {
  const copy = getDashboardCopy()
  const searchParams = useSearch({ from: '/dashboard/projects/' })
  const navigate = useNavigate({ from: '/dashboard/projects/' })

  const search = searchParams.q ?? ''
  const statusFilter = searchParams.status ?? 'all'
  const page = searchParams.page ?? 1

  const {
    data: projects,
    refetch,
    isFetching,
  } = useSuspenseQuery(projectQueryOptions.list())
  const deleteMutation = useDeleteProject()
  const [error, setError] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<ProjectRow | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearchChange = (val: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        q: val.trim() || undefined,
        page: undefined,
      }),
      replace: true,
    })
  }

  const handleStatusFilterChange = (val: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        status:
          val !== 'all'
            ? (val as 'published' | 'in_progress' | 'draft')
            : undefined,
        page: undefined,
      }),
      replace: true,
    })
  }

  const handlePageChange = (val: number) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        page: val > 1 ? val : undefined,
      }),
      replace: true,
    })
  }

  const handleDelete = async (project: ProjectRow) => {
    setProjectToDelete(project)
  }

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return
    setError(null)
    setIsDeleting(true)
    try {
      await deleteMutation.mutateAsync(projectToDelete.id)
      setProjectToDelete(null)
    } catch (caught) {
      setError(getApiErrorMessage(caught, copy.projects.deleteError))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardShell
      title={copy.projects.title}
      description={copy.projects.description}
      actions={
        <>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold whitespace-nowrap text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            {copy.common.refresh}
          </button>
          <Link
            to="/dashboard/projects/new"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold whitespace-nowrap text-white no-underline transition hover:-translate-y-0.5"
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
        {projects.length === 0 ? (
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
            onDeleteProject={handleDelete}
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            page={page}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.projects.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {projectToDelete
                ? copy.projects.deleteConfirm(projectToDelete.title)
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {copy.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                void confirmDeleteProject()
              }}
            >
              {isDeleting ? copy.common.saving : copy.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  )
}
