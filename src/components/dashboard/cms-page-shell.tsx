import type { ReactNode } from 'react'

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Save,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { LanguageSwitcherPill } from '#/components/ui/language-switcher-pill'
import { getDashboardCopy } from '#/features/dashboard/copy'
import { cn } from '#/lib/utils'

type StatusMessage = {
  text: string
  isError: boolean
} | null

type CmsPageShellProps = {
  /** Optional eyebrow tag above title (defaults to localized cmsPageEyebrow) */
  eyebrow?: string
  /** Icon element (Lucide), rendered in the eyebrow badge */
  icon: ReactNode
  /** Page title */
  title: string
  /** Short description under the title */
  description?: string
  /** Active locale for the language switcher */
  locale: 'en' | 'id'
  /** Called when locale changes */
  onLocaleChange: (locale: 'en' | 'id') => void
  /** Called when the reset button is clicked */
  onReset?: () => void
  /** Whether the save action is pending */
  isSaving?: boolean
  /** Called when save is clicked — only used when asForm=false */
  onSave?: () => void
  /** Whether to render a <form> wrapper (true by default) */
  asForm?: boolean
  /** Called when form submits (if asForm=true) */
  onSubmit?: (e: React.FormEvent) => void
  /** Status feedback message */
  statusMessage?: StatusMessage
  /** Page content */
  children: ReactNode
  /** Optional extra class on the content area */
  className?: string
  /** Label for the save button */
  saveLabel?: string
  /** Label when saving */
  savingLabel?: string
  /** Label for reset button */
  resetLabel?: string
}

/**
 * Unified shell for all `/dashboard/pages/*` CMS content management pages.
 *
 * Provides:
 * - Impeccable card-contained header with balanced two-tier desktop controls
 * - Refined eyebrow badge, crisp typography, and balanced action cluster
 * - Status feedback banner (success / error) immediately below header
 * - Full responsive width with zero horizontal void
 * - Optional <form> wrapper
 */
export function CmsPageShell({
  eyebrow,
  icon,
  title,
  description,
  locale,
  onLocaleChange,
  onReset,
  isSaving = false,
  onSave,
  asForm = true,
  onSubmit,
  statusMessage,
  children,
  className,
  saveLabel,
  savingLabel,
  resetLabel,
}: CmsPageShellProps) {
  const { shell, common } = getDashboardCopy()
  const displayEyebrow = eyebrow ?? shell.cmsPageEyebrow
  const displaySaveLabel = saveLabel ?? common.saveChanges
  const displaySavingLabel = savingLabel ?? common.saving
  const displayResetLabel = resetLabel ?? common.resetDefault

  const header = (
    <header className="flex flex-col gap-5 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between w-full min-w-0 max-w-full">
      {/* Left: Eyebrow + Title + Description */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-(--brand-orange)">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-(--brand-orange-soft) text-(--brand-orange) [&>svg]:size-3.5">
            {icon}
          </span>
          <span className="tracking-wider uppercase text-[11px] font-bold">
            {displayEyebrow}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-(--brand-ink) break-words">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-(--brand-muted) break-words">
            {description}
          </p>
        )}
      </div>

      {/* Right: Balanced Two-Row Control Cluster */}
      <div className="flex flex-col items-start sm:items-end gap-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-(--brand-muted) hidden md:inline">
            {common.contentLanguage}
          </span>
          <LanguageSwitcherPill
            activeLocale={locale}
            onChange={onLocaleChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onReset && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-(--brand-muted) hover:text-(--brand-ink) cursor-pointer"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              {displayResetLabel}
            </Button>
          )}

          <Button
            type={asForm && onSubmit ? 'submit' : 'button'}
            size="sm"
            disabled={isSaving}
            onClick={!asForm || !onSubmit ? onSave : undefined}
            className="flex items-center gap-1.5 bg-(--brand-orange) font-bold text-white hover:brightness-105 disabled:opacity-60 cursor-pointer shadow-xs"
          >
            {isSaving ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-3.5" aria-hidden="true" />
            )}
            {isSaving ? displaySavingLabel : displaySaveLabel}
          </Button>
        </div>
      </div>
    </header>
  )

  const statusBanner = statusMessage && (
    <div
      role="alert"
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-4 py-3 text-xs font-semibold shadow-xs transition-all w-full min-w-0 max-w-full',
        statusMessage.isError
          ? 'border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400'
          : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      )}
    >
      {statusMessage.isError ? (
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
      )}
      <span className="min-w-0 break-words">{statusMessage.text}</span>
    </div>
  )

  const inner = (
    <div
      className={cn('flex flex-col gap-6 w-full min-w-0 max-w-full', className)}
    >
      {header}
      {statusBanner}
      <div className="w-full min-w-0 max-w-full">{children}</div>
    </div>
  )

  if (asForm && onSubmit) {
    return (
      <form onSubmit={onSubmit} className="w-full min-w-0 max-w-full">
        {inner}
      </form>
    )
  }

  return <div className="w-full min-w-0 max-w-full">{inner}</div>
}
