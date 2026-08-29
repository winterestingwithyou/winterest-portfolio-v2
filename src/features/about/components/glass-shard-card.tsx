import { motion } from 'motion/react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import type { GenshinChar } from '#/features/about/data'
import { staggerItemScale } from '#/lib/motion'
import { cn } from '#/lib/utils'

export const GLASS_SHARDS = [
  {
    // Shard 0: Arlecchino (Top-Left, sharp vertical wedge)
    clipPath: 'polygon(15% 0%, 98% 6%, 82% 98%, 0% 84%)',
    svgPoints: '15,0 98,6 82,98 0,84',
    rotation: '-rotate-3 group-hover:rotate-0',
    offset: 'sm:-translate-y-2',
  },
  {
    // Shard 1: Wanderer (Top-Right, inverted angular polygon)
    clipPath: 'polygon(10% 4%, 90% 0%, 100% 88%, 18% 100%)',
    svgPoints: '10,4 90,0 100,88 18,100',
    rotation: 'rotate-4 group-hover:rotate-0',
    offset: 'sm:translate-y-3',
  },
  {
    // Shard 2: Lohen (Bottom-Left, sharp diagonal prism)
    clipPath: 'polygon(4% 10%, 96% 0%, 94% 84%, 12% 98%)',
    svgPoints: '4,10 96,0 94,84 12,98',
    rotation: '-rotate-2 group-hover:rotate-0',
    offset: 'sm:-translate-y-1',
  },
  {
    // Shard 3: Tsaritsa (Bottom-Right, tall crystal shard pointing outward)
    clipPath: 'polygon(12% 0%, 100% 15%, 85% 100%, 0% 88%)',
    svgPoints: '12,0 100,15 85,100 0,88',
    rotation: 'rotate-3 group-hover:rotate-0',
    offset: 'sm:translate-y-2',
  },
]

type GlassShardCardProps = {
  character: GenshinChar
  index: number
}

export function GlassShardCard({ character, index }: GlassShardCardProps) {
  const shard = GLASS_SHARDS[index] || GLASS_SHARDS[0]

  return (
    <Popover key={character.name}>
      <PopoverTrigger asChild>
        <motion.button
          variants={staggerItemScale}
          type="button"
          className={cn(
            'group relative aspect-3/4 w-full cursor-pointer transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-(--brand-orange) hover:scale-105 hover:z-30',
            shard.rotation,
            shard.offset,
          )}
          aria-label={`Inspect ${character.name} glass shard`}
        >
          {/* Glass Shard Polygon Body */}
          <div
            className="relative size-full overflow-hidden bg-black/60 shadow-xl transition-all duration-300"
            style={{ clipPath: shard.clipPath }}
          >
            <img
              src={character.image}
              alt={character.name}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="size-full object-cover object-top transition-transform duration-700 group-hover:scale-115"
            />

            {/* Glass Specular Glint Reflection */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-cyan-400/20 via-white/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Vignette Bottom Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-black/20" />
          </div>

          {/* Glass Shard Outlined Bevel Border (SVG) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points={shard.svgPoints}
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5"
              className="transition-all duration-300 group-hover:stroke-(--brand-orange) drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          </svg>

          {/* Shard Label Floating Name */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-3 z-20 flex justify-center">
            <span className="rounded-full bg-(--surface-strong) px-3 py-1 text-xs font-black tracking-wide text-(--brand-ink) border border-(--brand-line) shadow-xl group-hover:border-(--brand-orange) group-hover:text-(--brand-orange-deep) group-hover:scale-105 transition-all">
              {character.name}
            </span>
          </div>
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        sideOffset={16}
        className="w-72 sm:w-80 rounded-2xl border-(--brand-orange)/40 bg-(--surface-strong)/95 backdrop-blur-md p-4 shadow-2xl space-y-3"
      >
        <div className="flex items-center gap-3">
          <img
            src={character.image}
            alt={character.name}
            referrerPolicy="no-referrer"
            className="size-11 rounded-xl object-cover border border-(--brand-orange)/50 shrink-0"
          />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-(--brand-orange-deep) block">
              Genshin Impact
            </span>
            <h4 className="font-bold text-base text-(--brand-ink) leading-tight">
              {character.name}
            </h4>
          </div>
        </div>

        <div className="rounded-xl border border-(--brand-line) bg-(--site-bg)/80 p-3 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-(--brand-muted) block">
            Catatan Karakter
          </span>
          <blockquote className="text-xs italic font-medium leading-relaxed text-(--brand-ink)">
            "{character.reason}"
          </blockquote>
        </div>
      </PopoverContent>
    </Popover>
  )
}
