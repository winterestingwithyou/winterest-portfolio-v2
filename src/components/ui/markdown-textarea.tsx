import { Eye, PenLine } from 'lucide-react'
import * as React from 'react'

import { Markdown } from '#/components/ui/markdown'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils'

export type MarkdownTextareaProps = React.ComponentProps<'textarea'> & {
  labels?: {
    write?: string
    preview?: string
    emptyPreview?: string
    helperText?: string
  }
}

export function MarkdownTextarea({
  id,
  name,
  value = '',
  onChange,
  onBlur,
  placeholder,
  rows = 6,
  className,
  labels,
  'aria-invalid': ariaInvalid,
  ...props
}: MarkdownTextareaProps) {
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write')

  const writeLabel = labels?.write ?? 'Write'
  const previewLabel = labels?.preview ?? 'Preview'
  const emptyPreviewText =
    labels?.emptyPreview ?? 'No description content to preview yet.'
  const helperText = labels?.helperText ?? 'Supports Markdown formatting'

  const stringValue = typeof value === 'string' ? value : String(value)

  return (
    <div className="w-full space-y-2">
      {/* Editor & Preview Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-lg border border-(--brand-line) bg-surface p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition',
              activeTab === 'write'
                ? 'bg-(--brand-orange) text-white shadow-xs'
                : 'text-(--brand-muted) hover:text-(--brand-ink)',
            )}
          >
            <PenLine className="size-3.5" />
            {writeLabel}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition',
              activeTab === 'preview'
                ? 'bg-(--brand-orange) text-white shadow-xs'
                : 'text-(--brand-muted) hover:text-(--brand-ink)',
            )}
          >
            <Eye className="size-3.5" />
            {previewLabel}
          </button>
        </div>

        <span className="text-[11px] font-medium text-(--brand-muted)">
          {helperText}
        </span>
      </div>

      {/* Editor or Preview Pane */}
      {activeTab === 'write' ? (
        <Textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          className={cn(
            'min-h-32 w-full min-w-0 rounded-xl border-(--brand-line) bg-surface text-sm leading-relaxed',
            className,
          )}
          {...props}
        />
      ) : (
        <div
          className={cn(
            'min-h-32 w-full min-w-0 rounded-xl border border-(--brand-line) bg-surface p-4 text-sm leading-relaxed overflow-y-auto',
            className,
          )}
        >
          {stringValue.trim() ? (
            <Markdown content={stringValue} />
          ) : (
            <p className="text-xs italic text-(--brand-muted)">
              {emptyPreviewText}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
