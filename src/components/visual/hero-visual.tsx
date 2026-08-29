import { useQuery } from '@tanstack/react-query'
import { Code2 } from 'lucide-react'
import { motion } from 'motion/react'

import { settingsQueryOptions } from '#/features/settings/query-options'
import { easeOutCubic, scaleIn, staggerContainer } from '#/lib/motion'
import { cn } from '#/lib/utils'

function BunIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3.25c-4.97 0-9 3.58-9 8 0 2.76 1.58 5.19 4 6.57-.14.54-.56 2.14-1.87 3.83 0 0 2.86-.27 5.27-2.01 1.03.24 2.1.28 3.1.05 2.41 1.74 5.27 2.01 5.27 2.01-1.31-1.69-1.73-3.29-1.87-3.83 2.42-1.38 4-3.81 4-6.57 0-4.42-4.03-8-9-8z" />
    </svg>
  )
}

function TsIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect
        width="24"
        height="24"
        rx="4"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M13.72 17.5c.87.5 1.88.75 2.92.73 1.24 0 2.05-.48 2.05-1.33 0-.84-.71-1.2-2.18-1.67-2.14-.68-3.48-1.57-3.48-3.53 0-2.16 1.77-3.7 4.54-3.7 1.37 0 2.57.34 3.44.89l-.92 1.84c-.75-.43-1.68-.69-2.58-.69-1.23 0-1.85.5-1.85 1.19 0 .76.68 1.13 2.22 1.63 2.37.76 3.46 1.7 3.46 3.63 0 2.42-1.92 3.78-4.83 3.78-1.54 0-2.88-.36-3.8-1.02l1.01-1.95zm-6.72-8.5h6.45v2.05h-2.15v8.95H8.92v-8.95H6.77V9c0 0 0 0 0 0z" />
    </svg>
  )
}

function CloudflareIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.48 10.3c-.47-2.69-2.79-4.73-5.6-4.73-2.38 0-4.46 1.48-5.28 3.64C3.26 9.53 1.5 11.41 1.5 13.73c0 2.5 2.03 4.53 4.53 4.53h10.97c2.2 0 3.98-1.78 3.98-3.98 0-2.07-1.58-3.77-3.6-3.95z" />
    </svg>
  )
}

const techItems = [
  { name: 'Bun', icon: BunIcon },
  { name: 'TypeScript', icon: TsIcon },
  { name: 'Cloudflare', icon: CloudflareIcon },
] as const

export function HeroVisual({ className }: { className?: string } = {}) {
  const { data: settings } = useQuery(settingsQueryOptions.get())
  const mascotSrc = settings?.heroVisualUrl || '/assets/characters/winterest.png'

  return (
    <motion.figure
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      className={cn(
        'relative isolate m-0 w-full min-h-[min(34rem,78vw)] overflow-hidden rounded-2xl border border-(--brand-line) bg-linear-to-br from-(--surface-strong)/82 to-(--brand-orange-soft)/56 shadow-2xl max-sm:min-h-136',
        className,
      )}
      aria-labelledby="hero-visual-title"
    >
      <div className="absolute inset-0">
        <img
          src={mascotSrc}
          alt="Original Winterest developer mascot with orange cloud accents and floating code panels."
          width={1536}
          height={1024}
          fetchPriority="high"
          className="size-full object-cover object-[50%_46%] saturate-[1.02] contrast-[1.01] md:scale-[1.03] md:animate-[hero-visual-float_8s_ease-in-out_infinite]"
        />
      </div>

      <figcaption className="sr-only" id="hero-visual-title">
        Original Winterest mascot for a Cloudflare and Bun inspired portfolio.
      </figcaption>

      {/* Tech Stack Badges (Top-Left) */}
      <motion.div
        variants={staggerContainer(0.12, 0.25)}
        initial="hidden"
        animate="visible"
        className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-sm:top-3 max-sm:left-3"
        aria-hidden="true"
      >
        {techItems.map((item) => {
          const Icon = item.icon

          return (
            <motion.div
              key={item.name}
              variants={{
                hidden: { opacity: 0, x: -16 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.45, ease: easeOutCubic },
                },
              }}
              whileHover={{ scale: 1.06, x: 2 }}
              className="flex items-center gap-2.5 rounded-full border border-orange-300/30 bg-(--brand-dark)/85 px-3 py-2 text-[#fff7ec] shadow-lg backdrop-blur-md transition-shadow hover:shadow-orange-500/20 max-sm:px-2.5 max-sm:py-1.5"
            >
              <Icon className="size-4 shrink-0 text-orange-400 max-sm:size-3.5" />
              <span className="text-xs font-extrabold leading-none tracking-wide max-sm:text-[11px]">
                {item.name}
              </span>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Terminal Info (Bottom-Right) */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20, scale: 0.95 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.55, delay: 0.35, ease: easeOutCubic },
          },
        }}
        initial="hidden"
        animate="visible"
        className="absolute right-4 bottom-4 z-10 w-[min(17rem,calc(100%-2rem))] rounded-xl border border-orange-300/30 bg-(--brand-dark)/85 p-3.5 sm:p-4 text-[#fff7ec] shadow-xl backdrop-blur-md max-sm:right-3 max-sm:bottom-3 max-sm:w-[calc(100%-1.5rem)]"
        aria-hidden="true"
      >
        <div className="mb-2.5 sm:mb-3 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f56]" />
          <span className="size-2 rounded-full bg-[#ffbd2e]" />
          <span className="size-2 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[0.65rem] text-orange-100">
            winterest/dev
          </span>
        </div>
        <div className="grid gap-1.5 font-mono text-[0.72rem] leading-5 text-orange-50">
          <span>
            <span className="text-orange-300">realname</span>: M. Adam Yudistira
          </span>
          <span>
            <span className="text-orange-300">nickname</span>: Winterest
          </span>
          <span>
            <span className="text-orange-300">stack</span>: Bun, TypeScript,
            Cloudflare
          </span>
        </div>
      </motion.div>

      {/* Role Badge (Top-Right) */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -14 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, delay: 0.3, ease: easeOutCubic },
          },
        }}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.05 }}
        className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-orange-300/30 bg-(--brand-dark)/85 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-extrabold text-[#fff7ec] shadow-lg backdrop-blur-md max-sm:top-3 max-sm:right-3"
        aria-hidden="true"
      >
        <Code2 className="size-3.5 sm:size-4 text-orange-400" />
        Junior Developer
      </motion.div>
    </motion.figure>
  )
}
