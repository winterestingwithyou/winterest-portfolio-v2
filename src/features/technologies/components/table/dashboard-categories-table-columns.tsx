import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Edit3, Trash2 } from 'lucide-react'

import type { CategoryRecord } from '#/features/technologies/components/table/dashboard-categories-table-features'

const columnHelper = createColumnHelper<CategoryRecord>()

type CreateCategoryColumnsOptions = {
  onDeleteCategory: (id: string, name: string) => Promise<void>
}

export function getCategoryColumns({
  onDeleteCategory,
}: CreateCategoryColumnsOptions) {
  return [
    columnHelper.accessor('sortOrder', {
      header: () => <span className="w-16">Urutan</span>,
      cell: (info) => (
        <span className="font-mono text-xs font-bold text-(--brand-muted)">
          #{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Nama Kategori',
      cell: (info) => (
        <span className="font-bold text-(--brand-ink)">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('slug', {
      header: 'Slug',
      cell: (info) => (
        <span className="font-mono text-xs text-(--brand-muted)">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Aksi</div>,
      cell: (info) => {
        const cat = info.row.original
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              to="/dashboard/stack/categories/$id"
              params={{ id: cat.id }}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) transition hover:border-(--brand-orange) hover:text-(--brand-orange-deep)"
              title="Edit Category"
            >
              <Edit3 className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => void onDeleteCategory(cat.id, cat.name)}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500 hover:text-white"
              title="Delete Category"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )
      },
    }),
  ]
}
