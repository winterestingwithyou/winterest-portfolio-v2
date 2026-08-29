import {
  ExternalLink,
  Flame,
  Gamepad2,
  Music,
  Play,
  Sparkles,
  Tv,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import { SectionHeader } from '#/components/marketing/section'
import { GlassShardCard } from '#/features/about/components/glass-shard-card'
import type { getAboutData } from '#/features/about/data'
import {
  defaultViewport,
  fadeUp,
  staggerContainer,
  staggerItem,
} from '#/lib/motion'
import { cn } from '#/lib/utils'

type BeyondTheCodeSectionProps = {
  beyond: ReturnType<typeof getAboutData>['beyond']
}

export function BeyondTheCodeSection({ beyond }: BeyondTheCodeSectionProps) {
  const [activeBeyondTab, setActiveBeyondTab] = useState<
    'gaming' | 'anime' | 'kpop'
  >('gaming')

  return (
    <section className="space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={fadeUp}
      >
        <SectionHeader
          eyebrow={beyond.eyebrow}
          title={beyond.title}
          description={beyond.subtitle}
        />
      </motion.div>

      {/* Subtabs Navigation */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap gap-2 border-b border-(--brand-line) pb-4"
      >
        <button
          type="button"
          onClick={() => setActiveBeyondTab('gaming')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
            activeBeyondTab === 'gaming'
              ? 'bg-(--brand-orange) text-white shadow-xs'
              : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
          )}
        >
          <Gamepad2 className="size-4" />
          <span>{beyond.gaming.title}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveBeyondTab('anime')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
            activeBeyondTab === 'anime'
              ? 'bg-(--brand-orange) text-white shadow-xs'
              : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
          )}
        >
          <Tv className="size-4" />
          <span>{beyond.anime.title}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveBeyondTab('kpop')}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer',
            activeBeyondTab === 'kpop'
              ? 'bg-(--brand-orange) text-white shadow-xs'
              : 'bg-(--surface-strong) text-(--brand-muted) hover:text-(--brand-ink)',
          )}
        >
          <Music className="size-4" />
          <span>{beyond.kpop.title}</span>
        </button>
      </motion.div>

      {/* Tab Content */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {/* GAMING TAB */}
          {activeBeyondTab === 'gaming' && (
            <motion.div
              key="gaming"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 1. Mobile Legends Row */}
              <div className="surface-card p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-(--brand-orange)">
                <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
                  <img
                    src={beyond.gaming.mlbb.iconUrl}
                    alt={beyond.gaming.mlbb.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="size-14 sm:size-16 shrink-0 rounded-2xl border border-(--brand-line) bg-(--surface-strong) object-cover shadow-xs"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                        MOBA
                      </span>
                      <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[11px] font-bold text-(--brand-orange-deep)">
                        {beyond.gaming.mlbb.server}
                      </span>
                      <span className="text-xs text-(--brand-muted)">
                        IGN:{' '}
                        <span className="font-bold text-(--brand-ink)">
                          {beyond.gaming.mlbb.ign}
                        </span>
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-(--brand-ink)">
                      {beyond.gaming.mlbb.name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-(--brand-muted)">
                      {beyond.gaming.mlbb.notes}
                    </p>
                  </div>
                </div>

                {/* Hirara Hero Spotlight */}
                <div className="group flex items-center gap-4 rounded-xl border border-(--brand-line) bg-(--surface-strong) p-3 sm:p-4 shrink-0 transition-all hover:border-(--brand-orange)">
                  <div className="relative size-16 sm:size-20 shrink-0 overflow-hidden rounded-lg border border-(--brand-orange)/40 bg-black/20 shadow-xs">
                    <img
                      src={beyond.gaming.mlbb.heroImage}
                      alt={beyond.gaming.mlbb.heroName}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                      <Flame className="size-3 text-(--brand-orange)" />
                      {beyond.gaming.mlbb.heroLabel}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-(--brand-ink)">
                      {beyond.gaming.mlbb.heroName}
                    </h4>
                    <span className="text-[11px] text-(--brand-muted)">
                      Cuma Bisa Hirara
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Growtopia Row */}
              <div className="surface-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-(--brand-orange)">
                <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
                  <img
                    src={beyond.gaming.growtopia.iconUrl}
                    alt={beyond.gaming.growtopia.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="size-14 sm:size-16 shrink-0 rounded-2xl border border-(--brand-line) bg-(--surface-strong) object-cover shadow-xs"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                        Sandbox / Trading MMO
                      </span>
                      <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[11px] font-bold text-(--brand-orange-deep)">
                        World: {beyond.gaming.growtopia.world}
                      </span>
                      <span className="text-xs text-(--brand-muted)">
                        IGN:{' '}
                        <span className="font-bold text-(--brand-ink)">
                          {beyond.gaming.growtopia.ign}
                        </span>
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-(--brand-ink)">
                      {beyond.gaming.growtopia.name}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-(--brand-muted)">
                      {beyond.gaming.growtopia.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Genshin Impact Row with Broken-Glass / Fractured Collage */}
              <div className="surface-card p-6 sm:p-8 space-y-6 transition-all hover:border-(--brand-orange)">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--brand-line) pb-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={beyond.gaming.genshin.iconUrl}
                      alt={beyond.gaming.genshin.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="size-14 sm:size-16 shrink-0 rounded-2xl border border-(--brand-line) bg-(--surface-strong) object-cover shadow-xs"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep)">
                          Open World RPG
                        </span>
                        <span className="rounded-full bg-(--brand-orange-soft) px-2.5 py-0.5 text-[11px] font-bold text-(--brand-orange-deep)">
                          Low Spender
                        </span>
                        <span className="text-xs text-(--brand-muted)">
                          IGN:{' '}
                          <span className="font-bold text-(--brand-ink)">
                            {beyond.gaming.genshin.ign}
                          </span>
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-(--brand-ink) mt-1">
                        {beyond.gaming.genshin.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-(--brand-muted) max-w-md">
                    {beyond.gaming.genshin.notes}
                  </p>
                </div>

                {/* Shattered Glass Showcase */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-(--brand-orange-deep) flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-(--brand-orange)" />
                        {beyond.gaming.genshin.favLabel}
                      </span>
                      <span className="text-[11px] text-(--brand-muted) italic hidden sm:inline">
                        — (Klik pecahan kaca untuk melihat ulasan karakter)
                      </span>
                    </div>
                  </div>

                  {/* Broken Glass Shattered Arena */}
                  <div className="relative overflow-hidden rounded-2xl border border-(--brand-line) bg-radial from-(--brand-orange-soft)/20 via-(--surface-strong)/50 to-(--site-bg) p-4 sm:p-8">
                    {/* Background Fractured Crack Lines & Impact Center */}
                    <svg
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 size-full opacity-30 dark:opacity-40"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="50%"
                        y1="50%"
                        x2="5%"
                        y2="8%"
                        stroke="var(--brand-orange)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="95%"
                        y2="4%"
                        stroke="var(--brand-orange)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="8%"
                        y2="92%"
                        stroke="var(--brand-orange)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="92%"
                        y2="95%"
                        stroke="var(--brand-orange)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="0%"
                        stroke="var(--brand-line)"
                        strokeWidth="1"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="50%"
                        y2="100%"
                        stroke="var(--brand-line)"
                        strokeWidth="1"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="0%"
                        y2="50%"
                        stroke="var(--brand-line)"
                        strokeWidth="1"
                      />
                      <line
                        x1="50%"
                        y1="50%"
                        x2="100%"
                        y2="50%"
                        stroke="var(--brand-line)"
                        strokeWidth="1"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="6"
                        fill="var(--brand-orange)"
                        opacity="0.4"
                      />
                    </svg>

                    {/* 4 Shattered Glass Shards */}
                    <motion.div
                      variants={staggerContainer(0.08, 0.1)}
                      initial="hidden"
                      animate="visible"
                      className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-4"
                    >
                      {beyond.gaming.genshin.favorites.map((fav, i) => (
                        <GlassShardCard
                          key={fav.name}
                          character={fav}
                          index={i}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ANIME TAB */}
          {activeBeyondTab === 'anime' && (
            <motion.div
              key="anime"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="surface-card p-6 sm:p-8 transition-all hover:border-(--brand-orange)"
            >
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
                      <Tv className="size-3.5" />
                      <span>{beyond.anime.seriesLabel}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-(--brand-ink)">
                      {beyond.anime.favorite}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-(--brand-muted)">
                    {beyond.anime.summary}
                  </p>

                  <div className="rounded-xl border border-(--brand-line) bg-(--surface-strong) p-4 space-y-2 border-l-4 border-l-(--brand-orange)">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--brand-orange-deep)">
                      <Sparkles className="size-4 text-(--brand-orange)" />
                      <span>Domain Expansion & Tactical Battles</span>
                    </div>
                    <p className="text-xs leading-relaxed text-(--brand-muted)">
                      {beyond.anime.reason}
                    </p>
                  </div>
                </div>

                {/* Gojo Portrait Showcase */}
                <div className="group relative overflow-hidden rounded-2xl border-2 border-(--brand-line) bg-(--surface-strong) shadow-xl transition-all duration-300 hover:border-(--brand-orange)">
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-black/40">
                    <img
                      src={beyond.anime.charImage}
                      alt={beyond.anime.favChar}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white space-y-1">
                      <span className="inline-block rounded-full bg-(--brand-orange) px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                        {beyond.anime.charLabel}
                      </span>
                      <h4 className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                        {beyond.anime.favChar}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* KPOP TAB */}
          {activeBeyondTab === 'kpop' && (
            <motion.div
              key="kpop"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-sm leading-relaxed text-(--brand-muted) max-w-2xl">
                {beyond.kpop.summary}
              </p>

              {/* 5 Group Cards Grid */}
              <motion.div
                variants={staggerContainer(0.08, 0.1)}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
              >
                {beyond.kpop.groups.map((group) => (
                  <motion.div
                    key={group.name}
                    variants={staggerItem}
                    className={cn(
                      'group relative overflow-hidden rounded-3xl border border-(--brand-line) bg-(--surface-strong)/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--brand-orange) hover:shadow-xl flex flex-col justify-between bg-linear-to-br',
                      group.color,
                    )}
                  >
                    {/* Ambient background glow blur */}
                    <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-(--brand-orange)/10 blur-3xl group-hover:bg-(--brand-orange)/20 transition-all duration-500" />

                    {/* Top Header: Official Logo + Group Name + Bias Badge */}
                    <div className="relative z-10 flex items-center justify-between gap-3 border-b border-(--brand-line)/60 pb-4 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-11 sm:size-12 shrink-0 rounded-2xl border border-(--brand-line) bg-white/90 overflow-hidden shadow-xs">
                          <img
                            src={group.logoUrl}
                            alt={`${group.name} official logo`}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-(--brand-orange-deep) block leading-tight">
                            K-Pop Artist
                          </span>
                          <h3 className="text-lg sm:text-xl font-black text-(--brand-ink) tracking-tight truncate">
                            {group.name}
                          </h3>
                        </div>
                      </div>

                      {/* Bias Pill Badge */}
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-(--brand-orange-soft) px-3 py-1 text-xs font-black text-(--brand-orange-deep) border border-(--brand-orange)/30 shadow-xs shrink-0">
                        <Sparkles className="size-3.5 text-(--brand-orange)" />
                        <span>
                          {beyond.kpop.biasLabel}:{' '}
                          <strong className="text-(--brand-ink)">
                            {group.bias}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Main Body: Bias Showcase on Left + Vinyl Track Player on Right */}
                    <div className="relative z-10 grid grid-cols-[105px_1fr] sm:grid-cols-[120px_1fr] gap-4 items-center">
                      {/* Left: Bias Portrait with Glass Frame */}
                      <div className="group/bias relative aspect-3/4 w-full rounded-2xl overflow-hidden border-2 border-(--brand-line) bg-black/40 shadow-md group-hover:border-(--brand-orange) transition-colors">
                        <img
                          src={group.biasImage}
                          alt={`${group.bias} (${group.name})`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="size-full object-cover object-top transition-transform duration-500 group-hover/bias:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
                        <div className="absolute inset-x-0 bottom-1.5 text-center">
                          <span className="rounded-md bg-black/75 backdrop-blur-xs px-2 py-0.5 text-[10px] font-black text-white border border-white/20">
                            {group.bias}
                          </span>
                        </div>
                      </div>

                      {/* Right: Vinyl Player & Spotify Action */}
                      <div className="space-y-3 min-w-0">
                        {/* Vinyl Album Player */}
                        <div className="flex items-center gap-3 rounded-2xl border border-(--brand-line) bg-(--site-bg)/90 backdrop-blur-md p-2.5 sm:p-3 shadow-xs">
                          {/* Album Cover with Spinning Vinyl Disk peeking out */}
                          <div className="relative size-12 sm:size-14 shrink-0">
                            {/* Vinyl Disk peeking out */}
                            <div className="absolute top-0 right-0 size-12 sm:size-14 rounded-full bg-black border-2 border-neutral-800 shadow-md flex items-center justify-center translate-x-2.5 group-hover:translate-x-3.5 transition-transform duration-300 animate-spin [animation-duration:8s]">
                              <div className="size-4 sm:size-5 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center">
                                <div className="size-1.5 sm:size-2 rounded-full bg-(--brand-orange)" />
                              </div>
                            </div>

                            {/* Album Cover */}
                            <a
                              href={group.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/album relative z-10 block size-full rounded-xl overflow-hidden shadow-md border border-(--brand-line) cursor-pointer"
                              aria-label={`Play ${group.song} by ${group.name} on Spotify`}
                            >
                              <img
                                src={group.albumCover}
                                alt={`${group.song} album cover`}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                className="size-full object-cover group-hover/album:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/album:opacity-100 transition-opacity">
                                <Play className="size-4 text-white fill-white" />
                              </div>
                            </a>
                          </div>

                          {/* Track Info & Animated Equalizer */}
                          <div className="min-w-0 flex-1 pl-2 sm:pl-2.5 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-(--brand-muted)">
                                {beyond.kpop.songLabel}
                              </span>
                              {/* Equalizer bars */}
                              <div className="flex items-end gap-0.5 h-3">
                                <span className="w-0.5 bg-(--brand-orange) rounded-full animate-pulse h-2" />
                                <span className="w-0.5 bg-(--brand-orange) rounded-full animate-pulse h-3 [animation-delay:150ms]" />
                                <span className="w-0.5 bg-(--brand-orange) rounded-full animate-pulse h-1.5 [animation-delay:300ms]" />
                              </div>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-(--brand-ink) truncate leading-tight">
                              {group.song}
                            </h4>
                          </div>
                        </div>

                        {/* Spotify Direct Button */}
                        <a
                          href={group.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold px-3 py-2 text-xs transition-all shadow-xs hover:shadow-md hover:shadow-emerald-500/20 cursor-pointer"
                          aria-label={`Open ${group.song} on Spotify`}
                        >
                          <span>{beyond.kpop.spotifyLabel}</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
