import { Link } from '@tanstack/react-router'
import { ArrowRight, FileText, Github } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { Container } from '#/components/marketing/section'
import { HeroVisual } from '#/components/visual/hero-visual'
import type { getHomeCopy } from '#/features/home/copy'
import { portfolioStats as defaultPortfolioStats } from '#/features/portfolio/data'
import type { SiteSettingsInput } from '#/features/settings/types'
import { resolveActiveCv } from '#/features/settings/types'
import { fadeUp, staggerContainer, staggerItemScale } from '#/lib/motion'
import { cn } from '#/lib/utils'
import { getLocale } from '#/paraglide/runtime'

type HomeHeroProps = {
  copy: ReturnType<typeof getHomeCopy>
  githubUrl: string
  portfolioStats?: typeof defaultPortfolioStats
  settings?: SiteSettingsInput | null
}

export function HomeHero({
  copy,
  githubUrl,
  portfolioStats = defaultPortfolioStats,
  settings,
}: HomeHeroProps) {
  const [cvNotice, setCvNotice] = useState(false)
  const locale = getLocale()
  const activeCvUrl = resolveActiveCv(locale, settings)

  const handleDownloadCv = (e: React.MouseEvent) => {
    e.preventDefault()
    setCvNotice(true)
    setTimeout(() => setCvNotice(false), 4000)
  }

  return (
    <section className="px-4 pb-16 pt-6 sm:pb-24 sm:pt-20">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Intro text rendered below visual on mobile, left column on desktop */}
        <motion.div
          variants={staggerContainer(0.09, 0.1)}
          initial="hidden"
          animate="visible"
          className="order-2 lg:order-1"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-3 sm:mb-5">
            {copy.hero.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-(--brand-ink) sm:text-5xl sm:leading-[1.05] lg:text-6xl"
          >
            {copy.hero.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-base leading-7 text-(--brand-ink) sm:mt-6 sm:text-lg sm:leading-8"
          >
            {copy.hero.intro}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-2 max-w-xl text-sm leading-6 text-(--brand-muted) sm:mt-3 sm:text-base sm:leading-7"
          >
            {copy.hero.introSuffix}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
          >
            <Link
              to="/about"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-bold text-white no-underline transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {copy.hero.aboutMe}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-sm font-bold text-(--brand-ink) no-underline transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
              >
                <Github aria-hidden="true" className="size-4" />
                GitHub
              </a>
            )}
            {activeCvUrl ? (
              <a
                href={activeCvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-sm font-bold text-(--brand-ink) no-underline transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
              >
                <FileText
                  aria-hidden="true"
                  className="size-4 text-(--brand-orange)"
                />
                {copy.hero.downloadCv}
              </a>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-(--brand-line) bg-(--surface-strong) px-5 text-sm font-bold text-(--brand-ink) transition hover:-translate-y-0.5 hover:border-(--brand-orange)"
                >
                  <FileText
                    aria-hidden="true"
                    className="size-4 text-(--brand-orange)"
                  />
                  {copy.hero.downloadCv}
                </button>

                {cvNotice ? (
                  <div className="absolute left-0 top-full z-20 mt-2.5 w-max max-w-xs rounded-xl border border-(--brand-line) bg-(--brand-dark) px-3.5 py-2.5 text-xs font-semibold text-zinc-100 shadow-md animate-in fade-in slide-in-from-top-1">
                    {copy.hero.cvNotAvailable}
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>

          <motion.div
            variants={staggerContainer(0.07, 0.35)}
            className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-3"
          >
            {portfolioStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={staggerItemScale}
                className={cn(
                  'surface-card p-3.5 sm:p-4',
                  idx === 2 ? 'col-span-2 sm:col-span-1' : '',
                )}
              >
                <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-(--brand-muted) sm:text-xs">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-base font-semibold text-(--brand-ink) sm:mt-2 sm:text-lg">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Visual rendered first on mobile, right column on desktop */}
        <div className="order-1 flex w-full justify-center lg:order-2">
          <HeroVisual />
        </div>
      </Container>
    </section>
  )
}
