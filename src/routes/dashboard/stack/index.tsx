import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Edit3,
  ExternalLink,
  FolderTree,
  Layers,
  Plus,
  RefreshCw,
  Trash2,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/dashboard-shell'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { TechIcon } from '#/components/ui/tech-icon'
import type {
  CategoryRecord,
  TechnologyWithCategories,
} from '#/features/technologies/queries'
import { api, getApiErrorMessage } from '#/lib/api-client'

export const Route = createFileRoute('/dashboard/stack/')({
  component: DashboardStackPage,
})

type ActiveTab = 'technologies' | 'categories'

function DashboardStackPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('technologies')
  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [technologies, setTechnologies] = useState<TechnologyWithCategories[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [catJson, techJson] = await Promise.all([
        api<{ data?: CategoryRecord[] }>('/api/categories'),
        api<{ data?: TechnologyWithCategories[] }>('/api/technologies'),
      ])

      setCategories(catJson.data ?? [])
      setTechnologies(techJson.data ?? [])
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal memuat data stack.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`))
      return
    setError(null)
    try {
      await api('/api/categories', { method: 'DELETE', query: { id } })
      await loadData()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal menghapus kategori.'))
    }
  }

  const handleDeleteTech = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus teknologi "${name}"?`))
      return
    setError(null)
    try {
      await api('/api/technologies', {
        method: 'DELETE',
        query: { id },
      })
      await loadData()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal menghapus teknologi.'))
    }
  }

  const categoryMap = new Map<string, string>(
    categories.map((c) => [c.id, c.name]),
  )

  return (
    <DashboardShell
      title="Tech Stack & Skills"
      description="Kelola teknologi, framework, dan kategori skill untuk portfolio Anda."
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Refresh
          </button>
          <Link
            to="/dashboard/stack/categories/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-card) px-4 text-sm font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange)"
          >
            <Plus
              aria-hidden="true"
              className="size-4 text-(--brand-orange-deep)"
            />
            Tambah Kategori
          </Link>
          <Link
            to="/dashboard/stack/technologies/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
          >
            <Plus aria-hidden="true" className="size-4" />
            Tambah Teknologi
          </Link>
        </div>
      }
    >
      {/* Navigation Tabs */}
      <div className="flex border-b border-(--brand-line) mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('technologies')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === 'technologies'
              ? 'border-(--brand-orange) text-(--brand-orange-deep)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <Layers className="size-4" />
          Teknologi ({technologies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-(--brand-orange) text-(--brand-orange-deep)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <FolderTree className="size-4" />
          Kategori ({categories.length})
        </button>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          {error}
        </div>
      ) : null}

      {/* Technologies Tab Content */}
      {activeTab === 'technologies' ? (
        <div className="surface-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-sm font-semibold text-(--brand-muted)">
              Memuat daftar teknologi...
            </div>
          ) : technologies.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-(--brand-muted)">
                Belum ada teknologi.
              </p>
              <Link
                to="/dashboard/stack/technologies/new"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--brand-orange) px-4 py-2 text-xs font-bold text-white no-underline"
              >
                <Plus className="size-3.5" />
                Tambah Teknologi Pertama
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Icon</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Ultimate</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technologies.map((tech) => (
                  <TableRow key={tech.id}>
                    <TableCell>
                      <div className="grid size-9 place-items-center rounded-lg border border-(--brand-line) bg-(--surface-strong)">
                        <TechIcon
                          src={tech.icon}
                          name={tech.name}
                          color={tech.color}
                          className="size-5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-(--brand-ink)">
                      <div className="flex items-center gap-2">
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
                    </TableCell>
                    <TableCell className="font-mono text-xs text-(--brand-muted)">
                      {tech.slug}
                    </TableCell>
                    <TableCell>
                      {tech.isUltimate ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 font-mono text-xs font-bold text-(--brand-orange-deep)">
                          <Zap className="size-3 fill-current" />
                          Ultimate
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-(--brand-muted)">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tech.categoryIds.map((catId) => (
                          <span
                            key={catId}
                            className="rounded-md border border-(--brand-line) bg-(--surface-strong) px-2 py-0.5 font-mono text-xs font-medium text-(--brand-muted)"
                          >
                            {categoryMap.get(catId) ?? catId}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
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
                          onClick={() => handleDeleteTech(tech.id, tech.name)}
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500 hover:text-white"
                          title="Delete Technology"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ) : null}

      {/* Categories Tab Content */}
      {activeTab === 'categories' ? (
        <div className="surface-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-sm font-semibold text-(--brand-muted)">
              Memuat daftar kategori...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-(--brand-muted)">
                Belum ada kategori.
              </p>
              <Link
                to="/dashboard/stack/categories/new"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--brand-orange) px-4 py-2 text-xs font-bold text-white no-underline"
              >
                <Plus className="size-3.5" />
                Tambah Kategori Pertama
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Urutan</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-mono text-xs font-bold text-(--brand-muted)">
                      #{cat.sortOrder}
                    </TableCell>
                    <TableCell className="font-bold text-(--brand-ink)">
                      {cat.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-(--brand-muted)">
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-right">
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
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500 hover:text-white"
                          title="Delete Category"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ) : null}
    </DashboardShell>
  )
}
