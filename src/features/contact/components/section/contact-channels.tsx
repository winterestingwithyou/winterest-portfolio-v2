import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, Copy, ExternalLink, Mail, MapPin, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'

import type { getContactCopy } from '#/features/contact/copy'
import { settingsQueryOptions } from '#/features/settings/query-options'
import { socialQueryOptions } from '#/features/social/query-options'
import { platformMetaMap } from '#/features/social/types'
import { staggerContainer, staggerItem } from '#/lib/motion'

type ContactChannelsProps = {
  copy: ReturnType<typeof getContactCopy>['direct']
}

export function ContactChannels({ copy }: ContactChannelsProps) {
  const { data: settings } = useQuery(settingsQueryOptions.get())
  const { data: socialLinks = [] } = useQuery(socialQueryOptions.publicList())

  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const publicEmail = settings?.publicEmail.trim()

  const handleCopyEmail = async () => {
    if (!publicEmail) return
    try {
      await navigator.clipboard.writeText(publicEmail)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      // Graceful fallback for environments with restricted clipboard access
    }
  }

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.1)}
      className="grid w-full min-w-0 max-w-full gap-5"
    >
      {/* Direct Social Channels Card */}
      <motion.div
        variants={staggerItem}
        className="surface-card w-full min-w-0 max-w-full overflow-hidden p-4 sm:p-6 md:p-7"
      >
        <div className="flex items-center gap-3 border-b border-(--brand-line) pb-4">
          <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--brand-orange-soft) text-(--brand-orange-deep)">
            <MessageSquare aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-(--brand-ink)">
              {copy.title}
            </h2>
            <p className="truncate text-xs text-(--brand-muted)">
              {copy.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {socialLinks.length === 0 ? (
            <p className="py-2 text-xs italic text-(--brand-muted)">
              No public social links configured.
            </p>
          ) : (
            socialLinks.map((item) => {
              const meta = platformMetaMap[item.platform]
              const IconComponent = meta.icon
              const handle = item.username
                ? item.username.startsWith('@')
                  ? item.username
                  : `@${item.username}`
                : null
              const displayName = item.accountName || item.username || meta.name

              return (
                <div
                  key={item.id}
                  className="w-full min-w-0 rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                      {meta.name}
                    </span>
                    {handle && (
                      <span className="truncate font-mono text-xs text-(--brand-muted)">
                        {handle}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex w-full min-w-0 items-center justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                      <IconComponent
                        aria-hidden="true"
                        className="size-5 shrink-0 text-(--brand-ink)"
                      />
                      <span className="truncate text-xs font-bold text-(--brand-ink) sm:text-sm">
                        {displayName}
                      </span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-lg border border-(--brand-line) bg-(--surface) px-2.5 text-xs font-bold text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft) sm:min-h-9 sm:gap-1.5 sm:px-3"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        className="size-3.5 text-(--brand-muted)"
                      />
                      <span>Open</span>
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </motion.div>

      {/* Status, Location & Direct Email Pill Card */}
      <motion.div
        variants={staggerItem}
        className="surface-card w-full min-w-0 max-w-full p-4 sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex size-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
          </span>
          <p className="truncate text-xs font-bold text-(--brand-ink)">
            {copy.status}
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-(--brand-line) pt-3 text-xs text-(--brand-muted)">
          <MapPin
            aria-hidden="true"
            className="size-3.5 shrink-0 text-(--brand-orange)"
          />
          <span className="truncate">{copy.location}</span>
        </div>

        {/* Direct Email (Strict: only rendered when publicEmail is non-empty) */}
        {publicEmail ? (
          <div className="mt-3 border-t border-(--brand-line) pt-3">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 items-center gap-2 text-xs">
                <Mail
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-(--brand-orange)"
                />
                <a
                  href={`mailto:${publicEmail}`}
                  className="truncate font-mono text-xs font-semibold text-(--brand-ink) hover:text-(--brand-orange) hover:underline"
                  title={publicEmail}
                >
                  {publicEmail}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-(--brand-line) bg-(--surface) px-2 text-[11px] font-medium text-(--brand-ink) transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                  aria-label={copied ? copy.copiedEmail : copy.copyEmail}
                  title={copied ? copy.copiedEmail : copy.copyEmail}
                >
                  {copied ? (
                    <>
                      <Check
                        aria-hidden="true"
                        className="size-3 text-emerald-500"
                      />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {copy.copiedEmail}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy
                        aria-hidden="true"
                        className="size-3 text-(--brand-muted)"
                      />
                      <span>{copy.copyEmail}</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${publicEmail}`}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-(--brand-line) bg-(--surface) px-2 text-[11px] font-medium text-(--brand-ink) no-underline transition hover:border-(--brand-orange) hover:bg-(--brand-orange-soft)"
                  title={copy.sendEmail}
                  aria-label={copy.sendEmail}
                >
                  <ExternalLink
                    aria-hidden="true"
                    className="size-3 text-(--brand-muted)"
                  />
                  <span>{copy.sendEmail}</span>
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  )
}
