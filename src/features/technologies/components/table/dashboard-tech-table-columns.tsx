import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit3, ExternalLink, Trash2, Zap } from 'lucide-react'

import { TechIcon } from '#/components/ui/tech-icon'
import type { TechnologyWithCategories } from '#/features/technologies/components/table/dashboard-tech-table-features'

const columnHelper = createColumnHelper<TechnologyWithCategories>()

type CreateTechColumnsOptions = {
  categoryMap: Map<string, string>
  onDeleteTech: (id: string, name: string) => Promise<void>
}

export function getTechColumns({
  categoryMap,
  onDeleteTech,
}: CreateTechColumnsOptions) {
  return [
    columnHelper.display({
      id: 'icon',
      header: () => <span className="w-12">Icon</span>,
      cell: (info) => {
        const tech = info.row.original
        return (
          <div className="grid size-9 place-items-center rounded-lg border border-(--brand-line) bg-(--surface-strong)">
            <TechIcon
              src={tech.icon}
              name={tech.name}
              color={tech.color}
              className="size-5"
            />
          </div>
        )
      },
    }),
    columnHelper.accessor('name', {
      header: 'Nama',
      cell: (info) => {
        const tech = info.row.original
        return (
          <div className="flex items-center gap-2 font-bold text-(--brand-ink)">
            {tech.name}
            {tech.url ? (
              <a
                href={tech.url}
                target="_blank"
                rel="noreferrer"
                className="text-(--brand-muted) hover:text-(--brand-orange-deep)"
              >
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
          </div>
        )
      },
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: (info) => (
        <span className="font-mono text-xs text-(--brand-muted)">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('isUltimate', {
      header: 'Ultimate',
      cell: (info) => {
        const isUltimate = info.getValue()
        if (isUltimate) {
          return (
            <span className="inline-flex items-center gap-1 rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 font-mono text-xs font-bold text-(--brand-orange-deep)">
              <Zap className="size-3 fill-current" />
              Ultimate
            </span>
          )
        }
        return <span className="font-mono text-xs text-(--brand-muted)">-</span>
      },
    }),
    columnHelper.accessor('categoryIds', {
      header: 'Kategori',
      cell: (info) => {
        const categoryIds = info.getValue()
        return (
          <div className="flex flex-wrap gap-1">
            {categoryIds.map((catId) => (
              <span
                key={catId}
                className="rounded-md border border-(--brand-line) bg-(--surface-strong) px-2 py-0.5 font-mono text-xs font-medium text-(--brand-muted)"
              >
                {categoryMap.get(catId) ?? catId}
              </span>
            ))}
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: (info) => {
        const tech = info.row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/dashboard/stack/technologies/$id"
              params={{ id: tech.id }}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep)"
              title="Edit Technology"
            >
              <Edit3 className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => void onDeleteTech(tech.id, tech.name)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500 hover:text-white"
              title="Delete Technology"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )
      },
    }),
  ]
}
