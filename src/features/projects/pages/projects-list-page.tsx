import { useNavigate, useSearch } from '@tanstack/react-router'
import { RotateCcw, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo } from 'react'

import { Container, SectionHeader } from '#/components/marketing/section'
import { ProjectCard } from '#/components/portfolio/project-card'
import { DataPagination } from '#/components/ui/data-pagination'
import { SearchInput } from '#/components/ui/search-input'
import { getProjectsCopy } from '#/features/projects/copy'
import type { getPublishedProjects } from '#/features/projects/public-loaders'
import { fadeIn, fadeUp, staggerContainer, staggerItem } from '#/lib/motion'

type ProjectsListPageProps = {
  projects: Awaited<ReturnType<typeof getPublishedProjects>>
}

const PAGE_SIZE = 9

export function ProjectsListPage({ projects }: ProjectsListPageProps) {
  const copy = getProjectsCopy()
  const searchParams = useSearch({ from: '/projects/' })
  const navigate = useNavigate({ from: '/projects/' })

  const searchQuery = searchParams.q ?? ''
  const activeCategory = searchParams.category ?? 'all'
  const page = searchParams.page ?? 1

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return projects.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      if (!matchCat) return false

      if (!q) return true
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchSummary = p.summary.toLowerCase().includes(q)
      const matchTech = p.technologies.some((t) =>
        t.name.toLowerCase().includes(q),
      )

      return matchTitle || matchSummary || matchTech
    })
  }, [projects, activeCategory, searchQuery])

  // Compute category pill options & counts
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {}
    projects.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] ?? 0) + 1
      }
    })
    const uniqueCategories = Object.keys(counts).sort()
    return {
      list: ['all', ...uniqueCategories],
      counts,
    }
  }, [projects])

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / PAGE_SIZE)
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredProjects.slice(start, start + PAGE_SIZE)
  }, [filteredProjects, page])

  const handleSearchChange = (val: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        q: val || undefined,
        page: undefined, // reset page to 1
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handleCategoryChange = (category: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        category: category === 'all' ? undefined : category,
        page: undefined, // reset page to 1
      }),
      replace: true,
      resetScroll: false,
    })
  }

  const handlePageChange = (newPage: number) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        page: newPage === 1 ? undefined : newPage,
      }),
      replace: true,
      resetScroll: false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResetFilters = () => {
    void navigate({
      search: () => ({}),
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <main className="py-16 md:py-24">
      <Container>
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <motion.div variants={fadeUp}>
            <SectionHeader
              eyebrow={copy.list.eyebrow}
              title={copy.list.title}
              description={copy.list.description}
            />
          </motion.div>

          {projects.length > 0 && (
            <motion.div
              variants={fadeUp}
              className="mt-8 mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
                {categoryStats.list.map((cat) => {
                  const isSelected = activeCategory === cat
                  const label = cat === 'all' ? copy.list.allCategories : cat
                  const count =
                    cat === 'all'
                      ? projects.length
                      : (categoryStats.counts[cat] ?? 0)

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--brand-orange) ${
                        isSelected
                          ? 'bg-(--brand-orange) text-white font-bold'
                          : 'border border-(--brand-line) bg-card text-(--brand-ink) hover:border-(--brand-orange)/60'
                      }`}
                    >
                      <span>{label}</span>
                      <span className="font-mono text-[11px] opacity-80">
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-80 shrink-0">
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={copy.list.searchPlaceholder}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          {projects.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="surface-card p-8 text-center"
            >
              <h2 className="text-2xl font-semibold text-(--brand-ink)">
                {copy.list.emptyTitle}
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-(--brand-muted)">
                {copy.list.emptyDescription}
              </p>
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              variants={fadeUp}
              className="surface-card p-12 text-center flex flex-col items-center justify-center space-y-4"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
                <Search className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-(--brand-ink)">
                  {copy.list.noMatchingProjects}
                </h3>
                <p className="text-sm text-(--brand-muted) max-w-md mx-auto">
                  {copy.list.noMatchingDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 rounded-full bg-(--brand-orange-soft) px-4 py-2 text-xs font-bold text-(--brand-orange-deep) transition hover:bg-(--brand-orange) hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--brand-orange) cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                {copy.list.resetFilters}
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer(0.09, 0.1)}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {paginatedProjects.map((project) => (
                  <motion.div key={project.id} variants={staggerItem}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>

              <DataPagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredProjects.length}
                pageSize={PAGE_SIZE}
                showItemCount
                onPageChange={handlePageChange}
                itemLabel={copy.list.projects}
                className="mt-12"
              />
            </>
          )}
        </motion.div>
      </Container>
    </main>
  )
}
