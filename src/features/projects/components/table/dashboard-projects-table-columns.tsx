import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit3, Sparkles, Trash2 } from 'lucide-react'

import type { getDashboardCopy } from '#/features/dashboard/copy'
import {
  formatLocales
  
} from '#/features/projects/components/table/dashboard-projects-table-features'
import type {ProjectRow} from '#/features/projects/components/table/dashboard-projects-table-features';

const columnHelper = createColumnHelper<ProjectRow>()

type CreateProjectColumnsOptions = {
  copy: ReturnType<typeof getDashboardCopy>
  onDeleteProject: (project: ProjectRow) => Promise<void>
}

export function getProjectColumns({
  copy,
  onDeleteProject,
}: CreateProjectColumnsOptions) {
  return [
    columnHelper.accessor('title', {
      header: copy.projects.project,
      cell: (info) => {
        const project = info.row.original
        return (
          <div className="min-w-70 max-w-md space-y-1.5">
            <p className="font-semibold text-(--brand-ink)">{project.title}</p>
            <p className="text-xs leading-relaxed text-(--brand-muted)">
              {project.summary}
            </p>
            <p className="font-mono text-xs text-(--brand-muted)">
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
        <span className="whitespace-nowrap text-xs font-medium text-(--brand-muted)">
          {formatLocales(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('visibility', {
      header: copy.common.visibility,
      cell: (info) => (
        <span className="whitespace-nowrap text-xs font-medium capitalize text-(--brand-muted)">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('category', {
      header: copy.common.category,
      cell: (info) => (
        <span className="whitespace-nowrap text-xs font-medium text-(--brand-muted)">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => (
        <div className="whitespace-nowrap text-right font-bold">
          {copy.common.actions}
        </div>
      ),
      cell: (info) => {
        const project = info.row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/dashboard/projects/$id"
              params={{ id: project.id }}
              className="inline-grid size-9 place-items-center rounded-lg border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep)"
              title={`${copy.common.edit} ${project.title}`}
            >
              <span className="sr-only">
                {copy.common.edit} {project.title}
              </span>
              <Edit3 aria-hidden="true" className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => void onDeleteProject(project)}
              className="inline-grid size-9 place-items-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 transition hover:-translate-y-0.5 dark:text-red-200"
              title={`${copy.common.delete} ${project.title}`}
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
  ]
}

function StatusBadge({ value }: { value: ProjectRow['status'] }) {
  const isPublished = value === 'published'
  const isDraft = value === 'draft'

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold capitalize ${
        isPublished
          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : isDraft
            ? 'border border-(--brand-orange)/30 bg-(--brand-orange-soft) text-(--brand-orange-deep)'
            : 'border border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
      }`}
    >
      {value}
    </span>
  )
}

function FeaturedBadge({ value }: { value: boolean }) {
  if (value) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
        <Sparkles className="size-3.5 fill-orange-500 text-orange-500" />
        Featured
      </span>
    )
  }
  return (
    <span className="whitespace-nowrap font-mono text-xs text-(--brand-muted)">
      Standard
    </span>
  )
}
