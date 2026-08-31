import { Link } from '@tanstack/react-router'
import { ArrowRight, FileText, Github } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { Container } from '#/components/marketing/section'
import { HeroVisual } from '#/components/visual/hero-visual'
import type { getHomeCopy } from '#/features/home/copy'
import { portfolioStats as defaultPortfolioStats } from '#/features/portfolio/data'
import { fadeUp, staggerContainer, staggerItemScale } from '#/lib/motion'

type HomeHeroProps = {
  copy: ReturnType<typeof getHomeCopy>
  githubUrl: string
  portfolioStats?: typeof defaultPortfolioStats
}

export function HomeHero({
  copy,
  githubUrl,
  portfolioStats = defaultPortfolioStats,
}: HomeHeroProps) {
  const [cvNotice, setCvNotice] = useState(false)

  const handleDownloadCv = (e: React.MouseEvent) => {
    e.preventDefault()
    setCvNotice(true)
    setTimeout(() => setCvNotice(false), 4000)
  }

  return (
    <section className="px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Visual rendered first on mobile, right on desktop */}
        <div className="order-1 flex w-full justify-center lg:order-2">
          <HeroVisual />
        </div>

        <motion.div
          variants={staggerContainer(0.09, 0.1)}
          initial="hidden"
          animate="visible"
          className="order-2 lg:order-1"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-5">
            {copy.hero.eyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-(--brand-ink) sm:text-6xl lg:text-7xl"
          >
            {copy.hero.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-8 text-(--brand-ink)"
          >
            {copy.hero.intro}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xl text-base leading-7 text-(--brand-muted)"
          >
            {copy.hero.introSuffix}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/projects"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-(--brand-orange) px-5 text-sm font-bold text-white no-underline shadow-[0_18px_48px_var(--brand-glow)] transition hover:-translate-y-0.5"
            >
              {copy.hero.viewProjects}
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
                <div className="absolute left-0 top-full z-20 mt-2.5 w-max max-w-xs rounded-xl border border-orange-300/30 bg-(--brand-dark) px-3.5 py-2.5 text-xs font-semibold text-[#fff7ec] shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-1">
                  {copy.hero.cvNotAvailable}
                </div>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.07, 0.35)}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {portfolioStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItemScale}
                className="surface-card p-4"
              >
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-(--brand-muted)">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-(--brand-ink)">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
