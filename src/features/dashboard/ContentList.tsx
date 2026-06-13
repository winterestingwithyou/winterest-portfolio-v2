import { Link } from '@tanstack/react-router'
import { Edit3, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { getDashboardCopy } from './copy'

type ContentKind = 'writing' | 'lab'

type ContentRow = {
  id: string
  slug: string
  title: string
  summary: string
  status: 'draft' | 'published' | 'archived'
  tags: string[]
}

type ContentListProps = {
  kind: ContentKind
}

export function ContentList({ kind }: ContentListProps) {
  const copy = getDashboardCopy()
  const [entries, setEntries] = useState<ContentRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const endpoint = kind === 'writing' ? '/api/writing' : '/api/lab'
  const publicBase = kind === 'writing' ? '/writing' : '/lab'

  const loadEntries = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint)
      const result: {
        data?: ContentRow[]
        error?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? copy.common.loadError)
      }

      setEntries(result.data ?? [])
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.common.loadError)
    } finally {
      setIsLoading(false)
    }
  }, [copy.common.loadError, endpoint])

  const deleteEntry = useCallback(
    async (entry: ContentRow) => {
      setError(null)

      try {
        const response = await fetch(`${endpoint}/${entry.id}`, {
          method: 'DELETE',
        })
        const result: { error?: string } = await response.json()

        if (!response.ok) {
          throw new Error(result.error ?? copy.common.deleteError)
        }

        setEntries((current) => current.filter((item) => item.id !== entry.id))
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : copy.common.deleteError,
        )
      }
    },
    [copy.common.deleteError, endpoint],
  )

  useEffect(() => {
    void loadEntries()
  }, [loadEntries])

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={loadEntries}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {copy.common.refresh}
        </button>
        {kind === 'writing' ? (
          <Link
            to="/dashboard/writing/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
          >
            <Plus aria-hidden="true" className="size-4" />
            {copy.writing.new}
          </Link>
        ) : (
          <Link
            to="/dashboard/lab/new"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--brand-orange)] px-4 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5"
          >
            <Plus aria-hidden="true" className="size-4" />
            {copy.lab.new}
          </Link>
        )}
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <section className="surface-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm font-semibold text-[var(--brand-muted)]">
            {copy.common.loading}
          </div>
        ) : entries.length === 0 ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--brand-ink)]">
              {copy.common.emptyTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--brand-muted)]">
              {kind === 'writing'
                ? copy.writing.newDescription
                : copy.lab.newDescription}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--brand-line)] bg-[var(--brand-orange-soft)] text-[var(--brand-orange-deep)]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.entry}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.status}
                  </th>
                  <th scope="col" className="px-5 py-3 font-bold">
                    {copy.common.tags}
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-bold">
                    {copy.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--brand-line)]">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-[var(--brand-ink)]">
                        {entry.title}
                      </p>
                      <p className="mt-1 max-w-lg text-[var(--brand-muted)]">
                        {entry.summary}
                      </p>
                      <p className="mt-2 font-mono text-xs text-[var(--brand-muted)]">
                        {publicBase}/{entry.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="rounded-full bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-orange-deep)]">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex max-w-xs flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--brand-line)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <div className="inline-flex gap-2">
                        {kind === 'writing' ? (
                          <Link
                            to="/dashboard/writing/$id"
                            params={{ id: entry.id }}
                            className="inline-grid size-9 place-items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] text-[var(--brand-ink)] transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
                          >
                            <span className="sr-only">
                              {copy.common.edit} {entry.title}
                            </span>
                            <Edit3 aria-hidden="true" className="size-4" />
                          </Link>
                        ) : (
                          <Link
                            to="/dashboard/lab/$id"
                            params={{ id: entry.id }}
                            className="inline-grid size-9 place-items-center rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] text-[var(--brand-ink)] transition hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
                          >
                            <span className="sr-only">
                              {copy.common.edit} {entry.title}
                            </span>
                            <Edit3 aria-hidden="true" className="size-4" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => void deleteEntry(entry)}
                          className="inline-grid size-9 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-700 transition hover:-translate-y-0.5 dark:text-red-200"
                        >
                          <span className="sr-only">
                            {copy.common.delete} {entry.title}
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
    </>
  )
}
