import { createFileRoute, Link } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Edit3, Plus, RefreshCw, Sparkles, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { getDashboardCopy } from '#/features/dashboard/copy'

type ProjectRow = {
  id: string
  slug: string
  title: string
  summary: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private'
  featured: boolean
  category: string
  availableLocales: Array<'en' | 'id'>
  updatedAt?: string
}

const columnHelper = createColumnHelper<ProjectRow>()

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

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: copy.projects.project,
        cell: (info) => {
          const project = info.row.original
          return (
            <div>
              <p className="font-semibold text-(--brand-ink)">
                {project.title}
              </p>
              <p className="mt-1 max-w-lg text-xs leading-relaxed text-(--brand-muted)">
                {project.summary}
              </p>
              <p className="mt-2 font-mono text-xs text-(--brand-muted)">
                /projects/{project.slug}
              </p>
            </div>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: copy.common.status,
        cell: (info) => <StatusBadge value={info.getValue()} />,
      }),
      columnHelper.accessor('featured', {
        header: copy.common.featured,
        cell: (info) => <FeaturedBadge value={info.getValue()} />,
      }),
      columnHelper.accessor('availableLocales', {
        header: copy.common.language,
        cell: (info) => (
          <span className="text-(--brand-muted)">
            {formatLocales(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('visibility', {
        header: copy.common.visibility,
        cell: (info) => (
          <span className="text-(--brand-muted) capitalize">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('category', {
        header: copy.common.category,
        cell: (info) => (
          <span className="text-(--brand-muted)">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => (
          <div className="text-right font-bold">{copy.common.actions}</div>
        ),
        cell: (info) => {
          const project = info.row.original
          return (
            <div className="flex justify-end gap-2">
              <Link
                to="/dashboard/projects/$id"
                params={{ id: project.id }}
                className="inline-grid size-9 place-items-center rounded-full border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep)"
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
          )
        },
      }),
    ],
    [copy, deleteProject],
  )

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
          <Table>
            <TableHeader className="bg-(--brand-orange-soft)">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-5 py-3 font-bold text-(--brand-orange-deep)"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5 py-4 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </DashboardShell>
  )
}

function StatusBadge({ value }: { value: ProjectRow['status'] }) {
  return (
    <span className="rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-bold text-(--brand-orange-deep)">
      {value}
    </span>
  )
}

function FeaturedBadge({ value }: { value: boolean }) {
  if (value) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
        <Sparkles className="size-3 text-orange-500 fill-orange-500 animate-pulse" />
        Featured
      </span>
    )
  }
  return (
    <span className="font-mono text-xs text-(--brand-muted)">Standard</span>
  )
}

function formatLocales(locales: readonly ('en' | 'id')[]) {
  return locales.length > 0
    ? locales.map((locale) => locale.toUpperCase()).join(', ')
    : '-'
}
