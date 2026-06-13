import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { ContentEditorForm } from '#/features/dashboard/ContentEditorForm'

type ContentRecord = {
  id: string
  locale: 'en' | 'id'
  slug: string
  title: string
  summary: string
  content?: string | null
  status: 'draft' | 'published' | 'archived'
  visibility?: 'public' | 'private'
  coverImage?: string | null
  tags: string[]
  demoUrl?: string | null
  repoUrl?: string | null
}

export const Route = createFileRoute('/dashboard/lab/$id')({
  component: DashboardLabEdit,
})

function DashboardLabEdit() {
  const copy = getDashboardCopy()
  const { id } = Route.useParams()
  const [entry, setEntry] = useState<ContentRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntry = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/lab/${id}`)
      const result: {
        data?: ContentRecord
        error?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? copy.lab.notFound)
      }

      setEntry(result.data ?? null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.lab.notFound)
    } finally {
      setIsLoading(false)
    }
  }, [copy.lab.notFound, id])

  useEffect(() => {
    void loadEntry()
  }, [loadEntry])

  return (
    <DashboardShell
      title={entry?.title ?? copy.lab.editTitle}
      description={copy.lab.editDescription}
      actions={
        <button
          type="button"
          onClick={loadEntry}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          {copy.common.refresh}
        </button>
      }
    >
      {isLoading ? (
        <div className="surface-card p-6 text-sm font-semibold text-[var(--brand-muted)]">
          {copy.lab.loadingEntry}
        </div>
      ) : error ? (
        <div className="surface-card p-6 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : entry ? (
        <ContentEditorForm kind="lab" mode="edit" entry={entry} />
      ) : null}
    </DashboardShell>
  )
}
