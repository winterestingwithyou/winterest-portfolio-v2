import { useQuery } from '@tanstack/react-query'
import { ExternalLink, MapPin, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'

import type { getContactCopy } from '#/features/contact/copy'
import { socialQueryOptions } from '#/features/social/query-options'
import { platformMetaMap } from '#/features/social/types'
import { staggerContainer, staggerItem } from '#/lib/motion'

type ContactChannelsProps = {
  copy: ReturnType<typeof getContactCopy>['direct']
}

export function ContactChannels({ copy }: ContactChannelsProps) {
  const { data: socialLinks = [] } = useQuery(socialQueryOptions.publicList())

  return (
    <motion.div
      variants={staggerContainer(0.08, 0.1)}
      className="grid w-full min-w-0 max-w-full gap-5"
    >
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

              return (
                <div
                  key={item.id}
                  className="w-full min-w-0 rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3.5 sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-(--brand-muted)">
                      {meta.name}
                    </span>
                    <span className="text-xs font-bold text-(--brand-muted)">
                      {item.accountName || `${meta.name} Profile`}
                    </span>
                  </div>
                  <div className="mt-2 flex w-full min-w-0 items-center justify-between gap-2 sm:gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
                      <IconComponent
                        aria-hidden="true"
                        className="size-5 shrink-0 text-(--brand-ink)"
                      />
                      <span className="truncate text-xs font-bold text-(--brand-ink) sm:text-sm">
                        {item.username || item.accountName || meta.name}
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

      {/* Status & Location Pill Card */}
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
      </motion.div>
    </motion.div>
  )
}
