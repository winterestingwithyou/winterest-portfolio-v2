import { createFileRoute } from '@tanstack/react-router'
import {
  Edit3,
  ExternalLink,
  FolderTree,
  Layers,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
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

export const Route = createFileRoute('/dashboard/stack')({
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

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(
    null,
  )
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catSortOrder, setCatSortOrder] = useState(0)

  // Tech Modal State
  const [isTechModalOpen, setIsTechModalOpen] = useState(false)
  const [editingTech, setEditingTech] =
    useState<TechnologyWithCategories | null>(null)
  const [techName, setTechName] = useState('')
  const [techSlug, setTechSlug] = useState('')
  const [techIcon, setTechIcon] = useState('')
  const [techColor, setTechColor] = useState('')
  const [techUrl, setTechUrl] = useState('')
  const [techDesc, setTechDesc] = useState('')
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [catRes, techRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/technologies'),
      ])
      const catJson: { data?: CategoryRecord[] } = await catRes.json()
      const techJson: { data?: TechnologyWithCategories[] } =
        await techRes.json()

      setCategories(catJson.data ?? [])
      setTechnologies(techJson.data ?? [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load stack data.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  // Handlers for Category
  const openNewCategoryModal = () => {
    setEditingCategory(null)
    setCatName('')
    setCatSlug('')
    setCatDesc('')
    setCatSortOrder(categories.length + 1)
    setIsCategoryModalOpen(true)
  }

  const openEditCategoryModal = (cat: CategoryRecord) => {
    setEditingCategory(cat)
    setCatName(cat.name)
    setCatSlug(cat.slug)
    setCatDesc(cat.description ?? '')
    setCatSortOrder(cat.sortOrder)
    setIsCategoryModalOpen(true)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        name: catName,
        slug: catSlug,
        description: catDesc,
        sortOrder: Number(catSortOrder),
      }

      const url = '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      const body = editingCategory
        ? JSON.stringify({ id: editingCategory.id, ...payload })
        : JSON.stringify(payload)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      if (!res.ok) {
        const json: { error?: string } = await res.json()
        throw new Error(json.error ?? 'Failed to save category')
      }

      setIsCategoryModalOpen(false)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving category.')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    setError(null)
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete category.')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting category.')
    }
  }

  // Handlers for Technology
  const openNewTechModal = () => {
    setEditingTech(null)
    setTechName('')
    setTechSlug('')
    setTechIcon('')
    setTechColor('')
    setTechUrl('')
    setTechDesc('')
    setSelectedCatIds(categories.map((c) => c.id).slice(0, 1))
    setIsTechModalOpen(true)
  }

  const openEditTechModal = (tech: TechnologyWithCategories) => {
    setEditingTech(tech)
    setTechName(tech.name)
    setTechSlug(tech.slug)
    setTechIcon(tech.icon ?? '')
    setTechColor(tech.color ?? '')
    setTechUrl(tech.url ?? '')
    setTechDesc(tech.description ?? '')
    setSelectedCatIds(tech.categoryIds)
    setIsTechModalOpen(true)
  }

  const handleSaveTech = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        name: techName,
        slug: techSlug,
        icon: techIcon,
        color: techColor,
        url: techUrl,
        description: techDesc,
        categoryIds: selectedCatIds,
      }

      const url = '/api/technologies'
      const method = editingTech ? 'PUT' : 'POST'
      const body = editingTech
        ? JSON.stringify({ id: editingTech.id, ...payload })
        : JSON.stringify(payload)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      if (!res.ok) {
        const json: { error?: string } = await res.json()
        throw new Error(json.error ?? 'Failed to save technology')
      }

      setIsTechModalOpen(false)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving technology.')
    }
  }

  const handleDeleteTech = async (id: string) => {
    if (!confirm('Are you sure you want to delete this technology?')) return
    setError(null)
    try {
      const res = await fetch(`/api/technologies?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete technology.')
      await loadData()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error deleting technology.',
      )
    }
  }

  const toggleCategorySelection = (catId: string) => {
    setSelectedCatIds((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    )
  }

  return (
    <DashboardShell
      title="Tech Stack & Skills"
      description="Manage technologies, programming languages, runtimes, and category mappings for your portfolio."
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-4 text-sm font-bold text-(--brand-ink) transition hover:border-(--brand-orange)"
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Refresh
          </button>

          {activeTab === 'technologies' ? (
            <button
              type="button"
              onClick={openNewTechModal}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              <Plus aria-hidden="true" className="size-4" />
              New Technology
            </button>
          ) : (
            <button
              type="button"
              onClick={openNewCategoryModal}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-(--brand-orange) px-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              <Plus aria-hidden="true" className="size-4" />
              New Category
            </button>
          )}
        </div>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {/* Tabs Header */}
      <div className="mb-6 flex border-b border-(--brand-line)">
        <button
          type="button"
          onClick={() => setActiveTab('technologies')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'technologies'
              ? 'border-(--brand-orange) text-(--brand-orange-deep)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <Layers className="size-4" />
          Technologies ({technologies.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-(--brand-orange) text-(--brand-orange-deep)'
              : 'border-transparent text-(--brand-muted) hover:text-(--brand-ink)'
          }`}
        >
          <FolderTree className="size-4" />
          Categories ({categories.length})
        </button>
      </div>

      {/* Tab 1: Technologies Table */}
      {activeTab === 'technologies' && (
        <section className="surface-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-sm font-semibold text-(--brand-muted)">
              Loading technologies...
            </div>
          ) : technologies.length === 0 ? (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-(--brand-ink)">
                No technologies added yet.
              </h2>
              <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
                Click "New Technology" to create your first tech stack entry.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-(--brand-orange-soft)">
                <TableRow>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    Technology
                  </TableHead>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    Categories
                  </TableHead>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    Icon & Color
                  </TableHead>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    URL
                  </TableHead>
                  <TableHead className="px-5 py-3 text-right font-bold text-(--brand-orange-deep)">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technologies.map((tech) => {
                  const techCats = categories.filter((c) =>
                    tech.categoryIds.includes(c.id),
                  )
                  return (
                    <TableRow key={tech.id}>
                      <TableCell className="px-5 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div
                            className="grid size-9 place-items-center rounded-lg border border-(--brand-line) bg-(--surface-strong)"
                            style={
                              tech.color
                                ? { borderColor: `${tech.color}40` }
                                : undefined
                            }
                          >
                            <TechIcon
                              src={tech.icon}
                              alt={tech.name}
                              color={tech.color}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-(--brand-ink)">
                              {tech.name}
                            </p>
                            <p className="font-mono text-xs text-(--brand-muted)">
                              {tech.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {techCats.length > 0 ? (
                            techCats.map((cat) => (
                              <span
                                key={cat.id}
                                className="rounded-md border border-(--brand-line) bg-(--brand-orange-soft) px-2.5 py-0.5 text-xs font-semibold text-(--brand-orange-deep)"
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-(--brand-muted)">
                              Uncategorized
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top text-xs text-(--brand-muted)">
                        <div>
                          Icon:{' '}
                          {tech.icon ? (
                            <span className="inline-block max-w-[140px] truncate align-bottom font-mono text-(--brand-ink)">
                              {tech.icon}
                            </span>
                          ) : (
                            <code className="text-(--brand-muted)">
                              default fallback
                            </code>
                          )}
                        </div>
                        {tech.color ? (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className="size-3 rounded-full border border-black/20"
                              style={{ backgroundColor: tech.color }}
                            />
                            <code>{tech.color}</code>
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top">
                        {tech.url ? (
                          <a
                            href={tech.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-(--brand-orange-deep) hover:underline"
                          >
                            Website <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-(--brand-muted)">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 align-top text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditTechModal(tech)}
                            className="inline-grid size-9 place-items-center rounded-full border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) transition hover:border-(--brand-orange)"
                          >
                            <Edit3 className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTech(tech.id)}
                            className="inline-grid size-9 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-700 transition hover:bg-red-500/20"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </section>
      )}

      {/* Tab 2: Categories Table */}
      {activeTab === 'categories' && (
        <section className="surface-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-sm font-semibold text-(--brand-muted)">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-(--brand-ink)">
                No categories added yet.
              </h2>
              <p className="mt-2 text-sm leading-7 text-(--brand-muted)">
                Click "New Category" to create your first tech stack category.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-(--brand-orange-soft)">
                <TableRow>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    Order
                  </TableHead>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    Category Name
                  </TableHead>
                  <TableHead className="px-5 py-3 font-bold text-(--brand-orange-deep)">
                    Description
                  </TableHead>
                  <TableHead className="px-5 py-3 text-right font-bold text-(--brand-orange-deep)">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="px-5 py-4 font-mono font-bold text-(--brand-ink)">
                      #{cat.sortOrder}
                    </TableCell>
                    <TableCell className="px-5 py-4 align-top">
                      <p className="font-semibold text-(--brand-ink)">
                        {cat.name}
                      </p>
                      <p className="font-mono text-xs text-(--brand-muted)">
                        {cat.slug}
                      </p>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-(--brand-muted)">
                      {cat.description || '-'}
                    </TableCell>
                    <TableCell className="px-5 py-4 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCategoryModal(cat)}
                          className="inline-grid size-9 place-items-center rounded-full border border-(--brand-line) bg-(--surface-strong) text-(--brand-ink) transition hover:border-(--brand-orange)"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="inline-grid size-9 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-700 transition hover:bg-red-500/20"
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
        </section>
      )}

      {/* Category Form Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-md p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-(--brand-ink)">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="rounded-full p-1 text-(--brand-muted) hover:text-(--brand-ink)"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="grid gap-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value)
                    if (!editingCategory) {
                      setCatSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, ''),
                      )
                    }
                  }}
                  className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                  placeholder="e.g. Runtime & Edge"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                  placeholder="runtime-edge"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Sort Order
                </label>
                <input
                  type="number"
                  required
                  value={catSortOrder}
                  onChange={(e) =>
                    setCatSortOrder(parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                  placeholder="Brief summary of what this category includes..."
                />
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="rounded-lg border border-(--brand-line) px-4 py-2 text-sm font-semibold text-(--brand-muted)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-(--brand-orange) px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Technology Form Modal */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="surface-card w-full max-w-lg p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-(--brand-ink)">
                {editingTech ? 'Edit Technology' : 'New Technology'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTechModalOpen(false)}
                className="rounded-full p-1 text-(--brand-muted) hover:text-(--brand-ink)"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTech} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={techName}
                    onChange={(e) => {
                      setTechName(e.target.value)
                      if (!editingTech) {
                        setTechSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, ''),
                        )
                      }
                    }}
                    className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                    placeholder="e.g. Bun"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={techSlug}
                    onChange={(e) => setTechSlug(e.target.value)}
                    className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                    placeholder="bun"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Categories (Many-to-Many)
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-(--brand-line) bg-(--surface-strong) p-3">
                  {categories.map((cat) => {
                    const isSelected = selectedCatIds.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategorySelection(cat.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-(--brand-orange) text-white border-(--brand-orange)'
                            : 'bg-(--brand-bg) text-(--brand-muted) border-(--brand-line) hover:border-(--brand-orange)'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-xs font-bold text-(--brand-ink)">
                      Icon Image URL
                    </label>
                    <div className="flex items-center gap-1.5 text-xs text-(--brand-muted)">
                      Preview:
                      <TechIcon
                        src={techIcon}
                        alt={techName}
                        color={techColor}
                        className="size-4"
                      />
                    </div>
                  </div>
                  <input
                    type="url"
                    value={techIcon}
                    onChange={(e) => setTechIcon(e.target.value)}
                    className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                    placeholder="https://cdn.simpleicons.org/bun"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                    Brand Color Hex
                  </label>
                  <input
                    type="text"
                    value={techColor}
                    onChange={(e) => setTechColor(e.target.value)}
                    className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                    placeholder="e.g. #f38020"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Official URL
                </label>
                <input
                  type="url"
                  value={techUrl}
                  onChange={(e) => setTechUrl(e.target.value)}
                  className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                  placeholder="https://bun.sh"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-(--brand-ink)">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={techDesc}
                  onChange={(e) => setTechDesc(e.target.value)}
                  className="w-full rounded-lg border border-(--brand-line) bg-(--surface-strong) px-3 py-2 text-sm text-(--brand-ink)"
                  placeholder="Short note on how you use this tech..."
                />
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="rounded-lg border border-(--brand-line) px-4 py-2 text-sm font-semibold text-(--brand-muted)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-(--brand-orange) px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  Save Technology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
