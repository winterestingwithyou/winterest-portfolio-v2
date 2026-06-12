import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { ContentEditorForm } from '#/features/dashboard/ContentEditorForm'

type ContentRecord = {
  id: string
  slug: string
  title: string
  summary: string
  content?: string | null
  status: 'draft' | 'published' | 'archived'
  visibility?: 'public' | 'private'
  coverImage?: string | null
  tags: string[]
}

export const Route = createFileRoute('/dashboard/writing/$id')({
  component: DashboardWritingEdit,
})

function DashboardWritingEdit() {
  const { id } = Route.useParams()
  const [entry, setEntry] = useState<ContentRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntry = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/writing/${id}`)
      const result: {
        data?: ContentRecord
        error?: string
      } = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to load article.')
      }

      setEntry(result.data ?? null)
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Failed to load article.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadEntry()
  }, [loadEntry])

  return (
    <DashboardShell
      title={entry?.title ?? 'Edit Article'}
      description="Edit a D1-backed writing record."
      actions={
        <button
          type="button"
          onClick={loadEntry}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--brand-line)] bg-[var(--surface-strong)] px-4 text-sm font-bold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-orange)]"
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Refresh
        </button>
      }
    >
      {isLoading ? (
        <div className="surface-card p-6 text-sm font-semibold text-[var(--brand-muted)]">
          Loading article...
        </div>
      ) : error ? (
        <div className="surface-card p-6 text-sm font-semibold text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : entry ? (
        <ContentEditorForm kind="writing" mode="edit" entry={entry} />
      ) : null}
    </DashboardShell>
  )
}
