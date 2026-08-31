import { useState } from 'react'
import {
  Check,
  Cloud,
  Copy,
  Database,
  KeyRound,
  RefreshCw,
  Terminal,
} from 'lucide-react'

import ParaglideLocaleSwitcher from '#/components/locale-switcher'
import ThemeToggle from '#/components/theme-toggle'
import { getSystemSetupCopy } from '#/features/system/copy'
import type { SystemStatus } from '#/features/system/server-functions'
import { cn } from '#/lib/utils'

export function SetupRequiredScreen({ status }: { status: SystemStatus }) {
  const isMigrationMode = !status.isMigrated
  const screenType = isMigrationMode ? 'migration' : 'owner'
  const copy = getSystemSetupCopy(screenType)

  const [activeTab, setActiveTab] = useState<'local' | 'remote'>('local')
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const command = activeTab === 'local' ? copy.commandLocal : copy.commandRemote

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API is unavailable
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_12%_14%,color-mix(in_srgb,var(--brand-orange)_24%,transparent),transparent_28rem),radial-gradient(circle_at_86%_78%,color-mix(in_srgb,var(--brand-orange-deep)_20%,transparent),transparent_24rem),linear-gradient(145deg,color-mix(in_srgb,var(--brand-cream)_92%,white),color-mix(in_srgb,var(--brand-orange-soft)_42%,var(--brand-cream)))] text-(--brand-ink) dark:bg-[radial-gradient(circle_at_12%_14%,color-mix(in_srgb,var(--brand-orange)_22%,transparent),transparent_28rem),radial-gradient(circle_at_84%_76%,color-mix(in_srgb,var(--brand-orange-deep)_28%,transparent),transparent_24rem),linear-gradient(145deg,color-mix(in_srgb,var(--brand-dark)_96%,black),color-mix(in_srgb,#24170d_72%,var(--brand-dark)))]">
      {/* Top Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-orange)_38%,transparent)] bg-[color-mix(in_srgb,var(--surface-strong)_72%,transparent)] py-1 pr-3.5 pl-1.5 text-sm font-black text-(--brand-ink) shadow-[0_18px_44px_var(--brand-glow)]">
          <span className="brand-mark flex size-7 items-center justify-center rounded-full bg-(--brand-orange) text-white">
            <Cloud aria-hidden="true" className="size-4" />
          </span>
          <span className="tracking-tight">Winterest</span>
        </div>

        <div className="flex items-center gap-2">
          <ParaglideLocaleSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="text-center">
          {/* Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider',
              isMigrationMode
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
            )}
          >
            {isMigrationMode ? (
              <Database className="size-3.5" />
            ) : (
              <KeyRound className="size-3.5" />
            )}
            <span>{copy.badge}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-(--brand-ink) sm:text-4xl lg:text-5xl">
            {copy.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-(--brand-muted) sm:text-base">
            {copy.description}
          </p>
        </div>

        {/* Command Card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-(--brand-line) bg-[color-mix(in_srgb,var(--surface-strong)_90%,transparent)] shadow-2xl backdrop-blur-md">
          <div className="border-b border-(--brand-line) px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-(--brand-orange)" />
                <h2 className="text-sm font-black text-(--brand-ink)">
                  {copy.cardTitle}
                </h2>
              </div>

              {/* Target Tab Switcher */}
              <div className="flex rounded-lg border border-(--brand-line) bg-surface p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('local')}
                  className={cn(
                    'rounded-md px-2.5 py-1 transition',
                    activeTab === 'local'
                      ? 'bg-(--brand-orange) text-white shadow-xs'
                      : 'text-(--brand-muted) hover:text-(--brand-ink)',
                  )}
                >
                  {copy.tabLocal}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('remote')}
                  className={cn(
                    'rounded-md px-2.5 py-1 transition',
                    activeTab === 'remote'
                      ? 'bg-(--brand-orange) text-white shadow-xs'
                      : 'text-(--brand-muted) hover:text-(--brand-ink)',
                  )}
                >
                  {copy.tabRemote}
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-(--brand-muted)">
              {copy.cardSubtitle}
            </p>
          </div>

          {/* Terminal Command Snippet */}
          <div className="p-5 sm:p-6">
            <div className="group relative flex items-center justify-between rounded-xl border border-zinc-700/50 bg-zinc-900 px-4 py-3.5 font-mono text-xs sm:text-sm text-zinc-100 shadow-inner">
              <div className="flex items-center gap-3 overflow-x-auto">
                <span className="select-none font-bold text-(--brand-orange)">
                  $
                </span>
                <span className="font-semibold text-emerald-400">
                  {command}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="ml-3 inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                title={copy.copyCommand}
              >
                {copied ? (
                  <Check className="size-4 text-emerald-400" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>

            {/* Tip note (if any) */}
            {copy.freshTip && (
              <div className="mt-3 rounded-lg border border-(--brand-line) bg-surface/60 px-3.5 py-2 text-xs text-(--brand-muted)">
                💡 {copy.freshTip}
              </div>
            )}

            {/* Step Instructions */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-(--brand-muted)">
                {copy.stepsTitle}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-(--brand-ink)">
                {copy.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--brand-orange-soft) text-[0.7rem] font-black text-(--brand-orange-deep)">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Refresh Action Button */}
            <div className="mt-8 flex justify-center pt-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-(--brand-orange) to-(--brand-orange-deep) px-8 text-sm font-black text-white shadow-[0_18px_44px_var(--brand-glow)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_54px_var(--brand-glow)] disabled:opacity-60"
              >
                <RefreshCw
                  className={cn('size-4', isRefreshing && 'animate-spin')}
                />
                <span>
                  {isRefreshing ? copy.refreshingButton : copy.refreshButton}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-(--brand-muted)">
          <div className="inline-flex items-center gap-1.5">
            <KeyRound className="size-3.5 text-(--brand-orange)" />
            <span>Winterest Portfolio Platform Setup & Integrity Guard</span>
          </div>
        </div>
      </main>
    </div>
  )
}
